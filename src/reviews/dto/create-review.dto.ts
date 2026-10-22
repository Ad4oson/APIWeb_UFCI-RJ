import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateReviewDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id_usuario!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    id_jogo!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    nota!: number;

    @IsOptional()
    @IsString()
    @MaxLength(5000)
    comentario?: string | null;

}