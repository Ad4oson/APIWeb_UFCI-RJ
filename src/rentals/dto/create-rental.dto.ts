import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateRentalDto {
  @ApiProperty({
    description: 'Identificador do usuário que realizará o aluguel',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_usuario!: number;

  @ApiProperty({
    description: 'Identificador do jogo que será alugado',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_jogo!: number;

  @ApiPropertyOptional({
    description: 'Quantidade de cópias que serão alugadas',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade = 1;

  @ApiPropertyOptional({
    description: 'Data prevista para a devolução',
    example: '2026-10-24',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  data_prevista_devolucao?: Date;

  @ApiPropertyOptional({
    description: 'Indica se o jogo será utilizado no local',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  local = false;

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre o aluguel',
    example: 'O cliente vai retirar o jogo no balcão.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  observacoes?: string;
}