import {
    Column,
    Table,
    Model,
    DataType,
    ForeignKey,
} from "sequelize-typescript";
import { User } from "../users/users.model";
import { Portfolio } from "../portfolio/portfolio.model";

interface PortfolioLikeCreationAttrs {
    userId: number;
    portfolioId: number;
}

@Table({ tableName: "portfolio_final_end_zalupa" })
export class PortfolioLike extends Model<
    PortfolioLike,
    PortfolioLikeCreationAttrs
> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Portfolio)
    @Column
    portfolioId: number;

    @ForeignKey(() => User)
    @Column
    userId: number;
}
