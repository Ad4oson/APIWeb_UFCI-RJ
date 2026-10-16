import { Transform } from 'class-transformer';
import { 
    IsString,
    MaxLength,
    MinLength,
    ValidateIf
} from 'class-validator';

export class UpdateCategoryDto {
    @Transform(({ value }) => 
    typeof value === 'string' ? value.trim() : value,)

    @ValidateIf((_obj, value) => value !== undefined)
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nome?: string;

}