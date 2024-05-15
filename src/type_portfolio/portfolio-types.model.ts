import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import { Portfolio } from "../portfolio/portfolio.model";
import {Type} from "./types.model";


@Table({tableName: 'PortfolioTypes', createdAt: false, updatedAt: false})
export class PortfolioTypes extends Model<PortfolioTypes> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Type)
    @Column({type: DataType.INTEGER})
    typeId: number;

    @ForeignKey(() => Portfolio)
    @Column({type: DataType.INTEGER})
    portfolioId: number;
}
