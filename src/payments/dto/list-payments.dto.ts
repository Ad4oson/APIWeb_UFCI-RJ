import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class ListPaymentsDto {
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
    description: 'Data inicial para filtrar os pagamentos',
    example: '2026-10-01',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final para filtrar os pagamentos',
    example: '2026-10-31',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}