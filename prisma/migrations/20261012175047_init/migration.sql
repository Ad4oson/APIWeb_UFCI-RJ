-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(20) NULL,
    `cpf` VARCHAR(14) NULL,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `usuario_email_key`(`email`),
    UNIQUE INDEX `usuario_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jogo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `descricao` TEXT NULL,
    `ano_lancamento` YEAR NULL,
    `numero_jogadores_min` INTEGER NOT NULL,
    `numero_jogadores_max` INTEGER NOT NULL,
    `idade_minima` INTEGER NOT NULL,
    `duracao_minutos` INTEGER NOT NULL,
    `quantidade_total` INTEGER NOT NULL DEFAULT 1,
    `quantidade_disponivel` INTEGER NOT NULL DEFAULT 1,
    `valor_diaria` DECIMAL(10, 2) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `complexidade` INTEGER NOT NULL,

    INDEX `idx_jogo_nome`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `categoria_nome_key`(`nome`),
    INDEX `idx_categoria_nome`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_jogo` (
    `id_categoria` INTEGER NOT NULL,
    `id_jogo` INTEGER NOT NULL,

    PRIMARY KEY (`id_categoria`, `id_jogo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aluguel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_jogo` INTEGER NOT NULL,
    `data_aluguel` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_prevista_devolucao` DATE NOT NULL,
    `data_devolucao` DATETIME(3) NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,
    `valor_diaria` DECIMAL(10, 2) NOT NULL,
    `valor_total` DECIMAL(10, 2) NULL,
    `status` ENUM('ATIVO', 'DEVOLVIDO', 'ATRASADO', 'CANCELADO') NOT NULL DEFAULT 'ATIVO',
    `local` BOOLEAN NOT NULL DEFAULT false,
    `observacoes` TEXT NULL,

    INDEX `idx_aluguel_usuario`(`id_usuario`),
    INDEX `idx_aluguel_jogo`(`id_jogo`),
    INDEX `idx_aluguel_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_jogo` INTEGER NOT NULL,
    `nota` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `data_avaliacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_avaliacao_jogo`(`id_jogo`),
    UNIQUE INDEX `avaliacao_id_usuario_id_jogo_key`(`id_usuario`, `id_jogo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_aluguel` INTEGER NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `data_pagamento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `forma_pagamento` ENUM('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'DINHEIRO') NULL,
    `status` ENUM('PENDENTE', 'PAGO', 'CANCELADO', 'ESTORNADO') NOT NULL DEFAULT 'PENDENTE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categoria_jogo` ADD CONSTRAINT `categoria_jogo_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categoria_jogo` ADD CONSTRAINT `categoria_jogo_id_jogo_fkey` FOREIGN KEY (`id_jogo`) REFERENCES `jogo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluguel` ADD CONSTRAINT `aluguel_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluguel` ADD CONSTRAINT `aluguel_id_jogo_fkey` FOREIGN KEY (`id_jogo`) REFERENCES `jogo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_id_jogo_fkey` FOREIGN KEY (`id_jogo`) REFERENCES `jogo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamento` ADD CONSTRAINT `pagamento_id_aluguel_fkey` FOREIGN KEY (`id_aluguel`) REFERENCES `aluguel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
