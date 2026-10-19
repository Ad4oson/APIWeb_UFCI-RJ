import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: 'Nova nota atribuída ao jogo, de 1 a 5',
    example: 4,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @Type(() => Number)
  @ValidateIf((_obj, value) => value !== undefined)
  @IsInt()
  @Min(1)
  @Max(5)
  nota?: number;

  @ApiPropertyOptional({
    description: 'Novo comentário sobre o jogo',
    example: 'A partida foi ótima.',
    maxLength: 5000,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(5000)
  comentario?: string | null;
}