import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class ExtendRentalDto {
  @ApiProperty({
    description: 'Quantidade de dias a acrescentar ao prazo do aluguel',
    example: 7,
    minimum: 1,
    maximum: 90,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(90)
  dias!: number;
}