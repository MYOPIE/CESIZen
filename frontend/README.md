# 🧘 CESIZen - Frontend

Application Angular pour la gestion du stress et de la santé mentale.

La documentation détaillée de l'architecture, des tests et des scénarios de validation se trouve dans [DOCUMENTATION_TECHNIQUE_BLOC_2.md](../DOCUMENTATION_TECHNIQUE_BLOC_2.md).

## Démarrage rapide

```bash
cd frontend
npm install
ng serve
```

L'application est disponible sur `http://localhost:4200`.

## Commandes utiles

```bash
npm run test:unit
npm run test:functional
npm run test:regression
ng build --configuration production
```

## Pages principales

| Page | Route |
|------|-------|
| Accueil | `/` |
| Compte | `/compte` |
| Informations | `/informations` |
| Activités | `/activites` |
| Administration | `/admin` |

## Points clés

- Composants standalone
- Services HTTP centralisés
- Favoris protégés par JWT
- Tests unitaires automatisés avec Vitest
- Tâches VS Code prêtes à l'emploi pour les tests

## Références

- [QUICKSTART.md](./QUICKSTART.md)
- [INDEX.md](./INDEX.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [VISUAL_SUMMARY.md](./VISUAL_SUMMARY.md)
