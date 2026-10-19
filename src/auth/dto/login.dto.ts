import { ApiProperty } from '@nestjs/swagger';
import { 
    IsEmail,
    IsString,
    MaxLength,
    MinLength
 } from 'class-validator';

 export class LoginDto {
    @ApiProperty({
        example: 'admin@email.com',
    })
    @IsEmail()
    @MaxLength(150)
    email!: string;

    @ApiProperty({
        example: '12345678',
    }) 
    @IsString()
    @MinLength(8)
    @MaxLength(255)
    senha!: string;
 }