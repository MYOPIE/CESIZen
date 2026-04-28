# Configuration CESIZen Backend avec PostgreSQL

## Prérequis

- Java 21 ou supérieur
- PostgreSQL 12 ou supérieur
- Maven 3.8+
- Git

## Étape 1 : Installation de PostgreSQL

### Sur Windows
```bash
# Télécharger PostgreSQL depuis https://www.postgresql.org/download/windows/
# Installer avec les paramètres par défaut
# Le mot de passe par défaut pour l'utilisateur 'postgres' est demandé lors de l'installation
```

### Sur macOS (avec Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Sur Linux (Debian/Ubuntu)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Étape 2 : Créer la base de données

### Connexion à PostgreSQL
```bash
psql -U postgres
```

### Créer l'utilisateur et la base de données
```sql
-- Créer l'utilisateur
CREATE USER cesizen_user WITH PASSWORD 'cesizen_password';

-- Créer la base de données
CREATE DATABASE cesizen_db;

-- Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE cesizen_db TO cesizen_user;

-- Se connecter à la base
\c cesizen_db

-- Donner les permissions sur le schéma public
GRANT ALL PRIVILEGES ON SCHEMA public TO cesizen_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cesizen_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cesizen_user;
```

### Vérifier la connexion
```bash
psql -U cesizen_user -d cesizen_db -h localhost
```

## Étape 3 : Configurer le Backend

### Mettre à jour les dépendances
```bash
cd backend
mvn clean install
```

### Configuration (déjà faite dans application.yml)
Le fichier `application.yml` est pré-configuré avec :
- URL PostgreSQL: `jdbc:postgresql://localhost:5432/cesizen_db`
- Utilisateur: `cesizen_user`
- Mot de passe: `cesizen_password`

### Lancer l'application
```bash
mvn spring-boot:run
```

L'application démarrera sur `http://localhost:8080`

## Étape 4 : Vérifier l'initialisation

Spring Boot créera automatiquement les tables via Hibernate (ddl-auto: update).

Pour vérifier manuellement :
```bash
psql -U cesizen_user -d cesizen_db -h localhost
\dt  # Lister les tables
```

## API Endpoints

### Authentification
- **POST** `/api/v1/auth/register` - Créer un compte utilisateur
- **POST** `/api/v1/auth/login` - Se connecter

### Utilisateurs (Admin)
- **GET** `/api/v1/users` - Lister tous les utilisateurs
- **GET** `/api/v1/users/{id}` - Détails d'un utilisateur
- **PUT** `/api/v1/users/{id}` - Modifier un utilisateur
- **DELETE** `/api/v1/users/{id}` - Supprimer un utilisateur
- **PUT** `/api/v1/users/{id}/deactivate` - Désactiver un utilisateur
- **PUT** `/api/v1/users/{id}/promote-admin` - Promouvoir en admin
- **PUT** `/api/v1/users/{id}/demote-admin` - Retirer les droits admin

### Activités
- **POST** `/api/v1/activities` - Créer une activité (Admin)
- **GET** `/api/v1/activities` - Lister toutes les activités
- **GET** `/api/v1/activities/active` - Lister les activités actives
- **GET** `/api/v1/activities/{id}` - Détails d'une activité
- **PUT** `/api/v1/activities/{id}` - Modifier une activité (Admin)
- **DELETE** `/api/v1/activities/{id}` - Supprimer une activité (Admin)
- **PUT** `/api/v1/activities/{id}/deactivate` - Désactiver une activité
- **PUT** `/api/v1/activities/{id}/reactivate` - Réactiver une activité

### Informations
- **POST** `/api/v1/informations` - Créer une information (Admin)
- **GET** `/api/v1/informations` - Lister toutes les informations
- **GET** `/api/v1/informations/published` - Lister les informations publiées
- **GET** `/api/v1/informations/category/{category}` - Informations par catégorie
- **GET** `/api/v1/informations/{id}` - Détails d'une information
- **PUT** `/api/v1/informations/{id}` - Modifier une information (Admin)
- **DELETE** `/api/v1/informations/{id}` - Supprimer une information (Admin)
- **PUT** `/api/v1/informations/{id}/publish` - Publier une information
- **PUT** `/api/v1/informations/{id}/unpublish` - Dépublier une information

## Exemple de Requête

### Créer un compte utilisateur
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Créer une activité (Admin)
```bash
curl -X POST http://localhost:8080/api/v1/activities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yoga Relaxant",
    "description": "Une séance de yoga pour se détendre",
    "content": "Contenu détaillé de l'activité...",
    "instructions": "Instructions pas à pas..."
  }'
```

### Créer une information
```bash
curl -X POST http://localhost:8080/api/v1/informations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Gestion du stress",
    "content": "Conseils pour gérer votre stress...",
    "category": "Mental Health"
  }'
```

## Dépannage

### Erreur de connexion à PostgreSQL
```
org.postgresql.util.PSQLException: Connection to localhost:5432 refused
```
**Solution** : Vérifiez que PostgreSQL est en cours d'exécution
```bash
# Windows (pgAdmin)
# macOS
brew services start postgresql
# Linux
sudo systemctl start postgresql
```

### Erreur d'authentification
```
FATAL: Ident authentication failed for user "cesizen_user"
```
**Solution** : Vérifiez les identifiants dans `application.yml`

### Tables non créées
Spring Boot avec `ddl-auto: update` devrait créer les tables automatiquement au démarrage.
Si ce n'est pas le cas, exécutez manuellement `init.sql` :
```bash
psql -U cesizen_user -d cesizen_db -h localhost -f init.sql
```

## Structure du Projet

```
backend/
├── src/main/java/fr/cesizen/api/
│   ├── CesizenApiApplication.java
│   ├── config/
│   │   └── SecurityConfig.java
│   ├── domain/
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Activity.java
│   │   │   ├── Information.java
│   │   │   └── Role.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── ActivityRepository.java
│   │   │   └── InformationRepository.java
│   │   └── service/
│   │       ├── UserService.java
│   │       ├── ActivityService.java
│   │       └── InformationService.java
│   └── web/
│       ├── AuthController.java
│       ├── UserController.java
│       ├── ActivityController.java
│       ├── InformationController.java
│       └── dto/
│           ├── UserRegisterRequest.java
│           ├── UserLoginRequest.java
│           ├── UserResponse.java
│           ├── AuthResponse.java
│           ├── ActivityRequest.java
│           ├── ActivityResponse.java
│           ├── InformationRequest.java
│           └── InformationResponse.java
├── src/main/resources/
│   ├── application.yml
│   └── init.sql
└── pom.xml
```

## Prochaines Étapes

1. **Implémenter JWT** pour l'authentification sécurisée
2. **Ajouter les tests unitaires**
3. **Configurer les permissions par rôle** (Admin/User)
4. **Ajouter le tracker d'émotions**
5. **Ajouter les exercices de respiration**
6. **Déployer sur un serveur**

## Notes de Sécurité

⚠️ **Pour la production** :
- Changer le mot de passe PostgreSQL
- Changer la clé JWT secrète dans `application.yml`
- Activer HTTPS
- Implémenter des validations plus robustes
- Ajouter rate limiting
- Mettre en place une authentification Multi-Facteur
