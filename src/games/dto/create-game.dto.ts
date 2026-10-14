import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateGameDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  nome!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descricao?: string | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor_diaria!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade_total!: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1901)
  @Max(2155)
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
}
