import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @ValidateIf((_obj, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nome?: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @ValidateIf((_obj, value) => value !== undefined)
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ValidateIf((_obj, value) => value !== undefined)
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  senha?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string | null;
}
