import { randomBytes, scryptSync } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function gerarHashSenha(senha: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const senha = gerarHashSenha('123456');

  await prisma.usuario.upsert({
    where: { email: 'admin@ufcirj.com' },
    update: {
      nome: 'Administrador',
      senha,
      role: 'ADMIN',
      ativo: true,
    },
    create: {
      nome: 'Administrador',
      email: 'admin@ufcirj.com',
      senha,
      role: 'ADMIN',
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
