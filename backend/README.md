# Backend - CESIZen API

API REST Spring Boot 3.2.3 avec PostgreSQL pour la gestion de la santé mentale et des comptes utilisateurs.

## 🚀 Démarrage Rapide

### Prérequis
- Java 17 LTS
- PostgreSQL 12+
- Maven 3.9+

### Configuration PostgreSQL
```bash
psql -U postgres
```

```sql
CREATE USER cesizen_user WITH PASSWORD 'cesizen_password';
CREATE DATABASE cesizen_db OWNER cesizen_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO cesizen_user;
```

### Lancer l'application
```bash
cd backend
mvn spring-boot:run
```

API disponible sur: `http://localhost:8080/api/v1`

## 📁 Structure

```
src/main/java/fr/cesizen/api/
├── config/              # Configuration technique (Security, CORS)
├── domain/
│   ├── entity/         # JPA Entities (User, Activity, Information)
│   ├── repository/     # Spring Data JPA
│   └── service/        # Logique métier
├── web/
│   ├── *Controller.java # Endpoints REST
│   └── dto/            # Data Transfer Objects
└── application/        # Cas d'usage métier

src/main/resources/
├── application.yml     # Configuration Spring
└── init.sql           # Scripts d'initialisation BDD
```

## 🔑 Endpoints Principaux

### Authentification
```http
POST /api/v1/auth/register       # Créer un compte
POST /api/v1/auth/login          # Se connecter
```

### Utilisateurs (Admin)
```http
GET    /api/v1/users                          # Lister tous
GET    /api/v1/users/{id}                    # Détails
PUT    /api/v1/users/{id}                    # Modifier
DELETE /api/v1/users/{id}                    # Supprimer
PUT    /api/v1/users/{id}/deactivate         # Désactiver
PUT    /api/v1/users/{id}/promote-admin      # Promouvoir Admin
PUT    /api/v1/users/{id}/demote-admin       # Rétrograder
```

### Activités Détente
```http
POST   /api/v1/activities                  # Créer (Admin)
GET    /api/v1/activities                  # Lister toutes
GET    /api/v1/activities/active           # Lister actives
GET    /api/v1/activities/{id}             # Détails
PUT    /api/v1/activities/{id}             # Modifier (Admin)
DELETE /api/v1/activities/{id}             # Supprimer (Admin)
PUT    /api/v1/activities/{id}/deactivate  # Désactiver
PUT    /api/v1/activities/{id}/reactivate  # Réactiver
```

### Informations de Santé
```http
POST   /api/v1/informations                     # Créer (Admin)
GET    /api/v1/informations                    # Lister toutes
GET    /api/v1/informations/published          # Lister publiées
GET    /api/v1/informations/category/{cat}    # Par catégorie
GET    /api/v1/informations/{id}               # Détails
PUT    /api/v1/informations/{id}               # Modifier (Admin)
DELETE /api/v1/informations/{id}               # Supprimer (Admin)
PUT    /api/v1/informations/{id}/publish       # Publier
PUT    /api/v1/informations/{id}/unpublish     # Dépublier
```

## 🧪 Tester l'API

### Avec Postman
Importer la collection: `CESIZen-API-Postman.json`

### Exemple avec curl
```bash
# Créer un compte
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Créer une activité
curl -X POST http://localhost:8080/api/v1/activities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yoga",
    "description": "Séance relaxante",
    "content": "...",
    "instructions": "..."
  }'
```

## 📚 Stack Technique

- **Framework**: Spring Boot 3.2.3 LTS
- **ORM**: JPA/Hibernate
- **Base de données**: PostgreSQL
- **Sécurité**: Spring Security + BCrypt
- **Build**: Maven 3.9+
- **JDK**: Java 17 LTS

## 🔐 Fonctionnalités Implémentées

✅ Gestion des comptes utilisateurs
✅ Système de rôles (USER/ADMIN)
✅ Gestion administrative des utilisateurs
✅ CRUD Activités détente
✅ CRUD Informations publiables
✅ Validation des données
✅ API RESTful complète
✅ CORS pour Angular (localhost:4200)
✅ Timestamps (created_at, updated_at)

## 📖 Documentation Complète

- [Guide Installation PostgreSQL](DATABASE_SETUP.md)
- [Guide Complet Setup](../CESIZEN_SETUP_GUIDE.md)
- [Collection Postman](CESIZen-API-Postman.json)

## ⚙️ Configuration

`application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/cesizen_db
    username: cesizen_user
    password: cesizen_password
  jpa:
    hibernate:
      ddl-auto: update
server:
  port: 8080
```

## 📝 Pistes d'Extension

- `domain/` : modèles métier
- `application/` : cas d'usage
- `infrastructure/` : persistance
- `web/` : contrôleurs REST et DTO
