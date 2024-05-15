import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateDto {
    @ApiProperty({example: 'Admin', description: 'Создание Роли'})
    @IsString({message: 'Должно быть строкой'})
    readonly value: string;

    @ApiProperty({example: 'Администратор с полными правами', description: 'Описание роли'})
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;
}