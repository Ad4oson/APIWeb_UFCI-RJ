import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
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
  @ApiPropertyOptional({
    description: 'Página solicitada',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de registros por página',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class ListGamesDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra pelo nome do jogo',
    example: 'xadrez',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nome?: string;

  @ApiPropertyOptional({
    description: 'Filtra pelo estado ativo do jogo',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({
    description: 'Filtra pela complexidade',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  complexidade?: number;

  @ApiPropertyOptional({
    description: 'Filtra pelo ano de lançamento',
    example: 2024,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  ano?: number;

  @ApiPropertyOptional({
    description: 'Filtra jogos que aceitam este número de jogadores',
    example: 4,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  jogadores?: number;
}

export class ListGameRentalsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra pelo status do aluguel',
    enum: StatusAluguel,
  })
  @IsOptional()
  @IsEnum(StatusAluguel)
  status?: StatusAluguel;

  @ApiPropertyOptional({
    description: 'Filtra pelo ID do usuário',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  usuarioId?: number;

  @ApiPropertyOptional({
    description: 'Filtra aluguéis a partir desta data',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dataDe?: string;

  @ApiPropertyOptional({
    description: 'Filtra aluguéis até esta data',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  dataAte?: string;
}

export class ListGameCategoriesDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra pelo nome da categoria',
    example: 'estratégia',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @ApiPropertyOptional({
    description: 'Filtra pelo ID da categoria',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCategoria?: number;
}
