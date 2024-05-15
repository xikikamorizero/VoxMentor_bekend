export class GetTaskSearchParams {
    keyword: string;
    place_of_work: string;
    science_degree: string;
    yearsOfExperienceMin: number;
    yearsOfExperienceMax: number;
    awardMin: number;
    awardMax: number;
    publicationsMin: number;
    publicationsMax: number;
    portfolioMin: number;
    portfolioMax: number;
    courseMin: number;
    courseMax: number;
    category:string[];
    page: number;
    limit: number;
}
