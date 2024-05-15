import { Injectable } from "@nestjs/common";
import { CreateDto } from "./dto/create-type.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Type } from "./types.model";

@Injectable()
export class TypesService {
    constructor(@InjectModel(Type) private typeRepository: typeof Type) {}

    async create(dto: CreateDto) {
        console.log("Я сделяль");
        const role = await this.typeRepository.create(dto);
        return role;
    }

    async getByValue(value: string) {
        const role = await this.typeRepository.findOne({ where: { value } });
        return role;
    }

    async edit(id: number, dto:Partial<CreateDto>) {
        const role = await this.typeRepository.findByPk(id);
        if(role){
            await role.update({
              ...dto
            });
        }
        return role;
    }

    async delete(id: number) {
        const role = await this.typeRepository.findByPk(id);
        if(role){
            await role.destroy();
        }
        return role;
    }


    async getAll() {
        const role: any = await this.typeRepository.findAll({
            include: {
                all: true,
                attributes: {
                    exclude: ["password"],
                },
            },
        });
        return role;
    }
}
