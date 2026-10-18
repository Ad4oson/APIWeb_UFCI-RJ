import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRentalDto {
  @ApiProperty({ example: 1, description: 'ID do usuário', type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_usuario!: number;

  @ApiProperty({ example: 1, description: 'ID do jogo', type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_jogo!: number;

  @ApiProperty({ example: 1, description: 'Quantidade de jogos', type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade = 1;

  @ApiPropertyOptional({ example: '2026-10-24', description: 'Data prevista para devolução', type: String, format: 'date' })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  data_prevista_devolucao?: Date;

  @ApiPropertyOptional({ example: false, description: 'Indica aluguel no local', type: Boolean })
  @IsOptional()
  @IsBoolean()
  local = false;

  @ApiPropertyOptional({ example: 'Retirada no balcão', description: 'Observações do aluguel', type: String })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  observacoes?: string;
}