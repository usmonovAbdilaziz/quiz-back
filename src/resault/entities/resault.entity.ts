import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { CreateQuizDto } from 'src/test/dto/create-test.dto';

@Table({ tableName: 'results' })
export class Result extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare testId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare studentId: string;
  
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare questions: CreateQuizDto[];
}
