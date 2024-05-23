import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTraningDto {
    @ApiProperty({ example: "Test", description: "Заголовок" })
    @IsString({ message: "Должно быть строкой" })
    readonly title: string;

    @ApiProperty({ example: "Test", description: "Заголовок" })
    @IsString({ message: "Должно быть строкой" })
    readonly date: string;

    readonly hoursSpent: number;

    @ApiProperty({ example: "Test", description: "Заголовок" })
    @IsString({ message: "Должно быть строкой" })
    readonly location: string;

    @ApiProperty({ example: "Test", description: "Заголовок" })
    @IsString({ message: "Должно быть строкой" })
    readonly organization: string;

    @ApiProperty({ example: 12, description: "id Пользователя" })
    userId: string;
}
