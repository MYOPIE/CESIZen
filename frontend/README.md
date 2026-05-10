# 🧘 CESIZen - Frontend

Application Angular pour la gestion du stress et la santé mentale.

> Découvrez des outils simples et efficaces pour mieux comprendre votre stress, gérer vos émotions et cultiver un bien-être durable.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve

# Ouvrir http://localhost:4200
```

L'application se recharge automatiquement lors des modifications.

## 📄 Pages créées

| Page | Route | Description |
|------|-------|-------------|
| 🏠 Accueil | `/` | Présentation et features |
| 👤 Compte | `/compte` | Authentification et profil |
| 📚 Informations | `/informations` | Articles et ressources |
| 🧘 Activités | `/activites` | Catalogue d'activités |

## 🎨 Design

**Thème:** Bleu clair (#2c5aa0) + Vert clair (#22a668)

- Design responsif (mobile-first)
- Animations fluides
- Accessible et moderne
- WCAG AA compliant

## 📚 Documentation

Pour plus d'informations, consultez :

- 📖 [INDEX.md](./INDEX.md) - Guide complet
- 🚀 [QUICKSTART.md](./QUICKSTART.md) - Démarrage rapide
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture
- 🎨 [VISUAL_SUMMARY.md](./VISUAL_SUMMARY.md) - Aperçu visuel

## 📁 Structure

```
src/
├── app/
│   ├── pages/         # Pages principales
│   ├── shared/        # Composants partagés
│   ├── app.ts         # Composant root
│   └── app.routes.ts  # Routing
├── styles/            # Styles SCSS
└── styles.scss        # Styles globaux
```

## 🛠️ Build

```bash
ng build --configuration production
```

## 🧪 Tests

```bash
ng test
```

## 💻 Développement

Pour ajouter une nouvelle page :

1. Créer le dossier dans `src/app/pages/`
2. Ajouter la route dans `app.routes.ts`
3. Ajouter le lien dans `navbar.component.html`
4. Utiliser les variables SCSS pour les couleurs

## 📱 Responsive

- Desktop: 1024px+
- Tablet: 768px - 1024px  
- Mobile: < 768px

## 🔗 Liens utiles

- [Angular](https://angular.io)
- [TypeScript](https://www.typescriptlang.org)
- [SCSS](https://sass-lang.com)

## 📝 Notes

- Node 18+ requis
- Angular CLI v21+
- Framework standalone

---

**Besoin d'aide?** Consultez [QUICKSTART.md](./QUICKSTART.md)

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
