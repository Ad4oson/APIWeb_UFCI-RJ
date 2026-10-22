import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Nome do jogo',
    example: 'Carcassonne',
    maxLength: 150,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  nome!: string;

  @ApiPropertyOptional({
    description: 'Descrição do jogo',
    example: 'Jogo de estratégia para construir cidades e estradas.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descricao?: string | null;

  @ApiProperty({
    description: 'Valor da diária de aluguel',
    example: 15.5,
    minimum: 0.01,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor_diaria!: number;

  @ApiProperty({
    description: 'Quantidade total de cópias disponíveis para cadastro',
    example: 5,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade_total!: number;

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
    description: 'Quantidade mínima de jogadores',
    example: 2,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  numero_jogadores_min?: number;

  @ApiPropertyOptional({
    description: 'Quantidade máxima de jogadores',
    example: 4,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  numero_jogadores_max?: number;

  @ApiPropertyOptional({
    description: 'Idade mínima recomendada, em anos',
    example: 8,
    minimum: 0,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  idade_minima?: number;

  @ApiPropertyOptional({
    description: 'Duração aproximada de uma partida, em minutos',
    example: 60,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  duracao_minutos?: number;

  @ApiPropertyOptional({
    description: 'Nível de complexidade do jogo, de 1 a 5',
    example: 3,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  complexidade?: number;
}