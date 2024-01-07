import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class CreateLessonDto {
    @ApiProperty({example: 12, description: 'id Пользователя'})
    @IsNumber({}, {message: "Должно быть числом"})
    readonly courseId: number;

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
    @IsNumber({}, {message: "Должно быть числом"})
    readonly lesson_number : number;

    @ApiProperty({example: 'test text', description: 'Текст'})
    readonly reading_materials : string[];
}
