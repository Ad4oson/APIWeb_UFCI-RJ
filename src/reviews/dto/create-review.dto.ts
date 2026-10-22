import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'

export class CreateReviewDto {

    @ApiProperty({
        description: 'Identificador do usuário que está avaliando',
        example: 1,
        minimum: 1,
        type: Number
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id_usuario!: number;

    @ApiProperty({
    description: 'Identificador do jogo avaliado',
    example: 1,
    minimum: 1,
    type: Number,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id_jogo!: number;

    @ApiProperty({
    description: 'Nota atribuída ao jogo, de 1 a 5',
    example: 5,
    minimum: 1,
    maximum: 5,
    type: Number,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    nota!: number;

    @ApiPropertyOptional({
        description: 'Comentário sobre o jogo',
        example: 'Jogo divertido e fácil de aprender.',
        maxLength: 5000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    comentario?: string | null;

}