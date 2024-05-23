import {
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/user-roles.model";
import { Exclude } from "class-transformer";
import { Course } from "../course/course.model";
import { Portfolio } from "src/portfolio/portfolio.model";
import { Subscription } from "./user_follow.model";
import { Like } from "../like_dis/like.model";
import { Dislike } from "../like_dis/dislike.model";
import { Award } from "../award/award.model";
import { Publications } from "../publications/publications.model";
import { Education } from "src/education/education.model";
import { Traning } from "src/training/training.model";
import { v4 as uuidv4 } from 'uuid';

interface UserCreationAttrs {
    email: string;
    password: string;
    image?: string | null;
}

@Table({ tableName: "User" })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: "12345678", description: "Пароль" })
    @Column({ type: DataType.STRING, allowNull: false })
    @Exclude()
    password: string;

    @ApiProperty({
        example: "Кузнецов Сергей Константинович",
        description: "ФИО",
    })
    @Column({ type: DataType.STRING })
    name: string;

    @ApiProperty({
        example:
            "https://img.freepik.com/free-photo/a-picture-of-fireworks-with-a-road-in-the-background_1340-43363.jpg",
        description: "аватарка пользователя",
    })
    @Column({ type: DataType.STRING, allowNull: true })
    avatar: string;

    @ApiProperty({
        example: "Я профессор математических наук в МГУ",
        description: "Обо мне",
    })
    @Column({ type: DataType.TEXT, allowNull: true })
    description: string;
    
    @ApiProperty({ example: "НУУЗ", description: "Место работы пользователя" })
    @Column({ type: DataType.STRING, allowNull: true })
    place_of_work: string;

    @ApiProperty({
        example: "Associate Professor",
        description: "Должность преподавателя",
    })
    @Column({ type: DataType.STRING, allowNull: true })
    position: string;

    @ApiProperty({ example: "Профессор", description: "Научная степень" })
    @Column({ type: DataType.STRING, allowNull: true })
    science_degree: string;

    @ApiProperty({ example: "10", description: "Стаж работы в годах" })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    yearsOfExperience: number;

    @ApiProperty({
        example: "Математика, Информатика, Физика",
        description: "Предметы",
    })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    categories: string[];

    @ApiProperty({ example: "+************", description: "Способ связи" })
    @Column({ type: DataType.STRING, allowNull: true })
    contacts: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @ApiProperty({ example: "10", description: "Стаж работы в годах" })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    awardsCount: number;

    @HasMany(() => Award)
    awards: Award[];

    @HasMany(() => Traning)
    traning: Traning[];

    @HasMany(() => Education)
    education: Education[];

    @ApiProperty({ example: "10", description: "Стаж работы в годах" })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    publicationsCount: number;

    @HasMany(() => Publications)
    publications: Publications[];

    @ApiProperty({ example: "10", description: "Стаж работы в годах" })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    courseCount: number;

    @HasMany(() => Course)
    course: Course[];

    @ApiProperty({ example: "10", description: "Стаж работы в годах" })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    portfolioCount: number;

    @HasMany(() => Portfolio)
    portfolio: Portfolio[];

    @BelongsToMany(() => User, () => Subscription, "subscriberId", "authorId")
    subscriptions: User[];

    @BelongsToMany(() => User, () => Subscription, "authorId", "subscriberId")
    subscribers: User[];

    @ApiProperty({ example: 0, description: "Количество лайков" })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    likes: number;

    @ApiProperty({ example: 0, description: "Количество дизлайков" })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    dislikes: number;

    @BelongsToMany(() => User, () => Like, "userId", "likedUserId")
    likedUsers: User[];

    @BelongsToMany(() => User, () => Dislike, "userId", "dislikedUserId")
    dislikedUsers: User[];
}
