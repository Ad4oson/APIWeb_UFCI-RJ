import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Senha123!' })
  @IsString()
  @MinLength(8)
  senha!: string;
}