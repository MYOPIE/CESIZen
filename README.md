# CESIZen - Structure de base (Java + Angular)

Ce dépôt contient une base de travail pour un projet full stack :
- Backend Java (Spring Boot)
- Frontend Angular
- Documentation projet

## Arborescence

- `backend/` : API REST Java
- `frontend/` : application Angular
- `docs/` : livrables de conception, cadrage et suivi
- `infra/` : scripts d'infrastructure et conteneurisation
- `scripts/` : scripts utilitaires

## Prerequis

- Java 21
- Maven 3.9+
- Node.js LTS (version paire recommandee)

## Demarrage rapide

### 1) Backend

```bash
cd backend
mvn spring-boot:run
```

### 2) Frontend

```bash
cd frontend
npm run start
```

## Verification du fonctionnement

- Le backend expose un endpoint de verification: `GET /api/health`
- Le frontend appelle automatiquement `/api/health` au chargement
- Le proxy Angular est configure dans `frontend/proxy.conf.json` pour rediriger `/api` vers `http://localhost:8080`

## Conformite

- [Documentation RGPD / RGAA](docs/rgpd-rgaa.md)
