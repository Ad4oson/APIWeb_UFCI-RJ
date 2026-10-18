import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExtendRentalDto {
  @ApiProperty({ example: 7, description: 'Dias para estender o aluguel', type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(90)
  dias!: number;
}