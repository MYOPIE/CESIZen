# 🚀 Guide de démarrage rapide - CESIZen Frontend

## Démarrage

```bash
cd frontend
npm install
ng serve
```

Le frontend est accessible sur `http://localhost:4200`.

## Vérifications utiles

```bash
npm run test:unit
npm run test:functional
npm run test:regression
```

## Parcours à tester

- Accueil: redirections vers Informations et Compte
- Compte: connexion, inscription, déconnexion, validation des champs
- Informations: filtrage par catégorie et favoris
- Activités: tri, filtre et favoris
- Administration: création et tri des contenus

## Si l'API n'est pas disponible

```bash
cd backend
./mvnw spring-boot:run
```

Le backend écoute sur `http://localhost:8080`.

## Références

- [DOCUMENTATION_TECHNIQUE_BLOC_2.md](../DOCUMENTATION_TECHNIQUE_BLOC_2.md)
- [README.md](./README.md)
- [INDEX.md](./INDEX.md)
