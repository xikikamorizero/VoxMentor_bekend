import {
    Column,
    Table,
    Model,
    BelongsTo,
    DataType,
    ForeignKey,
    BelongsToMany,
} from "sequelize-typescript";
import { User } from "../users/users.model";
import { Portfolio } from "../portfolio/portfolio.model";

interface DislikeCreationAttrs {
    userId: number;
    portfolioId: number;
}

// @Table({ tableName: "portfolio_dislikes_end" })
// export class PortfolioDislike extends Model<
//     PortfolioDislike,
//     DislikeCreationAttrs
// > {
//     @Column({
//         type: DataType.INTEGER,
//         unique: true,
//         autoIncrement: true,
//         primaryKey: true,
//     })
//     id: number;

//     @ForeignKey(() => Portfolio)
//     @Column
//     portfolioId: number;

//     @ForeignKey(() => User)
//     @Column
//     userId: number;
// }
