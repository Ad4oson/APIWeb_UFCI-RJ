import {
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nome?: string;
}