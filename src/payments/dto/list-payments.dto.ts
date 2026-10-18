import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListPaymentsDto {
  @ApiPropertyOptional({ example: 1, description: 'Página dos resultados', type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 20, description: 'Itens por página', type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 20;

  @ApiPropertyOptional({ example: '2026-10-01', description: 'Data inicial do filtro' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-10-31', description: 'Data final do filtro' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}