import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
    BeforeSave,
    ForeignKey
} from "sequelize-typescript";
import { Lesson } from "./lesson/lesson.model";
import { User } from "src/users/users.model";

interface CourseCreationAttrs {
    title: string;
    description: string;
    level: string;
    category: string;
    image: string;
}

@Table({ tableName: "Course" })
export class Course extends Model<Course, CourseCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT })
    description: string;

    @Column({ type: DataType.STRING })
    level: string;

    @Column({ type: DataType.STRING })
    category: string;

    @Column({ type: DataType.STRING })
    image: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    authorId: number;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    lessonCount: number;
    
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    year:number;

    @HasMany(() => Lesson)
    lessons: Lesson[];

    // Хук перед обновлением
    @BeforeSave
    static async updateLessonCount(instance: Course) {
        const lessonCount = await Lesson.count({
            where: { courseId: instance.id },
        });
        instance.lessonCount = lessonCount;
    }
}
