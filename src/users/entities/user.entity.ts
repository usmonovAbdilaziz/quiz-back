import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Quiz } from '../../test/entities/test.entity';

@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare full_name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare phoneNumber: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'teacher' })
  declare role: string;

  @HasMany(() => Quiz, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare Quizs: Quiz[];
}
