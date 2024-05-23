import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class CreateCourseDto {
    @ApiProperty({example: 'test text', description: 'Текст'})
    @IsString({message: "Должно быть строкой"})
    readonly title: string;

    @ApiProperty({example: 'test text', description: 'Текст'})
    @IsString({message: "Должно быть строкой"})
    readonly description : string;

    @ApiProperty({example: 12, description: 'id Пользователя'})
    @IsString({message: "Должно быть строкой"})
    readonly level: string;

    @ApiProperty({example: 'test', description: 'категория'})
    @IsString({message: "Должно быть строкой"})
    readonly category : string;

    readonly year: number;

    @ApiProperty({example: 12, description: 'id Пользователя'})
    authorId?: string;
}
