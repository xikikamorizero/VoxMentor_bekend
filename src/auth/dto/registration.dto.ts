import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsEmail, IsString, Length} from "class-validator";

export class RegistrationUserDto {
    @ApiProperty({example: 'user@mail.ru', description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;
    
    @ApiProperty({example: '12345', description: 'пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;

    @ApiProperty({example: 'false', description: 'преподаватель или нет'})
    @IsBoolean({message: 'Должно быть строкой'})
    readonly teacher: boolean;
}
