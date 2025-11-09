import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleError, successMessage } from '../utils/global-response';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CryuptoServise } from 'src/utils/crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly crypto: CryuptoServise,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { email,  password } = createUserDto;
      const exists = await this.userModel.findOne({
        where: { email },
      });
      if (exists) {
        throw new ConflictException('User already exists');
      }

      const hashed = await this.crypto.encrypt(password);
      const newUser: User = await this.userModel.create({
        ...createUserDto,
        password: hashed,
      });
      return successMessage(newUser, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.findAll({ include: ['Quizs'] });
      return successMessage(users);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findByPk(id, { include: ['Quizs'] });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return successMessage(user);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await user.update(updateUserDto);
      return successMessage(user);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await user.destroy();
      return successMessage({ message: 'User deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
