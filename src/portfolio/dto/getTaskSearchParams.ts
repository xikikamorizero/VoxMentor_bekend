import { IsNotEmpty } from "class-validator";

export class GetTaskSearchParams {
    keyword:string;
    category: string;
    type: string;
    page: number;
    limit: number;
}
