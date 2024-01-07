import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreatePortfolioDto {
    @ApiProperty({example: 'Test', description: 'Заголовок'})
    @IsString({message: "Должно быть строкой"})
    readonly title: string;

    @ApiProperty({example: 'test text', description: 'Текст'})
    @IsString({message: "Должно быть строкой"})
    readonly content: string;

    @ApiProperty({example: 12, description: 'id Пользователя'})
    userId: number;
}
