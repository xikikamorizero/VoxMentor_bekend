import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { User } from "../users/users.model";

interface PublicationsCreationAttrs {
    title: string;
    year: number;
    type:string;
    link:string;
    docs: string | null;
}

@Table({ tableName: "Publications" })
export class Publications extends Model<Publications, PublicationsCreationAttrs> {
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
    year:number;

    @Column({ type: DataType.STRING, allowNull: true })
    docs: string;

    @Column({ type: DataType.STRING, allowNull: false })
    type: string;

    @Column({ type: DataType.STRING, allowNull: true })
    link: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
}
