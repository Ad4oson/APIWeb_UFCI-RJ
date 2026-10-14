import { FormaPagamento } from '@prisma/client';
export declare class CreatePaymentDto {
    id_aluguel: number;
    valor: number;
    forma_pagamento: FormaPagamento;
}
