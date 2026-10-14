export declare class CreateGameDto {
    nome: string;
    descricao?: string;
    valor_diaria: number;
    quantidade_total: number;
    numero_jogadores_min?: number;
    numero_jogadores_max?: number;
    idade_minima?: number;
    duracao_minutos: number;
    complexidade: number;
    ano_lancamento?: number;
}
