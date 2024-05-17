import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateDto {
    @ApiProperty({example: 'Admin', description: 'Создание Роли'})
    @IsString({message: 'Должно быть строкой'})
    readonly valueEn: string;

    @ApiProperty({example: 'Admin', description: 'Создание Роли'})
    @IsString({message: 'Должно быть строкой'})
    readonly valueRu: string;

    @ApiProperty({example: 'Admin', description: 'Создание Роли'})
    @IsString({message: 'Должно быть строкой'})
    readonly valueUz: string;

    @ApiProperty({example: 12, description: 'id Пользователя'})
    userId: number;

    @ApiProperty({example: 'Администратор с полными правами', description: 'Описание роли'})
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;
}