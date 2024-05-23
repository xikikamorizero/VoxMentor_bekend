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
    likesMin: number;
    likesMax: number;
    dislikesMin: number;
    dislikesMax: number;
    category: string[];
    
    sortBy: string;
    sortOrder: "ASC" | "DESC";

    page: number;
    limit: number;
}
