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
    category_id BIGINT,
    duree INT,
    difficulte VARCHAR(50),
    image VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Création de la table informations
CREATE TABLE IF NOT EXISTS informations (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category_id BIGINT,
    difficulty_id BIGINT,
    reading_time INT,
    icon VARCHAR(255),
    excerpt TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (difficulty_id) REFERENCES difficulties(id) ON DELETE SET NULL
);

-- Création de la table categories
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL -- 'ACTIVITY' ou 'INFORMATION'
);

-- Création de la table difficultés
CREATE TABLE IF NOT EXISTS difficulties (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Création des tables de jointure pour les favoris
CREATE TABLE IF NOT EXISTS user_favorite_activities (
    user_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, activity_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_favorite_informations (
    user_id BIGINT NOT NULL,
    information_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, information_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (information_id) REFERENCES informations(id) ON DELETE CASCADE
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_activities_is_active ON activities(is_active);
CREATE INDEX IF NOT EXISTS idx_informations_is_published ON informations(is_published);
CREATE INDEX IF NOT EXISTS idx_informations_category_id ON informations(category_id);
CREATE INDEX IF NOT EXISTS idx_informations_difficulty_id ON informations(difficulty_id);

-- Insertion de comptes pour tester
-- Mot de passe 'password123' encrypté par BCrypt ($2y$10$wYWONX1zYwIowrB.44g.6e.oOfmEL1Gey7r2Yx.M5mI9RkVJ64Zk2 est 'password123')
INSERT INTO users (email, first_name, last_name, password, role, is_active, created_at, updated_at) 
VALUES
    ('admin@cesizen.fr',
    'Admin',
    'CESIZen',
    '$2a$10$X86rCj0l.O5j2mO3M1s3hOoJ.U4Hn/y3MWeh/.AODH2k5rRkWe53a',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insertion de catégories pour tester
INSERT INTO categories (name, type) 
VALUES 
    ('Détente', 'ACTIVITY'),
    ('Respiration', 'ACTIVITY'),
    ('Détente', 'INFORMATION'),
    ('Respiration', 'INFORMATION')
ON CONFLICT (name) DO NOTHING;

-- Insertion de niveaux de difficulté pour tester
INSERT INTO difficulties (name) 
VALUES 
    ('Très facile'),
    ('Facile'),
    ('Moyen'),
    ('Difficile'),
    ('Très difficile')
ON CONFLICT (name) DO NOTHING;