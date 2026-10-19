import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuhtController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersRepository } from '../users/users.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'apiweb-ufci-rj-secret',

            signOptions: {
                expiresIn: '24h',
            },
        }),
    ],

    controllers: [
        AuhtController,
    ],
    providers: [
        AuthService,
        JwtStrategy,
        UsersRepository,
        PrismaService,
    ],

    exports: [
        JwtModule,
    ],
})

export class AuthModule {}