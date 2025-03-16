-- Criação da tabela de Motoristas
CREATE TABLE motoristas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnh VARCHAR(20) NOT NULL,
    contato VARCHAR(20),
    cpf VARCHAR(14) NOT NULL,
    endereco TEXT
);

-- Criação da tabela de Caminhões
CREATE TABLE caminhoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    modelo VARCHAR(100) NOT NULL,
    placa VARCHAR(10) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    ano VARCHAR(4)
);

-- Criação da tabela de Produtos
CREATE TABLE produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    unidade VARCHAR(20) NOT NULL
);

-- Criação da tabela de Clientes
CREATE TABLE clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    ie VARCHAR(20),
    contato VARCHAR(20),
    email VARCHAR(100),
    endereco TEXT
);

-- Criação da tabela de Pesagens
CREATE TABLE pesagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATETIME NOT NULL,
    motorista_id INTEGER,
    produto_id INTEGER,
    caminhao_id INTEGER,
    cliente_id INTEGER,
    peso_inicial DECIMAL(10, 2) NOT NULL,
    peso_liquido DECIMAL(10, 2) NOT NULL,
    peso_final DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    operador VARCHAR(100) NOT NULL,
    FOREIGN KEY (motorista_id) REFERENCES motoristas(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (caminhao_id) REFERENCES caminhoes(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Criação da tabela de Usuários
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

-- Índices para melhorar a performance das consultas
CREATE INDEX idx_motoristas_nome ON motoristas(nome);
CREATE INDEX idx_caminhoes_placa ON caminhoes(placa);
CREATE INDEX idx_produtos_nome ON produtos(nome);
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_pesagens_data ON pesagens(data);
CREATE INDEX idx_usuarios_email ON usuarios(email);

