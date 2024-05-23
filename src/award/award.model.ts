import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { User } from "../users/users.model";

interface AwardCreationAttrs {
    title: string;
    year: number;
    type: string;
    image: string | null;
    docs: string | null;
}

@Table({ tableName: "Award" })
export class Award extends Model<Award, AwardCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    year: number;

    @Column({ type: DataType.STRING, allowNull: true })
    image: string;

    @Column({ type: DataType.STRING, allowNull: true })
    docs: string;

    @Column({ type: DataType.STRING, allowNull: false })
    type: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;
}
