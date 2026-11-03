# Game Ranking

Application web pour suivre et classer les jeux vidéo auxquels je joue dans l'année.

![Aperçu de l'application](docs/screenshot.png)

## Fonctionnalités

- Suivi des jeux par statut : **À faire**, **En cours**, **Terminé**
- Recherche des jeux et récupération automatique des visuels via l'**API RAWG**
- Notation sur 20 (Histoire, Gameplay, Direction artistique) avec moyenne calculée
- Classement des jeux terminés par note
- Validation des données côté serveur (notes obligatoires pour un jeu terminé)

## Stack technique

| Couche | Technologies |
|---|---|
| Front | React, TypeScript, Vite, Tailwind CSS, React Router |
| Back | Node.js, Express, TypeScript, Zod |
| Base de données | PostgreSQL (Docker), Prisma ORM |
| API externe | [RAWG](https://rawg.io/apidocs) |

## Lancer le projet en local

### Prérequis

- [Node.js](https://nodejs.org/) (version LTS)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Une clé API gratuite [RAWG](https://rawg.io/apidocs)

### 1. Démarrer la base de données

```bash
docker compose up -d
```

### 2. Lancer l'API

```bash
cd server
npm install
cp .env.example .env    # puis renseigner RAWG_API_KEY dans .env
npx prisma migrate dev
npx prisma generate
npm run dev
```

L'API tourne sur http://localhost:3000

### 3. Lancer le front

Dans un second terminal :

```bash
cd client
npm install
npm run dev
```

L'application est disponible sur http://localhost:5173

## API

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/games` | Liste des jeux (filtre optionnel `?status=COMPLETED`) |
| `GET` | `/api/games/:id` | Détail d'un jeu |
| `POST` | `/api/games` | Ajouter un jeu |
| `PUT` | `/api/games/:id` | Modifier un jeu |
| `DELETE` | `/api/games/:id` | Supprimer un jeu |
| `GET` | `/api/rawg/search?q=...` | Rechercher un jeu sur RAWG |

## Structure du projet

```
game-ranking/
├── docker-compose.yml   # base PostgreSQL
├── server/              # API Express + Prisma
│   ├── prisma/          # schéma et migrations
│   └── src/routes/      # routes games et rawg
└── client/              # front React
    └── src/
        ├── api/         # appels à l'API
        ├── components/  # composants réutilisables
        └── pages/       # pages Classement et Mes jeux
```

## Pistes d'évolution

- Suppression d'un jeu depuis l'interface
- Affichage de l'avis détaillé dans le classement
- Glisser-déposer entre les colonnes
- Version responsive pour mobile