import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class BanUserDto {
    @ApiProperty({example: '12', description: 'id пользователя'})
    @IsNumber({}, {message: "Должно быть числом"})
    readonly userId: number;

    @ApiProperty({example: 'хулиганство', description: 'Причина'})
    @IsString({message: "Должно быть строкой"})
    readonly banReason: string;
}
