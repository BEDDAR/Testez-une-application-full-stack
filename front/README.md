# 🧘 Yoga - Plateforme de Sessions

Ce projet est une application complète (front-end Angular + back-end Spring Boot) permettant de gérer des sessions de yoga. Il inclut l’authentification, la gestion des comptes, la création de sessions, et bien plus. Il est également bien couvert par des tests unitaires, d’intégration et end-to-end (E2E).

---

## 🧰 Outils utilisés

- Java 11+
- Node.js v16+ et npm
- Angular CLI (`npm install -g @angular/cli`)
- Maven
- Angular 14
- Cypress
- Jest
- Spring Boot
- Mockito / JUnit 5
- JaCoCo
- Postman

---

## 🗄️ Installation de la base de données

1. Assurez-vous que votre serveur MySQL est en cours d’exécution.
2. Importez le script SQL :
```bash
mysql -u root -p < ressources/sql/script.sql
```

Cela créera les tables et insérera un utilisateur admin par défaut :

- **Email** : `yoga@studio.com`
- **Mot de passe** : `test!1234`

⚠️ Si vous utilisez PostgreSQL, adaptez le script en conséquence.

---

## 🚀 Installation & Lancement de l’application

### Clone du projet

```bash
git clone https://github.com/OpenClassrooms-Student-Center/P5-Full-Stack-testing
cd yoga
```

### Installation du Front-End

```bash
cd front
npm install
npm run serve
```

### Installation du Back-End

```bash
cd back
mvn install
mvn spring-boot:run
```

Le backend sera disponible par défaut sur `http://localhost:8080`.

---

## ✅ Lancer les tests

### 🧪 Tests unitaires (Angular - Jest)

```bash
npm run test
```

Lancer en mode "watch" pour surveiller les fichiers :

```bash
npm run test:watch
```
Générer un rapport de couverture :

```bash
npm run test -- --coverage
```
### 🧪 Tests End-to-End (Cypress)

```bash
npm run e2e
```

Générer un rapport de couverture :

```bash
npm run e2e:coverage
```

Vous trouverez ensuite le rapport ici :

```
front/coverage/lcov-report/index.html
```

---

## 🧪 Tests Back-End (Spring Boot)

Lancer les tests :

```bash
mvn test
```

Générer un rapport de couverture avec JaCoCo :

```bash
mvn clean verify
```

Rapport disponible ici :

```
back/target/site/jacoco/index.html
```

---

## 🧪 Plan de Test & Couverture

### ✅ Objectif : 80 % de couverture

### Fonctionnalités testées

#### 🔐 Authentification (Login)

- Connexion correcte
- Erreur si mauvais identifiants
- Erreur si champ vide

#### 👤 Création de compte (Register)

- Inscription valide
- Erreurs sur champs manquants

#### 🧘 Sessions

- Affichage de toutes les sessions
- Visibilité des boutons `Create` et `Detail` pour les admins
- Informations détaillées d’une session
- Bouton `Delete` visible uniquement pour les admins
- Création de session
- Modification de session
- Suppression de session

#### 👥 Compte utilisateur

- Affichage des infos utilisateur
- Déconnexion

---

## ⚠️ Remarques

- La sécurité est gérée avec JWT côté back.
- Les tests incluent des cas de succès et d’échec (ex: mauvais identifiants, accès sans authentification).
- Pour simuler un utilisateur connecté dans les tests back-end, `@WithMockUser` est utilisé.
- Pour les tests E2E, des fixtures Cypress ont été mises en place.

---

## 📎 Ressources

### 📦 Mockoon

Un environnement simulé est disponible avec Mockoon.

### 📬 Postman

Importez la collection :

```
ressources/postman/yoga.postman_collection.json
```

Documentation Postman :  
https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman

---
