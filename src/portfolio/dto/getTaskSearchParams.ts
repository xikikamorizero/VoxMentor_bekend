import { IsNotEmpty } from "class-validator";

export class GetTaskSearchParams {
    keyword:string;
    category: string;
    typeId: number;
    page: number;
    limit: number;
}
