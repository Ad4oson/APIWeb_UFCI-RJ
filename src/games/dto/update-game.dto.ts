import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    description: 'Novo nome do jogo',
    example: 'Carcassonne',
    maxLength: 150,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @ValidateIf((_obj, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  nome?: string;

  @ApiPropertyOptional({
    description: 'Nova descrição do jogo',
    example: 'Jogo de estratégia para construir cidades e estradas.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descricao?: string | null;

  @ApiPropertyOptional({
    description: 'Novo valor da diária de aluguel',
    example: 18.5,
    minimum: 0.01,
    type: Number,
  })
  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor_diaria?: number;

  @ApiPropertyOptional({
    description: 'Nova quantidade total de cópias do jogo',
    example: 6,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  quantidade_total?: number;

  @ApiPropertyOptional({
    description: 'Ano de lançamento do jogo',
    example: 2020,
    minimum: 1901,
    maximum: 2155,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1901)
  @Max(2155)
  ano_lancamento?: number | null;

  @ApiPropertyOptional({
    description: 'Nova quantidade mínima de jogadores',
    example: 2,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  numero_jogadores_min?: number;

  @ApiPropertyOptional({
    description: 'Nova quantidade máxima de jogadores',
    example: 4,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  numero_jogadores_max?: number;

  @ApiPropertyOptional({
    description: 'Nova idade mínima recomendada, em anos',
    example: 8,
    minimum: 0,
    type: Number,
  })
  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(0)
  idade_minima?: number;

  @ApiPropertyOptional({
    description: 'Nova duração aproximada de uma partida, em minutos',
    example: 60,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  duracao_minutos?: number;

  @ApiPropertyOptional({
    description: 'Novo nível de complexidade do jogo, de 1 a 5',
    example: 3,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  @Max(5)
  complexidade?: number;

  @ApiPropertyOptional({
    description: 'Indica se o jogo está ativo para aluguel',
    example: true,
    type: Boolean,
  })
  @ValidateIf((_obj, value) => value !== undefined)
  @IsBoolean()
  ativo?: boolean;
}