import {
    HasMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Portfolio } from "../portfolio/portfolio.model";
import { PortfolioTypes } from "./portfolio-types.model";

interface TypeCreationAttrs {
    value: string;
    description: string;
}

@Table({ tableName: "Type" })
export class Type extends Model<Type, TypeCreationAttrs> {
    @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "", description: "Уникальное значение типа " })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    value: string;

    @ApiProperty({ example: "", description: "Описание типа" })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @HasMany(() => Portfolio)
    portfolios: Portfolio[];
}
