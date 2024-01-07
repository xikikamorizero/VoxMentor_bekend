import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class AddRoleDto {
    @ApiProperty({example: 'Admin', description: 'Роль'})
    @IsString({message: "Должно быть строкой"})
    readonly value: string;

    @ApiProperty({example: '12', description: 'id пользователя'})
    @IsNumber({}, {message: "Должно быть числом"})
    readonly userId: number;
}
