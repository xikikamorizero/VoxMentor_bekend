import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class EditLessonDto {
    @ApiProperty({example: 'test text', description: 'Текст'})
    @IsString({message: "Должно быть строкой"})
    readonly title: string;

    @ApiProperty({example: 'test text', description: 'Текст'})
    @IsString({message: "Должно быть строкой"})
    readonly content : string;

    @ApiProperty({example: 'test text', description: 'Текст'})
    @IsString({message: "Должно быть строкой"})
    readonly description : string;

    @ApiProperty({example: 12, description: 'id Пользователя'})
    readonly lesson_number : number;
}
