import { Type } from 'class-transformer';
import { 
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    ValidateIf,
 } from 'class-validator';

export class UpdateReviewDto {
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    nota?: number;

    @IsOptional()
     @IsString()
     @MaxLength(5000)
     comentario?: string | null;
}