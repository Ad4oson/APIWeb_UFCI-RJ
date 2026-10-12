import { Type } from 'class-transformer';
import { StatusAluguel } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class ListRentalsDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 20;

  @IsOptional()
  @IsEnum(StatusAluguel)
  status?: StatusAluguel;
}