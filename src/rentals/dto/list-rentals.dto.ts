import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StatusAluguel } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

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
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 20;

  @ApiPropertyOptional({
    description: 'Filtra os aluguéis pelo status',
    example: StatusAluguel.ATIVO,
    enum: StatusAluguel,
  })
  @IsOptional()
  @IsEnum(StatusAluguel)
  status?: StatusAluguel;
}