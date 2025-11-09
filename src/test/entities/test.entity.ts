import {
  Model,
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { QuestionDto } from '../dto/create-test.dto';

@Table({ tableName: 'quizs' })
export class Quiz extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare teacherId: string;

  @Column({ type: DataType.JSON, allowNull: false, defaultValue: [] })
  declare questions: QuestionDto[] | [];

  @BelongsTo(() => User)
  declare teacher: User;
}
