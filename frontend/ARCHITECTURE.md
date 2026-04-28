# 🏗️ Architecture CESIZen Frontend

## Hiérarchie des composants

```
AppComponent (app.ts)
│
├── NavbarComponent (shared/navbar)
│   └── Navigation et logo
│
└── Router Outlet
    ├── HomeComponent (/)
    │   ├── Hero Section
    │   ├── Features Grid
    │   ├── Stats Section
    │   └── CTA Section
    │
    ├── CompteComponent (/compte)
    │   ├── Auth Section
    │   │   ├── Login Form
    │   │   └── Register Form
    │   └── Profile Section
    │       ├── Profile Card
    │       ├── Edit Form
    │       └── Actions
    │
    ├── InformationsComponent (/informations)
    │   ├── Filters Section
    │   ├── Articles Grid
    │   ├── Resources Grid
    │   └── FAQ Section
    │
    └── ActivitesComponent (/activites)
        ├── Controls Section
        │   ├── Filters
        │   └── Sort
        ├── Activities Grid
        └── Tips Section
```

## Routes configurées

```
/ ..................... HomeComponent (Accueil)
/compte ................ CompteComponent (Gestion du compte)
/informations .......... InformationsComponent (Articles & Ressources)
/activites ............. ActivitesComponent (Activités de détente)
/* ..................... Redirection vers / (accueil)
```

## Structure des fichiers

```
frontend/src/
│
├── app/
│   ├── pages/
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   ├── home.component.html
│   │   │   └── home.component.scss
│   │   │
│   │   ├── compte/
│   │   │   ├── compte.component.ts
│   │   │   ├── compte.component.html
│   │   │   └── compte.component.scss
│   │   │
│   │   ├── informations/
│   │   │   ├── informations.component.ts
│   │   │   ├── informations.component.html
│   │   │   └── informations.component.scss
│   │   │
│   │   └── activites/
│   │       ├── activites.component.ts
│   │       ├── activites.component.html
│   │       └── activites.component.scss
│   │
│   ├── shared/
│   │   └── navbar/
│   │       ├── navbar.component.ts
│   │       ├── navbar.component.html
│   │       └── navbar.component.scss
│   │
│   ├── app.ts
│   ├── app.html
│   ├── app.scss
│   ├── app.config.ts
│   └── app.routes.ts
│
├── styles/
│   └── variables.scss (Palette, mixins, variables)
│
└── styles.scss (Styles globaux)
```

## Flux de données & Événements

### HomeComponent
```
Données:
  - features: Array (4 items)
  - stats: Array (4 items)

Événements:
  - routerLink vers /compte (CTA buttons)
```

### CompteComponent
```
Données:
  - isConnected: boolean
  - showLoginForm: boolean
  - loginForm: {email, password}
  - registerForm: {pseudo, email, password, confirmPassword, acceptTerms}
  - userProfile: {pseudo, email, dateCreation, role}

Événements:
  - onLogin() → Update isConnected
  - onRegister() → Update isConnected
  - onLogout() → Reset state
  - toggleForm() → Toggle login/register
  - onDeleteAccount() → Reset with confirmation
```

### InformationsComponent
```
Données:
  - articles: Array (6 items)
  - categories: Array (4 items)
  - selectedCategory: string

Méthodes:
  - filterByCategory(category): void
  - get filteredArticles(): Array
```

### ActivitesComponent
```
Données:
  - activites: Array (8 items)
  - types: Array (9 items)
  - selectedType: string
  - sortBy: string

Méthodes:
  - filterByType(type): void
  - toggleFavorite(activite): void
  - getDifficulteLabel(niveau): string
  - get filteredActivites(): Array (avec tri)
```

## Palette de couleurs

```
┌─────────────────────────────────────────────┐
│ PRIMARY COLORS                               │
├─────────────────────────────────────────────┤
│ Primary Blue       #2c5aa0  ████████████████│
│ Primary Green      #22a668  ████████████████│
│ Light Blue         #4a90e2  ████████████████│
│ Light Green        #52c41a  ████████████████│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ SECONDARY COLORS                            │
├─────────────────────────────────────────────┤
│ Pale Blue          #e8f4f8  ████████████████│
│ Pale Green         #f0f9f4  ████████████████│
│ Dark Blue          #1a3a5c  ████████████████│
│ Dark Green         #157a4e  ████████████████│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ NEUTRAL COLORS                              │
├─────────────────────────────────────────────┤
│ White              #ffffff  ████████████████│
│ Light Gray         #f5f7fa  ████████████████│
│ Medium Gray        #d0d8e0  ████████████████│
│ Dark Gray          #6c757d  ████████████████│
│ Very Dark Gray     #2b3544  ████████████████│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ SEMANTIC COLORS                             │
├─────────────────────────────────────────────┤
│ Success            #22a668  ████████████████│
│ Warning            #f5a623  ████████████████│
│ Error              #e74c3c  ████████████████│
│ Info               #4a90e2  ████████████████│
└─────────────────────────────────────────────┘
```

## Mixins SCSS disponibles

```scss
@mixin card-style
  → Style de carte standard avec ombre et hover

@mixin button-style($bg-color, $text-color)
  → Style de bouton avec couleur et interactivité

@mixin flex-center
  → Flexbox centré (center)

@mixin flex-column
  → Flexbox en colonne
```

## Utilitaires CSS

```
.text-center, .text-blue, .text-green, .text-muted
.mt-1/2/3/4, .mb-1/2/3/4, .p-1/2/3/4
.grid (CSS Grid 3 colonnes responsive)
.alert (success, danger, info, warning)
.loader (spinner animé)
```

## Animations

```scss
Transitions disponibles:
  - $transition-fast: 0.2s ease
  - $transition-normal: 0.3s ease
  - $transition-slow: 0.5s ease

Animations utilisées:
  - float: Mouvement vertical léger
  - spin: Rotation continue (loader)
  - hover effects: Scale, translateY, shadow
```

## Points d'extension

Pour ajouter des pages supplémentaires :

1. Créer le dossier `src/app/pages/[nom]/`
2. Créer les fichiers `.ts`, `.html`, `.scss`
3. Ajouter la route dans `app.routes.ts`
4. Ajouter le lien dans `navbar.component.html`
5. Utiliser les variables SCSS et mixins existantes

## Commandes npm

```bash
# Lancer le serveur dev
ng serve

# Build production
ng build --configuration production

# Tests unitaires
ng test

# Linter
ng lint
```

## Points d'amélioration futurs

- [ ] Service pour la gestion d'état (NgRx ou Signal)
- [ ] Guards pour l'authentification
- [ ] Interceptors HTTP
- [ ] Lazy loading des routes
- [ ] PWA (Progressive Web App)
- [ ] Dark mode toggle
- [ ] i18n (internationalization)
- [ ] Analytics tracking
