import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateDto } from "./dto/create-type.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Type } from "./types.model";
import { error } from "console";
import { User } from "src/users/users.model";

@Injectable()
export class TypesService {
    constructor(
        @InjectModel(Type) private typeRepository: typeof Type,
        @InjectModel(User) private userRepository: typeof User
    ) {}

    async create(req: any, dto: CreateDto) {
        try {
            const user = await this.userRepository.findByPk(req.user.id);
            if (user) {
                dto.userId = user.id;
                const type = await this.typeRepository.create(dto);
                return type;
            } else {
                throw new HttpException("not found", HttpStatus.NOT_FOUND);
            }
        } catch {
            throw error;
        }
    }

    async getByValue(id: string) {
        const types = await this.typeRepository.findOne({ where: { id } });
        return types;
    }

    async edit(id: number, dto: Partial<CreateDto>) {
        const type = await this.typeRepository.findByPk(id);
        if (type) {
            await type.update({
                ...dto,
            });
        }
        return type;
    }

    async delete(id: number) {
        const types = await this.typeRepository.findByPk(id);
        if (types) {
            await types.destroy();
            return { success: true };
        } else {
            throw new HttpException("not found", HttpStatus.NOT_FOUND);
        }
    }

    async getAll() {
        const types: any = await this.typeRepository.findAll({
            include: {
                all: true,
            },
            order: [["id", "ASC"]],
        });

        return types;
    }
}
