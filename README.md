# API Web - UFCI-RJ

## Sistema de Aluguel de Jogos de Tabuleiro

API RESTful desenvolvida para gerenciar um sistema de aluguel de jogos de tabuleiro. A aplicação contempla o cadastro e a consulta dos dados de usuários e jogos, controle de estoque, aluguéis, pagamentos, multas por atraso e relatórios financeiros. Neste repositório, os módulos de Aluguéis e Pagamentos estão implementados e integrados ao Prisma ORM.

## Tecnologias

- **NestJS 12**: framework Node.js usado para organizar a API em módulos, controllers e services.
- **TypeScript**: linguagem tipada utilizada na aplicação.
- **Prisma ORM 5**: acesso tipado ao banco de dados, geração do client e gerenciamento de migrações.
- **MySQL 8.0**: banco relacional utilizado para persistir os dados.
- **Docker / Docker Compose**: execução local e isolada do banco de dados.
- **class-validator**: validação declarativa dos dados recebidos pela API.
- **class-transformer**: transformação de parâmetros e payloads para os tipos definidos nos DTOs.
- **Jest e Supertest**: testes unitários e testes de ponta a ponta (E2E).
- **Oxlint**: análise estática e verificação de estilo do código.

## Equipe e divisão de responsabilidades

- **Gabriel Leonardo**: responsável pelos módulos de Aluguéis e Pagamentos, com 20 endpoints implementados e integrados ao NestJS e ao Prisma.
- **Gustavo**: responsável pela estruturação inicial do projeto, infraestrutura e repositório.
- **Lindsy**: responsável pelos módulos complementares do sistema.

Os módulos de Aluguéis e Pagamentos relacionam-se com os registros de usuários e jogos definidos no schema Prisma. A criação e manutenção desses cadastros fazem parte dos módulos complementares.

## Requisitos

- Node.js compatível com a versão indicada pelo projeto (recomenda-se Node.js 20 ou superior).
- npm.
- Docker Engine e Docker Compose, ou Docker Engine para executar o comando `docker run` abaixo.
- Porta `3307` disponível no computador para o MySQL local.

## Instalação e configuração

### 1. Clonar o repositório

Substitua `<URL_DO_REPOSITORIO>` pela URL Git disponibilizada pela equipe:

```bash
git clone <URL_DO_REPOSITORIO>
cd apiweb_ufci-rj
```

### 2. Instalar as dependências

```bash
npm install
```

O projeto utiliza Prisma 5 e inclui `@prisma/client`, `prisma`, `dotenv`, `class-validator` e `class-transformer` nas dependências do projeto.

### 3. Iniciar o MySQL 8.0 com Docker

O exemplo cria o banco `aluguel_jogos`, publica a porta interna `3306` do container na porta `3307` do host e configura uma senha local de exemplo. Troque a senha por uma credencial adequada ao seu ambiente.

```bash
docker run --name aluguel-jogos-mysql \
  -e MYSQL_ROOT_PASSWORD=senha_local \
  -e MYSQL_DATABASE=aluguel_jogos \
  -p 3307:3306 \
  -d mysql:8.0
```

Para conferir o estado do container:

```bash
docker ps --filter name=aluguel-jogos-mysql
```

Para interrompê-lo e iniciá-lo novamente:

```bash
docker stop aluguel-jogos-mysql
docker start aluguel-jogos-mysql
```

Se o container já existir, não execute novamente o comando `docker run` com o mesmo nome. Inicie o container existente com `docker start aluguel-jogos-mysql`.

### 4. Configurar as variáveis de ambiente

Crie ou atualize o arquivo `.env` na raiz do projeto. O valor de usuário, senha e porta deve corresponder ao container MySQL:

```env
DATABASE_URL="mysql://root:senha_local@localhost:3307/aluguel_jogos"
```

O arquivo `.env` contém credenciais e não deve ser versionado. Não use a senha de exemplo em ambientes compartilhados ou de produção.

### 5. Aplicar as migrações e gerar o Prisma Client

Com o banco em execução e a variável `DATABASE_URL` configurada:

```bash
npx prisma migrate dev
npx prisma generate
```

Para criar uma nova migração durante o desenvolvimento, informe um nome descritivo:

```bash
npx prisma migrate dev --name descricao_da_migracao
```

O schema está em `prisma/schema.prisma`. As migrações devem ser compartilhadas com o restante da equipe para manter o banco de todos alinhado ao mesmo modelo.

## Executar a aplicação

Inicie a API em modo de desenvolvimento:

```bash
npm run start:dev
```

Por padrão, a API fica disponível em `http://localhost:3000`. A inicialização conecta o Prisma ao banco configurado em `DATABASE_URL`.

## Convenções da API

- As rotas documentadas usam os prefixos `/rentals` e `/payments`.
- IDs de rota devem ser inteiros positivos.
- A API valida os DTOs, transforma os valores de entrada e rejeita propriedades não declaradas.
- Listagens paginadas aceitam `page` e `limit`; o limite máximo aplicado é 100 registros por página.
- Os filtros de período de pagamentos aceitam `startDate` e `endDate` em formato ISO 8601. Datas sem horário no formato `YYYY-MM-DD` incluem o dia inteiro.
- Erros de validação e regras de negócio são retornados por meio das exceções HTTP do NestJS.
- Valores monetários são armazenados com precisão decimal no banco.

## Módulo de Aluguéis

Prefixo: `/rentals`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/rentals` | Cria um aluguel. Valida se o usuário existe e está ativo, se o jogo está ativo e se há unidades disponíveis; reserva o estoque atomicamente. |
| `GET` | `/rentals` | Lista aluguéis com paginação (`page`, `limit`) e filtro opcional por `status`. |
| `GET` | `/rentals/:id` | Consulta os detalhes de um aluguel, incluindo usuário, jogo e pagamentos associados. |
| `PATCH` | `/rentals/:id/return` | Registra a devolução física, repõe o estoque e calcula a multa por atraso. Se houver multa, cria um pagamento pendente. |
| `PATCH` | `/rentals/:id/cancel` | Cancela um aluguel ativo e repõe as unidades reservadas no estoque. |
| `GET` | `/rentals/user/:userId` | Lista o histórico de aluguéis de um usuário. |
| `GET` | `/rentals/active` | Lista aluguéis ativos cuja data prevista de devolução ainda não passou. |
| `GET` | `/rentals/overdue` | Lista aluguéis vencidos. Atualiza para `ATRASADO` os aluguéis ativos com data prevista anterior ao dia atual. |
| `PATCH` | `/rentals/:id/extend` | Prorroga o prazo de devolução pelo número de dias enviado e ajusta o valor total contratado. |
| `DELETE` | `/rentals/:id` | Remove administrativamente um aluguel. Requer perfil `ADMIN`; aluguéis com pagamentos vinculados não podem ser removidos. |

### Criar aluguel

Campos obrigatórios: `id_usuario` e `id_jogo`. `quantidade` é opcional e, se omitida, assume `1`. `data_prevista_devolucao` é opcional e assume sete dias a partir da criação. `local` e `observacoes` também são opcionais.

```http
POST /rentals
Content-Type: application/json
```

```json
{
  "id_usuario": 1,
  "id_jogo": 3,
  "quantidade": 1,
  "data_prevista_devolucao": "2026-10-20T00:00:00.000Z",
  "local": false,
  "observacoes": "Retirada no balcão"
}
```

### Prorrogar aluguel

O campo `dias` deve ser um inteiro entre 1 e 90.

```http
PATCH /rentals/42/extend
Content-Type: application/json
```

```json
{
  "dias": 7
}
```

### Regras de devolução e multa

A multa calculada na devolução corresponde à diária registrada no aluguel multiplicada pelos dias corridos de atraso e pela quantidade de jogos alugados. A mesma fórmula é usada no endpoint de pré-cálculo de multa. Aluguéis devolvidos ou cancelados não podem passar novamente pela transição de devolução/cancelamento; as operações de alteração de status e estoque são transacionais.

Os valores válidos de `status` para filtro são `ATIVO`, `DEVOLVIDO`, `ATRASADO` e `CANCELADO`.

## Módulo de Pagamentos

Prefixo: `/payments`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/payments` | Registra pagamento pendente vinculado a um aluguel, verificando o saldo ainda devido. |
| `GET` | `/payments` | Lista pagamentos com paginação e filtros opcionais `startDate` e `endDate`. |
| `GET` | `/payments/:id` | Consulta os detalhes do pagamento e do aluguel associado. |
| `GET` | `/payments/rental/:rentalId` | Consulta os pagamentos, o total pago e o total pendente de um aluguel. |
| `PATCH` | `/payments/:id/confirm` | Confirma um pagamento que esteja pendente. |
| `PATCH` | `/payments/:id/refund` | Registra o estorno de um pagamento compensado, alterando seu status para `ESTORNADO`. |
| `GET` | `/payments/pending` | Lista pagamentos que aguardam confirmação. |
| `POST` | `/payments/calculate-fine/:rentalId` | Pré-calcula dias de atraso e multa sem registrar ou cobrar o valor. |
| `GET` | `/payments/report/summary` | Gera resumo financeiro do período, incluindo total arrecadado em pagamentos pagos e totais agrupados por status. |
| `DELETE` | `/payments/:id` | Exclui administrativamente um pagamento pendente ou cancelado. Requer perfil `ADMIN`; pagamentos pagos ou estornados não podem ser excluídos. |

### Registrar pagamento

O campo `forma_pagamento` aceita `PIX`, `CARTAO_CREDITO`, `CARTAO_DEBITO` ou `DINHEIRO`. O valor deve ser positivo e ter no máximo duas casas decimais.

```http
POST /payments
Content-Type: application/json
```

```json
{
  "id_aluguel": 42,
  "valor": 35.5,
  "forma_pagamento": "PIX"
}
```

O status inicial é `PENDENTE`. Os demais status possíveis são `PAGO`, `CANCELADO` e `ESTORNADO`. A confirmação representa a compensação/aprovação do pagamento no sistema; a integração com um provedor ou gateway externo não está incluída neste módulo.

### Filtrar pagamentos e consultar relatório

Use datas ISO 8601. Quando enviadas como `YYYY-MM-DD`, as datas inicial e final são consideradas inclusivas.

```http
GET /payments?page=1&limit=20&startDate=2026-10-01&endDate=2026-10-31
GET /payments/report/summary?startDate=2026-10-01&endDate=2026-10-31
```

O relatório considera como arrecadação apenas pagamentos com status `PAGO`. O estorno altera o estado do pagamento; o valor estornado deixa de constar entre os pagamentos pagos.

## Acesso administrativo

Os endpoints de exclusão usam `AdminGuard` e só autorizam uma requisição quando a camada de autenticação preencher `request.user.role` com o valor `ADMIN`. O projeto ainda precisa integrar esse guard a um mecanismo de autenticação/autorização para habilitar o acesso administrativo. Sem identidade autenticada ou sem o perfil esperado, a requisição é negada.

## Testes e qualidade de código

Executar os testes unitários:

```bash
npm test
```

Executar os testes de ponta a ponta (E2E):

```bash
npm run test:e2e
```

Executar o linter:

```bash
npm run lint
```

Compilar o projeto:

```bash
npm run build
```

## Estrutura relevante

```text
src/
  common/guards/       Guard de autorização administrativa
  payments/            Controller, service e DTOs de pagamentos
  prisma/              PrismaService e módulo compartilhado
  rentals/             Controller, service e DTOs de aluguéis
  app.module.ts        Módulo raiz da aplicação
  main.ts              Bootstrap, validação global e carregamento do .env
prisma/
  migrations/          Histórico de migrações do banco
  schema.prisma        Modelos, enums e relações
```

## Segurança e colaboração

- Não inclua credenciais reais no README, no código-fonte ou em commits.
- Mantenha `.env` fora do controle de versão.
- Compartilhe as novas migrações com a equipe e aplique-as antes de testar funcionalidades que dependam delas.
- Valide as permissões administrativas por meio da autenticação antes de expor os endpoints de exclusão em um ambiente compartilhado ou público.
