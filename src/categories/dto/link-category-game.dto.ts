import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class LinkCategoryGameDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id_categoria!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    id_jogo!: number;
}