import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListReviewsDto {
    @ApiPropertyOptional({
        example: 1,
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @ApiPropertyOptional({
        example: 1,
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    id_jogo?: number;

    @ApiPropertyOptional({
        example: 5,
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    nota?: number;
}