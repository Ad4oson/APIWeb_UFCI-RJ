import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { StatusAluguel } from '@prisma/client';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Número da página', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Registros por página',
    example: 10,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class ListUsersDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtra pelo nome' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @ApiPropertyOptional({ description: 'Filtra pelo e-mail' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ description: 'Filtra pelo CPF' })
  @IsOptional()
  @IsString()
  @MaxLength(14)
  cpf?: string;

  @ApiPropertyOptional({ description: 'Filtra pelo estado ativo', example: true })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  ativo?: boolean;
}

export class ListUserRentalsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtra pelo status do aluguel', enum: StatusAluguel })
  @IsOptional()
  @IsEnum(StatusAluguel)
  status?: StatusAluguel;

  @ApiPropertyOptional({ description: 'Filtra pelo ID do jogo', example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  jogoId?: number;

  @ApiPropertyOptional({ description: 'Data inicial do aluguel em formato ISO' })
  @IsOptional()
  @IsDateString()
  dataDe?: string;

  @ApiPropertyOptional({ description: 'Data final do aluguel em formato ISO' })
  @IsOptional()
  @IsDateString()
  dataAte?: string;
}