# 🚀 Guide de démarrage rapide - CESIZen Frontend

## Installation et lancement

### 1️⃣ Prérequis
- Node.js 18+ installé
- Angular CLI installé (`npm install -g @angular/cli`)

### 2️⃣ Démarrer le frontend

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
# ou
npm start
```

**L'app sera accessible sur** : `http://localhost:4200`

### 3️⃣ Démarrer le backend (optionnel)

```bash
# Dans un autre terminal, aller dans le dossier backend
cd backend

# Lancer le serveur Spring Boot
./mvnw spring-boot:run
```

**Le backend sera accessible sur** : `http://localhost:8080`

---

## Navigation entre les pages

Une fois le serveur lancé, vous pouvez accéder aux pages :

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Accueil | `http://localhost:4200/` | Page d'accueil avec héro et features |
| 👤 Mon compte | `http://localhost:4200/compte` | Connexion/inscription et profil |
| 📚 Informations | `http://localhost:4200/informations` | Articles et ressources |
| 🧘 Activités | `http://localhost:4200/activites` | Catalogue d'activités de détente |

---

## Fonctionnalités testables

### Page Accueil
✅ Cliquer sur "En savoir plus" → Redirection vers Informations
✅ Cliquer sur "Créer un compte" → Redirection vers Compte

### Page Compte
✅ Tester le formulaire de connexion
✅ Tester le formulaire d'inscription
✅ Voir l'affichage du profil après "connexion"
✅ Voir la modification du profil
✅ Tester les boutons "Se déconnecter" et "Supprimer compte"

### Page Informations
✅ Filtrer les articles par catégorie
✅ Voir les ressources supplémentaires
✅ Consulter la FAQ
✅ Navigation fluide entre les sections

### Page Activités
✅ Filtrer par type d'activité
✅ Trier par durée ou nom
✅ Ajouter/retirer des favoris (★)
✅ Voir les détails de chaque activité

---

## Structure générale

```
Les fichiers sont organisés ainsi :

frontend/
  ├── src/
  │   ├── app/
  │   │   ├── pages/        ← Pages principales
  │   │   ├── shared/       ← Composants partagés (navbar)
  │   │   ├── app.ts        ← Composant root
  │   │   ├── app.routes.ts ← Configuration des routes
  │   │   └── app.config.ts ← Configuration générale
  │   ├── styles/
  │   │   └── variables.scss ← Variables de couleurs et mixins
  │   ├── styles.scss       ← Styles globaux
  │   └── main.ts           ← Point d'entrée
  │
  ├── angular.json          ← Config Angular
  ├── tsconfig.json         ← Config TypeScript
  └── package.json          ← Dépendances
```

---

## Développement

### Ajouter une nouvelle page

1. **Créer le composant**
```bash
ng generate component pages/nouvelle-page
# ou manuellement : créer le dossier et les fichiers
```

2. **Créer les fichiers** :
   - `nouvelle-page.component.ts`
   - `nouvelle-page.component.html`
   - `nouvelle-page.component.scss`

3. **Ajouter la route** dans `app.routes.ts` :
```typescript
{ path: 'nouvelle-page', component: NouvellePage Component }
```

4. **Ajouter le lien** dans `navbar.component.html` :
```html
<li><a routerLink="/nouvelle-page">Nouvelle page</a></li>
```

5. **Utiliser les styles** :
```scss
@import '../../../styles/variables.scss';

// Utiliser les variables et mixins
.mon-element {
  @include card-style;
  color: $primary-blue;
}
```

---

## Personnaliser les couleurs

Les couleurs sont définies dans `src/styles/variables.scss`

Pour changer la palette :
```scss
// Avant
$primary-blue: #2c5aa0;
$primary-green: #22a668;

// Après
$primary-blue: #nouvelle-couleur;
$primary-green: #nouvelle-couleur;
```

Toute l'application sera mise à jour automatiquement!

---

## Troubleshooting

### L'app ne démarre pas?
```bash
# Supprimer les dépendances et réinstaller
rm -rf node_modules
npm install

# Relancer
ng serve
```

### Erreur "Module not found"?
```bash
# Vérifier que le fichier existe
# Vérifier que l'import est correct

# Récompiler
ng build
```

### Le style ne s'applique pas?
```bash
# Vérifier que vous importez les variables
@import '../../../styles/variables.scss';

# Vérifier les sélecteurs CSS
# Vérifier la spécificité CSS
```

### L'API backend ne répond pas?
```bash
# Vérifier que le backend est lancé
# Vérifier le port (8080)
# Voir le message de statut en haut de la page

# Lancer le backend si nécessaire
cd backend
./mvnw spring-boot:run
```

---

## Ressources utiles

- 📖 [Documentation Angular](https://angular.io)
- 🎨 [SCSS Documentation](https://sass-lang.com)
- 📱 [Mobile-first Design](https://mobile-first-responsive-web-design.com/)
- 🎯 [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Conseils de développement

1. **Utilisez les variables SCSS** pour cohérence
2. **Créez des composants réutilisables** pour code DRY
3. **Testez sur mobile** avec DevTools (F12)
4. **Utilisez les alerts** pour debugging rapide
5. **Organisez les fichiers** logiquement dans des dossiers

---

## Prochaines étapes

Pour compléter l'application :

1. ✅ [HOME PAGE] Créée
2. ✅ [COMPTE PAGE] Créée
3. ✅ [INFORMATIONS PAGE] Créée
4. ✅ [ACTIVITES PAGE] Créée
5. 🔲 [DIAGNOSTICS PAGE] À créer
6. 🔲 [TRACKER PAGE] À créer
7. 🔲 [RESPIRATION PAGE] À créer
8. 🔲 Intégration backend
9. 🔲 Tests unitaires
10. 🔲 Déploiement

---

**Bon développement! 🚀**

Pour toute question, consultez les fichiers :
- `PAGES_CREATED.md` - Détails des pages
- `ARCHITECTURE.md` - Architecture complète
