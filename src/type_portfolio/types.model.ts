import {
    HasMany,
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
    BeforeSave
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Portfolio } from "../portfolio/portfolio.model";
import { PortfolioTypes } from "./portfolio-types.model";
import { User } from "../users/users.model";

interface TypeCreationAttrs {
    valueEn: string;
    valueRu: string;
    valueUz: string;
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
    valueEn: string;

    @ApiProperty({ example: "", description: "Уникальное значение типа " })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    valueRu: string;

    @ApiProperty({ example: "", description: "Уникальное значение типа " })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    valueUz: string;

    @ApiProperty({ example: "", description: "Уникальное значение типа " })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    count: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @ApiProperty({ example: "", description: "Описание типа" })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string;
}
