import { Type } from 'class-transformer';
import { FormaPagamento } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'ID do aluguel', type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_aluguel!: number;

  @ApiProperty({ example: 25.5, description: 'Valor do pagamento', type: Number })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor!: number;

  @ApiProperty({ example: 'PIX', description: 'Forma de pagamento', enum: FormaPagamento })
  @IsEnum(FormaPagamento)
  forma_pagamento!: FormaPagamento;
}