import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FormaPagamento } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Identificador do aluguel associado ao pagamento',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_aluguel!: number;

  @ApiProperty({
    description: 'Valor do pagamento',
    example: 25.5,
    minimum: 0.01,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor!: number;

  @ApiProperty({
    description: 'Forma utilizada para realizar o pagamento',
    example: FormaPagamento.PIX,
    enum: FormaPagamento,
  })
  @IsEnum(FormaPagamento)
  forma_pagamento!: FormaPagamento;
}