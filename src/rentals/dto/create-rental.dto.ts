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
  @ApiProperty({ example: 1, description: 'ID numérico do usuário', type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_usuario!: number;

  @ApiProperty({ example: 1, description: 'ID numérico do jogo', type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_jogo!: number;

  @ApiProperty({ example: 1, description: 'Quantidade de cópias para alugar', type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade = 1;

  @ApiPropertyOptional({ example: '2026-10-24', description: 'Data combinada para a devolução', type: String, format: 'date' })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  data_prevista_devolucao?: Date;

  @ApiPropertyOptional({ example: false, description: 'O aluguel será jogado no próprio local?', type: Boolean })
  @IsOptional()
  @IsBoolean()
  local = false;

  @ApiPropertyOptional({ example: 'Cliente vai retirar no balcão', description: 'Anotações extras sobre o aluguel', type: String })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  observacoes?: string;
}