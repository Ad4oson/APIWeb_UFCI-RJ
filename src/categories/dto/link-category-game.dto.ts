import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class LinkCategoryGameDto {
  @ApiProperty({
    description: 'Identificador da categoria',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_categoria!: number;

  @ApiProperty({
    description: 'Identificador do jogo',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_jogo!: number;
}