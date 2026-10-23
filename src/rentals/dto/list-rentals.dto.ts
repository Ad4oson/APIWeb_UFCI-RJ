import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { StatusAluguel } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class ListRentalsDto {
  @ApiPropertyOptional({
    description: 'Número da página dos resultados',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    description: 'Quantidade máxima de resultados por página',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional({
    description: 'Filtra os aluguéis pelo status',
    example: StatusAluguel.ATIVO,
    enum: StatusAluguel,
  })
  @IsOptional()
  @IsEnum(StatusAluguel)
  status?: StatusAluguel;

  @ApiPropertyOptional({
    description: 'Filtra os aluguéis pelo ID do usuário',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  id_usuario?: number;

  @ApiPropertyOptional({
    description: 'Filtra os aluguéis pelo ID do jogo',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  id_jogo?: number;

  @ApiPropertyOptional({
    description: 'Filtra se o aluguel é para uso no local',
    example: false,
    type: Boolean,
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  local?: boolean;
}