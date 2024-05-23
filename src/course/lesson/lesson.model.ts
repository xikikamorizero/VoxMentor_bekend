import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Course } from '../course.model';


interface LessonCreationAttrs {
  courseId:number;
  title: string;
  content:string|null;
  description : string|null;
  image:string;
  lesson_number : number|null;
  // reading_materials : string[];
}

@Table({ tableName: 'Lesson'})
export class Lesson extends Model<Lesson, LessonCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  content: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  lesson_number: number;

  // @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  // reading_materials: string[];

  @ForeignKey(() => Course)
  @Column({ type: DataType.INTEGER })
  courseId: number;
}
