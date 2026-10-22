import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateGameDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @ValidateIf((_obj, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  nome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descricao?: string | null;

  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor_diaria?: number;

  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  quantidade_total?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1901)
  @Max(2155)
  ano_lancamento?: number | null;

  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  numero_jogadores_min?: number;

  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  numero_jogadores_max?: number;

  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(0)
  idade_minima?: number;

  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  duracao_minutos?: number;

  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  @Max(5)
  complexidade?: number;

  @ValidateIf((_obj, value) => value !== undefined)
  @IsBoolean()
  ativo?: boolean;
}
