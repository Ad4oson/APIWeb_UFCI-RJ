import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Novo nome do usuário',
    example: 'João da Silva',
    maxLength: 100,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf((_obj, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nome?: string;

  @ApiPropertyOptional({
    description: 'Novo endereço de e-mail do usuário',
    example: 'joao@email.com',
    maxLength: 150,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @ValidateIf((_obj, value) => value !== undefined)
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({
    description: 'Nova senha do usuário; mínimo de 8 caracteres',
    example: 'SenhaSegura123!',
    minLength: 8,
    maxLength: 255,
  })
  @ValidateIf((_obj, value) => value !== undefined)
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  senha?: string;

  @ApiPropertyOptional({
    description: 'Novo telefone do usuário',
    example: '(21) 99999-9999',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string | null;

  @ApiPropertyOptional({
    description: 'CPF do usuário, com 11 dígitos',
    example: '12345678901',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/)
  cpf!: string;
}
