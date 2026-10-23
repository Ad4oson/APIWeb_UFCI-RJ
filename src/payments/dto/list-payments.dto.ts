import { ApiPropertyOptional } from '@nestjs/swagger';
import { FormaPagamento, StatusPagamento } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class ListPaymentsDto {
  @ApiPropertyOptional({
    description: 'Número da página',
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
    description: 'Quantidade de itens por página',
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
    description: 'Filtrar por status do pagamento',
    enum: StatusPagamento,
    example: StatusPagamento.PAGO,
  })
  @IsOptional()
  @IsEnum(StatusPagamento)
  status?: StatusPagamento;

  @ApiPropertyOptional({
    description: 'Filtrar por forma de pagamento',
    enum: FormaPagamento,
    example: FormaPagamento.PIX,
  })
  @IsOptional()
  @IsEnum(FormaPagamento)
  forma_pagamento?: FormaPagamento;

  @ApiPropertyOptional({
    description: 'Data inicial:',
    example: '2026-10-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final:',
    example: '2026-10-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}