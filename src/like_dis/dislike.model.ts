import {
    Column,
    Table,
    Model,
    ForeignKey,
    DataType,
} from "sequelize-typescript";
import { User } from "../users/users.model";

interface DislikeCreationAttrs {
    userId: string;
    dislikedUserId: string;
}

@Table({ tableName: "Dislike" })
export class Dislike extends Model<Dislike, DislikeCreationAttrs> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    dislikedUserId: string;
}
