import { randomBytes, scryptSync } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function gerarHashSenha(senha: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const senha = gerarHashSenha('123456789');

  await prisma.usuario.upsert({
    where: { email: 'carlos@email.com' },
    update: {
      nome: 'Usuário',
      senha,
      role: 'USER',
      ativo: true,
    },
    create: {
      nome: 'Usuário',
      email: 'carlos@email.com',
      senha,
      role: 'USER',
    },
  });

  console.log('Banco populado com sucesso.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
