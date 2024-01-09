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

interface UserCreationAttrs {
    email: string;
    password: string;
    image?:string | null;
}

@Table({ tableName: "users_end" })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: "12345678", description: "Пароль" })
    @Column({ type: DataType.STRING, allowNull: false })
    @Exclude()
    password: string;

    @ApiProperty({ example: "Кузнецов Сергей Константинович", description: "ФИО" })
    @Column({ type: DataType.STRING })
    name:string;

    @ApiProperty({ example: "https://img.freepik.com/free-photo/a-picture-of-fireworks-with-a-road-in-the-background_1340-43363.jpg", description: "аватарка пользователя" })
    @Column({ type: DataType.STRING, allowNull: true })
    avatar:string;

    @ApiProperty({ example: "Я профессор математических наук в МГУ", description: "Обо мне" })
    @Column({ type: DataType.STRING, allowNull: true })
    description:string;

    @ApiProperty({ example: "НУУЗ", description: "Место работы пользователя" })
    @Column({ type: DataType.STRING, allowNull: true })
    place_of_work:string;

    @ApiProperty({ example: "Профессор", description: "Научная степень" })
    @Column({ type: DataType.STRING, allowNull: true})
    science_degree:string;

    @ApiProperty({ example: "Математика, Информатика, Физика", description: "Предметы" })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    categories:string[];

    @ApiProperty({ example: "+************", description: "Способ связи" })
    @Column({ type: DataType.STRING, allowNull: true})
    contacts:string;

    @ApiProperty({ example: "true", description: "Забанен или нет" })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    banned: boolean;

    @ApiProperty({
        example: "За хулиганство",
        description: "Причина блокировки",
    })
    @Column({ type: DataType.STRING, allowNull: true })
    banReason: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @HasMany(() => Course)
    course: Course[];

    @HasMany(() => Portfolio)
    postfolio: Portfolio[];

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
