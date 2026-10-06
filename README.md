# API NestJS com JavaScript, Prisma e MySQL

API REST criada com NestJS, JavaScript, Prisma ORM e MySQL.

## Requisitos

- Node.js e npm
- MySQL instalado e em execução
- NestJS CLI

## 1. Instalar o NestJS CLI

```bash
npm install -g @nestjs/cli
```

## 2. Criar o projeto

```bash
nest new minha-api
cd minha-api
```

Escolha **npm** como gerenciador de pacotes. Se o CLI perguntar pelo sistema de módulos, escolha **ESM (Module)**.


## 3. Iniciar a aplicação

```bash
npm run start:dev
```

Por padrão, a API ficará disponível em `http://localhost:3000`.

## 4. Criar um recurso CRUD

```bash
nest g resource nome-do-recurso
```

Escolha **REST API** e confirme a geração dos endpoints CRUD. O comando cria a estrutura inicial do recurso; complete os métodos gerados com a lógica da aplicação. <citation src="4"></citation>

## 5. Criar um banco de dados MySQL

No MySQL, crie o banco de dados:

```sql
CREATE DATABASE minha_base;
```

## 6. Instalar o Prisma

```bash
npm install @prisma/client @prisma/adapter-mariadb
npm install --save-dev prisma dotenv
```

Inicialize o Prisma para MySQL:

```bash
npx prisma init --datasource-provider mysql
```

No arquivo `.env`, configure os dados da conexão:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/minha_base"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
DATABASE_USER="USUARIO"
DATABASE_PASSWORD="SENHA"
DATABASE_NAME="minha_base"
```

Troque `USUARIO` e `SENHA` pelos dados do seu MySQL.

## 7. Definir o modelo

No arquivo `prisma/schema.prisma`, configure o provider como `mysql` e adicione o modelo:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

O MySQL usa o provider `mysql` no schema do Prisma. <citation src="3"></citation>

## 8. Criar a migration e gerar o Prisma Client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## 9. Criar o serviço do Prisma

Crie `src/prisma/prisma.service.js`:

```js
const { Injectable } = require('@nestjs/common');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('../generated/prisma/client');

class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      connectionLimit: 5,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

Injectable()(PrismaService);

module.exports = { PrismaService };
```

O adapter MariaDB é compatível com conexões locais MySQL/MariaDB. <citation src="3"></citation>

## 10. Criar o módulo do Prisma

Crie `src/prisma/prisma.module.js`:

```js
const { Module } = require('@nestjs/common');
const { PrismaService } = require('./prisma.service');

class PrismaModule {}

Module({
  providers: [PrismaService],
  exports: [PrismaService],
})(PrismaModule);

module.exports = { PrismaModule };
```

Importe `PrismaModule` no módulo que precisa acessar o banco, por exemplo, no módulo de usuários.

## 11. Usar Prisma no serviço de usuários

No service de usuários, injete `PrismaService` e utilize o Prisma Client:

```js
const { Injectable, Inject } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');

class UsersService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  create(data) {
    return this.prisma.user.create({ data });
  }
}

Inject(PrismaService)(UsersService);
Injectable()(UsersService);

module.exports = { UsersService };
```

## 12. Testar a API

Inicie o servidor:

```bash
npm run start:dev
```

Criar um usuário:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@example.com"}'
```

Listar usuários:

```bash
curl http://localhost:3000/users
```

## Comandos úteis

```bash
npm run start:dev
nest g resource nome-do-recurso
npx prisma migrate dev --name nome-da-migration
npx prisma generate
npx prisma studio
```

## Segurança

- Não envie o arquivo `.env` para o GitHub.
- Não coloque credenciais do banco diretamente no código.
- Valide os dados recebidos pela API antes de salvá-los.

