import { Transform, Type } from 'class-transformer';
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
    @ValidateIf((_obj, value) => value !== undefined)
    @IsInt()
    @Min(1)
    @Max(5)
    nota?: number;

    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
     )
     @IsString()
     @MaxLength(5000)
     comentario?: string | null;
}