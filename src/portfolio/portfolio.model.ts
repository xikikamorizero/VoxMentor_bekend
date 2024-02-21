import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { User } from "../users/users.model";

interface PortfolioCreationAttrs {
    title: string;
    content: string;
    userId: number;
    image: string |null;
    docs: string | null;
}

@Table({ tableName: "portfolio_ver" })
export class Portfolio extends Model<Portfolio, PortfolioCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    content: string;

    @Column({ type: DataType.STRING, allowNull: true})
    image: string;

    @Column({ type: DataType.STRING, allowNull: true })
    docs: string;

    @Column({ type: DataType.STRING, allowNull: false })
    category: string;

    @Column({ type: DataType.STRING, allowNull: false })
    type: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
}
