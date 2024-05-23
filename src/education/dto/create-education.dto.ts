import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateEducationDto {
    @ApiProperty({example: 'Test', description: 'Заголовок'})
    @IsString({message: "Должно быть строкой"})
    readonly title: string;

    @IsString({message: "Должно быть строкой"})
    readonly date: string;

    @ApiProperty({example: 12, description: 'id Пользователя'})
    userId: string;
}
