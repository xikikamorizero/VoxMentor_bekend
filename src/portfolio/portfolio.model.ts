import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
} from "sequelize-typescript";
import { User } from "../users/users.model";
import { Type } from "../type_portfolio/types.model";

interface PortfolioCreationAttrs {
    title: string;
    content: string;
    userId: string;
    image: string | null;
    docs: string | null;
    year: number;
}

@Table({ tableName: "Portfolio" })
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

    @Column({ type: DataType.STRING, allowNull: true })
    image: string;

    @Column({ type: DataType.STRING, allowNull: true })
    docs: string;

    @Column({ type: DataType.STRING, allowNull: false })
    category: string;

    @ForeignKey(() => Type)
    @Column({ type: DataType.INTEGER })
    typeId: number;

    @BelongsTo(() => Type)
    type: Type;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;
}
