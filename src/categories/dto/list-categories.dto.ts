import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class ListCategoriesDto {

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
    limit?: number = 10;

    @ApiPropertyOptional({
        example: 1,
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    id?: number;

    @ApiPropertyOptional({
        example: 'Estratégia',
    })
    @IsOptional()
    @IsString()
    nome?: string;
}