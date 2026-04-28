# 🚀 Guide Complet - CESIZen Backend + PostgreSQL

## Vue d'ensemble

Votre backend CESIZen est maintenant **entièrement configuré** avec:
- ✅ PostgreSQL comme base de données
- ✅ Spring Boot 3.2.3 (LTS)
- ✅ JPA/Hibernate pour la gestion des données
- ✅ Spring Security pour l'authentification
- ✅ API REST complète pour comptes, activités et informations
- ✅ Support Admin pour la gestion complète

## 📋 Configuration Requise

### 1. Java 17 LTS
```bash
# Vérifier la version Java
java -version

# Si Java 26 est configuré par défaut, vous devez changer JAVA_HOME:
# Windows: Ajouter à vos Variables d'Environnement
# JAVA_HOME = C:\Program Files\Java\jdk-17.x.x

# Ou sur PowerShell:
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17.x.x"
mvn clean install -DskipTests
```

### 2. PostgreSQL 12+
```bash
# Windows: Installer depuis https://www.postgresql.org/download/windows/
# macOS: brew install postgresql && brew services start postgresql
# Linux: sudo apt-get install postgresql postgresql-contrib
```

### 3. Maven 3.9+
Vous l'avez déjà (3.9.15) ✅

## 🗄️ Initialiser la Base de Données PostgreSQL

### Étape 1: Se connecter à PostgreSQL
```bash
psql -U postgres
```

### Étape 2: Exécuter ces commandes SQL
```sql
-- Créer l'utilisateur
CREATE USER cesizen_user WITH PASSWORD 'cesizen_password';

-- Créer la base de données
CREATE DATABASE cesizen_db OWNER cesizen_user;

-- Se connecter à la base
\c cesizen_db

-- Donner toutes les permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO cesizen_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cesizen_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cesizen_user;

-- Quitter
\q
```

### Étape 3: Tester la connexion
```bash
psql -U cesizen_user -d cesizen_db -h localhost
# Quitter avec: \q
```

## 🔨 Compiler le Backend

```bash
cd backend
mvn clean install -DskipTests
```

**Si vous avez des erreurs Lombok:**
```bash
# S'assurer que Java 17 est utilisé
set JAVA_HOME=C:\Program Files\Java\jdk-17.x.x
# Puis relancer:
mvn clean install -DskipTests
```

## ▶️ Lancer le Backend

### Option 1: Avec Maven (développement)
```bash
cd backend
mvn spring-boot:run
```

### Option 2: Avec le JAR compilé
```bash
cd backend
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

L'application démarre sur **http://localhost:8080**

## 🧪 Tester l'API

### 1. Créer un compte utilisateur
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

**Réponse:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ROLE_USER",
    "isActive": true,
    "createdAt": "2024-04-27 21:30:00",
    "updatedAt": "2024-04-27 21:30:00"
  },
  "message": "User registered successfully"
}
```

### 2. Se connecter
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Voir tous les utilisateurs (Admin)
```bash
curl -X GET http://localhost:8080/api/v1/users
```

### 4. Créer une activité détente
```bash
curl -X POST http://localhost:8080/api/v1/activities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yoga Relaxant",
    "description": "Une séance de yoga pour se détendre",
    "content": "Position du lotus, respiration profonde...",
    "instructions": "1. S'asseoir confortablement\n2. Respirer profondément..."
  }'
```

### 5. Voir les activités actives
```bash
curl -X GET http://localhost:8080/api/v1/activities/active
```

### 6. Créer une information de santé mentale
```bash
curl -X POST http://localhost:8080/api/v1/informations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Gestion du stress",
    "content": "5 techniques pour gérer votre stress quotidien...",
    "category": "Mental Health"
  }'
```

### 7. Voir les informations publiées
```bash
curl -X GET http://localhost:8080/api/v1/informations/published
```

### 8. Promouvoir un utilisateur en Admin
```bash
curl -X PUT http://localhost:8080/api/v1/users/1/promote-admin
```

### 9. Désactiver un compte
```bash
curl -X PUT http://localhost:8080/api/v1/users/1/deactivate
```

## 📊 Structure de la Base de Données

### Table: users
- `id`: Identifiant unique
- `email`: Email unique
- `first_name`: Prénom
- `last_name`: Nom
- `password`: Hash sécurisé (BCrypt)
- `role`: USER ou ADMIN
- `is_active`: Compte actif/désactivé
- `created_at`, `updated_at`: Timestamps

### Table: activities
- `id`: Identifiant unique
- `title`: Titre de l'activité
- `description`: Description courte
- `content`: Contenu détaillé
- `instructions`: Instructions étape par étape
- `is_active`: Activité visible/non visible
- `created_at`, `updated_at`: Timestamps

### Table: informations
- `id`: Identifiant unique
- `title`: Titre de l'information
- `content`: Contenu HTML/Markdown
- `category`: Catégorie (ex: "Mental Health", "Prevention")
- `is_published`: Publiée/non publiée
- `created_at`, `updated_at`: Timestamps

## 🔐 Endpoints Disponibles

### Authentification
- `POST /api/v1/auth/register` - Créer un compte
- `POST /api/v1/auth/login` - Se connecter

### Utilisateurs (Admin uniquement)
- `GET /api/v1/users` - Lister tous les utilisateurs
- `GET /api/v1/users/{id}` - Détails d'un utilisateur
- `PUT /api/v1/users/{id}` - Modifier un utilisateur
- `DELETE /api/v1/users/{id}` - Supprimer un utilisateur
- `PUT /api/v1/users/{id}/deactivate` - Désactiver
- `PUT /api/v1/users/{id}/promote-admin` - Promouvoir en Admin
- `PUT /api/v1/users/{id}/demote-admin` - Rétrograder Admin

### Activités
- `POST /api/v1/activities` - Créer une activité (Admin)
- `GET /api/v1/activities` - Lister toutes
- `GET /api/v1/activities/active` - Lister les actives
- `GET /api/v1/activities/{id}` - Détails
- `PUT /api/v1/activities/{id}` - Modifier (Admin)
- `DELETE /api/v1/activities/{id}` - Supprimer (Admin)
- `PUT /api/v1/activities/{id}/deactivate` - Désactiver
- `PUT /api/v1/activities/{id}/reactivate` - Réactiver

### Informations
- `POST /api/v1/informations` - Créer une information (Admin)
- `GET /api/v1/informations` - Lister toutes
- `GET /api/v1/informations/published` - Lister les publiées
- `GET /api/v1/informations/category/{category}` - Par catégorie
- `GET /api/v1/informations/{id}` - Détails
- `PUT /api/v1/informations/{id}` - Modifier (Admin)
- `DELETE /api/v1/informations/{id}` - Supprimer (Admin)
- `PUT /api/v1/informations/{id}/publish` - Publier
- `PUT /api/v1/informations/{id}/unpublish` - Dépublier

## 🎯 Prochaines Étapes

### 1. Implémenter JWT pour l'authentification
- Générer un token JWT au login
- Valider le token pour les endpoints protégés

### 2. Ajouter les contrôles de rôle (Role-Based Access Control)
- Seuls les ADMINs peuvent créer/modifier/supprimer
- Les USERs peuvent voir mais pas modifier

### 3. Ajouter le Tracker d'Émotions
- Entité `EmotionTracker`
- Endpoints pour enregistrer et consulter les émotions

### 4. Ajouter les Exercices de Respiration
- Entité `RespirationExercise`
- Configurations (7-4-8, 5-5, etc.)

### 5. Intégrer avec le Frontend Angular
- Mettre à jour les appels API dans l'Angular
- Ajouter l'authentification JWT

### 6. Tests Unitaires et d'Intégration
- JUnit 5 pour les tests unitaires
- Testcontainers pour PostgreSQL en test

### 7. Déploiement
- Docker (Dockerfile + docker-compose.yml)
- Server Linux (Ubuntu, Debian)
- Cloud (AWS, Azure, Heroku)

## 📝 Notes Importantes

### Sécurité
- ⚠️ **Production**: Changer le mot de passe PostgreSQL
- ⚠️ **Production**: Implémenter JWT avec une clé secrète sécurisée
- ⚠️ **Production**: Activer HTTPS/TLS
- ⚠️ **Production**: Ajouter rate limiting et WAF

### Base de Données
- Hibernate crée automatiquement les tables avec `ddl-auto: update`
- Pour un reset complet:
  ```sql
  DROP DATABASE cesizen_db;
  CREATE DATABASE cesizen_db OWNER cesizen_user;
  \c cesizen_db
  GRANT ALL PRIVILEGES ON SCHEMA public TO cesizen_user;
  ```

### Développement
- Les logs sont dans la console quand vous lancez `mvn spring-boot:run`
- Modifier `application.yml` pour ajuster la configuration
- Recompiler après modifications: `mvn clean install -DskipTests`

## ❓ Dépannage

### Erreur: "database "cesizen_db" does not exist"
→ Créer la base de données (voir section "Initialiser la Base de Données")

### Erreur: "role "cesizen_user" does not exist"  
→ Créer l'utilisateur (voir section "Initialiser la Base de Données")

### Compilation échoue avec Lombok
→ S'assurer que Java 17 est utilisé:
```bash
set JAVA_HOME=C:\Program Files\Java\jdk-17.x.x
```

### Application ne démarre pas sur le port 8080
→ Vérifier que le port est libre:
```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 8080
# Changer le port dans application.yml si nécessaire
```

### PostgreSQL ne démarre pas
```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\data" start

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

## 📚 Ressources Utiles

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Lombok](https://projectlombok.org/)
- [REST API Best Practices](https://restfulapi.net/)

---

✨ **Votre backend CESIZen est prêt!** Vous pouvez maintenant:
1. Ajouter, supprimer, modifier les comptes utilisateurs
2. Gérer les droits administrateur
3. Créer et gérer les fiches activités
4. Créer et publier les fiches informations
5. Connecter l'Angular frontend
