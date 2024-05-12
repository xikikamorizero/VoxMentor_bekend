import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { User } from "../users/users.model";

interface EducationCreationAttrs {
    title: string;
    date: string;
    image: string |null;
    docs: string | null;
}

@Table({ tableName: "Education" })
export class Education extends Model<Education, EducationCreationAttrs> {
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
    date:string;

    @Column({ type: DataType.STRING, allowNull: true})
    image: string;

    @Column({ type: DataType.STRING, allowNull: true })
    docs: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
}
