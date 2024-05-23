import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { User } from "../users/users.model";

interface TraningCreationAttrs {
    title: string;
    date: string;
    location: string;
    organization: string;
    hoursSpent: number;
    image: string | null;
    docs: string | null;
}

@Table({ tableName: "Traning" })
export class Traning extends Model<Traning, TraningCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, allowNull: false })
    date: string;

    @Column({ type: DataType.STRING, allowNull: false })
    location: string;

    @Column({ type: DataType.STRING, allowNull: false })
    organization: string;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    hoursSpent: number;

    // @Column({ type: DataType.STRING, allowNull: true })
    // image: string;

    @Column({ type: DataType.STRING, allowNull: true })
    docs: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;
}
