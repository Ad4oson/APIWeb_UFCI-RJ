import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scryptSync } from 'node:crypto';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';

function validarSenha(senhaDigitada: string, hashSalvo: string): boolean {
  const [salt, hash] = hashSalvo.split(':');

  const hashTeste = scryptSync(senhaDigitada, salt, 64).toString('hex');

  return hashTeste === hash;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  //Realiza a autenticação do usuário e retorna um JSWT válido
  async login(dto: LoginDto) {
    const usuario = await this.usersRepository.buscarCredenciaisPorEmail(
      dto.email,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário desativado');
    }

    const senhaValida = validarSenha(dto.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),

      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }

  //Retorna os dados do usuário logado
  async me(userId: number) {
    const usuario = await this.usersRepository.buscarPorId(userId);

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return usuario;
  }

  //Valida o token atual
  async validate(userId: number) {
    const usuario = await this.usersRepository.buscarPorId(userId);

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      valid: true,
      usuario,
    };
  }
}
