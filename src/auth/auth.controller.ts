import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuhtController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Realizar login',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado com sucesso',
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna dados do usuário autenticado',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.authService.me(req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Valida o token JWT',
  })
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validate(@Req() req: any) {
    return this.authService.validate(req.user.id);
  }
}
