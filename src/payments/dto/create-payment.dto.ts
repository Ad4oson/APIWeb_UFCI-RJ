import { Type } from 'class-transformer';
import { FormaPagamento } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_aluguel!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor!: number;

  @IsEnum(FormaPagamento)
  forma_pagamento!: FormaPagamento;
}