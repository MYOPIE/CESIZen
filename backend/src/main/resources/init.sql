-- Script d'initialisation de la base de données CESIZen
-- PostgreSQL

-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Création de la table activities
CREATE TABLE IF NOT EXISTS activities (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Création de la table informations
CREATE TABLE IF NOT EXISTS informations (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_activities_is_active ON activities(is_active);
CREATE INDEX IF NOT EXISTS idx_informations_is_published ON informations(is_published);
CREATE INDEX IF NOT EXISTS idx_informations_category ON informations(category);

-- Insertion de comptes pour tester
-- Mot de passe 'password123' encrypté par BCrypt ($2y$10$wYWONX1zYwIowrB.44g.6e.oOfmEL1Gey7r2Yx.M5mI9RkVJ64Zk2 est 'password123')
INSERT INTO users (email, first_name, last_name, password, role, is_active, created_at, updated_at) 
VALUES ('admin@cesizen.fr', 'Admin', 'CESIZen', '$2a$10$X86rCj0l.O5j2mO3M1s3hOoJ.U4Hn/y3MWeh/.AODH2k5rRkWe53a', 'ROLE_ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

