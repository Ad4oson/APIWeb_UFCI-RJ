import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { 
    IsBoolean, 
    IsInt, 
    IsOptional, 
    IsString, 
    Max, 
    Min 
} from 'class-validator';

export class ListCategoryGamesDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Página atual'
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
        description: 'Quantidade de registros por página',
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        example: 'Catan',
        description: 'Filtrar por nome do jogo',
    })
    @IsOptional()
    @IsString()
    nome?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Filtrar jogos ativos',
    })
    @Transform(({ value }) => {
        if(value === 'true') return true;
        if(value === 'false') return false;
        return value;
    })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}