import { StatusAluguel } from '@prisma/client';
export declare class ListRentalsDto {
    page: number;
    limit: number;
    status?: StatusAluguel;
}
