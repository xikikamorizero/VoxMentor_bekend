import { Column, Table, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { User } from '../users/users.model';

interface LikeCreationAttrs {
  userId: number;
  likedUserId: number;
}

@Table({ tableName: "likes_end" })
export class Like extends Model<Like, LikeCreationAttrs> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    likedUserId: number;
}