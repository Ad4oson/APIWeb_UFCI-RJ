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
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  nome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descricao?: string | null;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor_diaria?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  quantidade_total?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  ano_lancamento?: number | null;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  numero_jogadores_min?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  numero_jogadores_max?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  idade_minima?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  duracao_minutos?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  complexidade?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
