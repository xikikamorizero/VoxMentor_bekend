import {
    Column,
    Table,
    Model,
    ForeignKey,
    DataType,
} from "sequelize-typescript";
import { User } from "../users/users.model";

interface LikeCreationAttrs {
    userId: string;
    likedUserId: string;
}

@Table({ tableName: "Like" })
export class Like extends Model<Like, LikeCreationAttrs> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    likedUserId: string;
}
