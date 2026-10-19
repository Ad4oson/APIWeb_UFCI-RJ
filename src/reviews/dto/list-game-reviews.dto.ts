import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { 
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min
 } from 'class-validator';

 export class ListGameReviewsDto {
    @ApiPropertyOptional()
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    nota?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    usuario?: string;
 }