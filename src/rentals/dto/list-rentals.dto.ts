import { Type } from 'class-transformer';
import { StatusAluguel } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListRentalsDto {
  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Página dos resultados',
    type: Number
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ 
    example: 20, 
    description: 'Itens por página',
    type: Number
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 20;

  @ApiPropertyOptional({
    example: 'ATIVO',
    description: 'Filtrar pelo status do aluguel',
    enum: StatusAluguel
  })
  @IsOptional()
  @IsEnum(StatusAluguel)
  status?: StatusAluguel;
}