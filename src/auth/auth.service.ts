import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { RegistrationUserDto } from "./dto/registration.dto";
import UsersService from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/users.model";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    async registration(userDto: RegistrationUserDto) {
        try {
            const candidate = await this.userService.getUserByEmail(
                userDto.email
            );
            if (candidate) {
                throw new HttpException("пользователь с таким email уже существует", HttpStatus.CONFLICT);
            }
            const hashPassword = await bcrypt.hash(userDto.password, 5);
            const newUser = { email: userDto.email, password: hashPassword };
            const user = await this.userService.createUser(newUser);
            if (userDto.teacher) {
                const roleTec = await this.userService.addRole({
                    value: "Professor",
                    userId: user.id,
                });
            }
            return this.generateToken(user);
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                throw new HttpException(
                    "Ошибка при регистрации пользователя",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles };
        return {
            token: this.jwtService.sign(payload),
        };
    }

    private async validateUser(userDto: CreateUserDto) {
        try{
            const user = await this.userService.getUserByEmail(userDto.email);
            const passwordEquals = await bcrypt.compare(
                userDto.password,
                user.password
            );
            if (user && passwordEquals) {
                return user;
            }else{
                throw new HttpException(
                    "Ошибка при авторизации пользователя",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
        catch{
            throw new HttpException(
                "Неправильный email или пароль",
                HttpStatus.CONFLICT
            );
        }
    }
}
