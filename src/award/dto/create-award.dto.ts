import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateAwardDto {
    @ApiProperty({example: 'Test', description: 'Заголовок'})
    @IsString({message: "Должно быть строкой"})
    readonly title: string;

    readonly year: number;

    @ApiProperty({example: 'Докторская', description: 'Type'})
    @IsString({message: "Должно быть строкой"})
    readonly type: string;

    @ApiProperty({example: 12, description: 'id Пользователя'})
    userId: number;
}
