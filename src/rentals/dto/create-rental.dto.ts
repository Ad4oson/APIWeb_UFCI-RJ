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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_usuario!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_jogo!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade = 1;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  data_prevista_devolucao?: Date;

  @IsOptional()
  @IsBoolean()
  local = false;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  observacoes?: string;
}