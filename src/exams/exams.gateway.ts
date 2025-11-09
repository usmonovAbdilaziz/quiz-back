import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResaultService } from 'src/resault/resault.service';
import { QuizService } from 'src/test/test.service';

interface RoomData {
  teacher: { teacherId: string; quizId: string };
  students: Map<string, any>;
  endTime?: string;
}

@WebSocketGateway({ namespace: '/exam', cors: { origin: '*' } })
export class ExamsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly resultService: ResaultService,
    private readonly quizService: QuizService,
  ) {}

  // ✅ Har bir room uchun ma’lumotlar
  private rooms: Map<string, RoomData> = new Map();

  // 🔹 1. Foydalanuvchi ulanadi
  async handleConnection(socket: Socket) {
    const { quizId, teacherId, name, roomId, studentId } =
      socket.handshake.query;

    if (!roomId) {
      console.log('❌ Missing roomId');
      socket.disconnect();
      return;
    }

    const roomKey = String(roomId);

    // 🏫 TEACHER kirgan bo‘lsa
    if (teacherId && quizId) {
      if (!this.rooms.has(roomKey)) {
        this.rooms.set(roomKey, {
          teacher: { teacherId: String(teacherId), quizId: String(quizId) },
          students: new Map(),
        });
      }

      socket.join(roomKey);
      console.log(
        `🧑‍🏫 Teacher (${teacherId}) created room ${roomId} (quiz: ${quizId})`,
      );

      socket.emit('room-ready', {
        roomId,
        quizId,
        message: '✅ Room tayyor. Endi studentlar ulanishi mumkin.',
      });
      return;
    }

    // 🎓 STUDENT kirgan bo‘lsa
    if (studentId && name) {
      if (!this.rooms.has(roomKey)) {
        socket.emit('error', {
          message: '❌ Room topilmadi yoki hali yaratilmagan.',
        });
        socket.disconnect();
        return;
      }

      const room = this.rooms.get(roomKey)!;
      room.students.set(String(studentId), { studentId, name });

      socket.join(roomKey);
      console.log(`🟢 ${name} (${studentId}) joined room ${roomId}`);

      const allStudents = Array.from(room.students.values());

      this.server.to(roomKey).emit('user-joined', {
        studentId,
        name,
        teacherId: room.teacher.teacherId,
        count: allStudents.length,
        students: allStudents,
      });
    }
  }

  // 🔹 2. Foydalanuvchi uzildi
  async handleDisconnect(socket: Socket) {
    const { roomId, studentId } = socket.handshake.query;
    if (!roomId || !studentId) return;

    const roomKey = String(roomId);
    const studentKey = String(studentId);

    if (this.rooms.has(roomKey)) {
      const room = this.rooms.get(roomKey)!;
      room.students.delete(studentKey);

      console.log(`🔴 Student (${studentId}) left room ${roomId}`);

      this.server.to(roomKey).emit('user-left', { studentId });

      // Agar xona bo‘sh bo‘lsa, o‘chir
      if (room.students.size === 0) {
        this.rooms.delete(roomKey);
        console.log(`🗑 Room ${roomId} deleted (empty)`);
      }
    }
  }

  // 🔹 3. O‘qituvchi testni boshlaydi
  @SubscribeMessage('start-exam')
  async handleStartExam(
    @MessageBody()
    payload: { quizId: string; roomId: string; endTime: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { quizId, roomId, endTime } = payload;

    const room = this.rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: '❌ Room not found' });
      return;
    }

    // ⏰ endTime ni shu room’ga yozamiz
    room.endTime = endTime;

    const quizs = await this.quizService.findOne(quizId);
    if (!quizs) {
      socket.emit('error', { message: '❌ Quiz not found' });
      return;
    }

    const data = quizs.data as any;

    this.server.to(roomId).emit('quiz-started', {
      message: '📘 Quiz boshlandi!',
      quizId,
      startTime: new Date(),
      endTime: room.endTime,
      quiz: data.dataValues,
    });
  }

  // 🔹 4. Natija yaratish
  @SubscribeMessage('create-result')
  async handleCreateResult(
    @MessageBody()
    payload: {
      studentId: string;
      name: string;
      quizId: string;
      questions: any;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const roomId = String(socket.handshake.query.roomId);
    if (!roomId) {
      socket.emit('error', { message: '❌ RoomId topilmadi' });
      return;
    }

    try {
      const quiz = await this.quizService.findOne(payload.quizId);
      if (!quiz) {
        socket.emit('error', { message: '❌ Quiz topilmadi' });
        return;
      }
      const {dataValues} = quiz.data as any

      const resultData = await this.resultService.create({
        studentId: payload.studentId,
        name: payload.name,
        testId: payload.quizId,
        questions: payload.questions,
      });

      console.log(`🆕 Result created for ${payload.name}`);

      this.server.to(roomId).emit('result-created', {
        studentId: payload.studentId,
        name: payload.name,
        result: resultData,
        questions: dataValues.questions,
      });

      socket.emit('result-saved', { success: true, result: resultData });
    } catch (error) {
      console.error('❌ Result yaratishda xato:', error);
      socket.emit('result-saved', { success: false, error: error.message });
    }
  }

  // 🔹 5. Student javob yuboradi
  @SubscribeMessage('exam-answer')
  async handleAnswerExam(
    @MessageBody()
    payload: {
      resultId: string;
      studentId: string;
      quizId: string;
      name: string;
      questions: { title: string; answer1: string }[];
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const { resultId, studentId, quizId, name, questions } = payload;
    const roomId = String(socket.handshake.query.roomId);

    try {
      const updated = await this.resultService.update(resultId, {
        testId: quizId,
        questions,
      });

      this.server.to(roomId).emit('exam-answer', {
        studentId,
        name,
        result: updated,
      });
    } catch (error) {
      console.error('❌ Result update xato:', error);
      socket.emit('error', { message: 'Result saqlashda xato yuz berdi' });
    }
  }

  // 🔹 6. Xonadagi barcha javoblarni olish
  @SubscribeMessage('answer')
  async handleAnswers(
    @MessageBody() payload: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const roomId = String(socket.handshake.query.roomId);
    try {
      const answers = await this.resultService.findAll();
      this.server.to(roomId).emit('exam-answer', { result: answers });
      return answers;
    } catch (error) {
      console.log('answer find error', error);
    }
  }

  // 🔹 7. Room yopish
  @SubscribeMessage('close-room')
  async handleCloseRoom(
    @MessageBody() payload: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = payload;
    const room = this.rooms.get(roomId);

    if (room) {
      const { endTime } = room;
      this.rooms.delete(roomId);
      this.server.to(roomId).emit('room-closed', { roomId, endTime });
    }
  }
}

/*import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResaultService } from 'src/resault/resault.service';
import { QuizService } from 'src/test/test.service';

@WebSocketGateway({ namespace: '/exam', cors: { origin: '*' } })
export class ExamsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly resultService: ResaultService,
    private readonly quizService: QuizService,
  ) {}

  // Har bir room uchun studentlar ro‘yxati
  private rooms: Map<string, Set<string>> = new Map();

  async handleConnection(socket: Socket) {
    const { quizId, roomId, studentId, teacherId, name } = socket.handshake.query;

    if (!roomId) {
      console.log('⚠️ Ulanishda roomId yo‘q, socket uzildi');
      socket.disconnect();
      return;
    }

    /** 🧑‍🎓 Student ulanmoqda 
    if (studentId) {
      socket.join(roomId);

      // Room hali yo‘q bo‘lsa, yangi Set yaratamiz
      if (!this.rooms.has(String(roomId))) {
        this.rooms.set(String(roomId), new Set());
      }

      // Studentni Set ichiga qo‘shamiz
      this.rooms.get(String(roomId))?.add(String(studentId));

      console.log(`🟢 Student connected: ${name} (${studentId}) -> room ${roomId}`);
      console.log('Rooms state:', this.rooms);

      // Shu roomdagi barcha foydalanuvchilarga student qo‘shilgani haqida xabar
      this.server.to(roomId).emit('student-joined', {
        studentId,
        name,
        quizId,
        count: this.rooms.get(String(roomId))?.size,
      });
    }

    /** 👨‍🏫 Teacher ulanmoqda 
    else if (teacherId && quizId) {
      console.log(`👨‍🏫 Teacher connected: ${teacherId}, room ${roomId}, quiz ${quizId}`);
      socket.join(roomId);

      // Agar xonada studentlar bor bo‘lsa, ularga ro‘yxatni yuboramiz
      const studentsInRoom = Array.from(this.rooms.get(String(roomId)) || []);
      this.server.to(socket.id).emit('students:list', studentsInRoom);
    }

    /** ❌ No valid query 
    else {
      console.log('❌ Noto‘g‘ri query, socket uzildi');
      socket.disconnect();
    }
  }

  /** 🔌 Ulanish uzildi 
  handleDisconnect(socket: Socket) {
    console.log(`🔴 Client disconnected: ${socket.id}`);

    // Studentni topib o‘chirish
    for (const [roomId, studentSet] of this.rooms.entries()) {
      if (studentSet.has(socket.id)) {
        studentSet.delete(socket.id);
        this.server.to(roomId).emit('student-left', { studentId: socket.id });
        console.log(`🚪 Student ${socket.id} chiqdi xonadan ${roomId}`);
      }
      if (studentSet.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  /** 🚀 Teacher testni boshlaganda 
  startExam(roomId: string, quizId: string) {
    this.server.to(roomId).emit('exam:start', quizId);
    console.log(`🚀 Exam started for room: ${roomId}`);
  }
}*/
