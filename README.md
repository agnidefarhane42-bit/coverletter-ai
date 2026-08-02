# CoverLetter AI

> Générateur de lettres de motivation IA personnalisées.

CoverLetter AI est une application moderne et intuitive permettant de générer automatiquement des lettres de motivation percutantes, sur mesure et optimisées pour le recrutement grâce à l'intelligence artificielle de Mistral AI.

---

## 🚀 Fonctionnalités

- **Génération IA sur mesure** : Analyse croisée du CV et de l'offre d'emploi pour produire une lettre unique et pertinente.
- **Personnalisation avancée** : Ajustement du ton (professionnel, créatif, synthétique, enthousiaste) et de la structure de rédaction.
- **Analyse d'adéquation (Matching CV/Job)** : Extraction automatique des compétences clés et recommandations pour maximiser l'impact auprès des recruteurs.
- **Exportation multi-formats** : Téléchargement direct aux formats PDF et DOCX haute qualité via DocEngine.
- **Système de Paiement & Crédits** : Intégration fluide de la passerelle Notch Pay pour la gestion des crédits et des abonnements.
- **Tableau de Bord & Historique** : Sauvegarde, édition et réutilisation de vos lettres générées.
- **Interface Réactive & Moderne** : Conçue avec Next.js 15, React et Tailwind CSS.

---

## 🛠️ Stack Technique

- **Frontend** : [Next.js 15](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), Tailwind CSS, React
- **Backend** : [Python 3.12](https://www.python.org/), [FastAPI](https://fastapi.tiangolo.com/), Uvicorn, Pydantic
- **Moteur IA** : [Mistral AI](https://mistral.ai/)
- **Génération de Documents** : [DocEngine](https://docengine.com/) (PDF / DOCX)
- **Paiements** : [Notch Pay](https://notchpay.co/)

---

## 📋 Prérequis

Avant de commencer, assurez-vous de disposer des éléments suivants :

- **Node.js** : v18.0.0 ou plus récent
- **npm** ou **yarn** / **pnpm**
- **Python** : v3.12 ou plus récent
- **Clé API Mistral AI** : [Obtenir une clé API Mistral](https://console.mistral.ai/)
- *(Optionnel)* **Clé API DocEngine** & **Clés API Notch Pay**

---

## ⚙️ Variables d'Environnement

Créez un fichier `.env` à la racine du projet (ou utilisez le modèle `.env.example`) :

```bash
cp .env.example .env
```

Voici les variables requises :

| Variable | Description | Exemple / Valeur |
| --- | --- | --- |
| `NODE_ENV` | Environnement de l'application | `development` / `production` |
| `HOST` | Hôte d'exécution du backend FastAPI | `0.0.0.0` |
| `PORT` | Port d'exécution du backend FastAPI | `8000` |
| `CORS_ORIGINS` | Origines autorisées pour les requêtes CORS | `http://localhost:3000` |
| `MISTRAL_API_KEY` | Clé API pour Mistral AI | `your_mistral_api_key_here` |
| `DOCENGINE_API_KEY` | Clé API pour la génération de documents DocEngine | `your_docengine_api_key_here` |
| `NOTCH_PAY_PUBLIC_KEY` | Clé publique Notch Pay | `sb.pub_xxxxxxxx` |
| `NOTCH_PAY_PRIVATE_KEY` | Clé privée Notch Pay | `sb.prv_xxxxxxxx` |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend accessible par le frontend | `http://localhost:8000` |
| `NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY` | Clé publique Notch Pay accessible côté client | `sb.pub_xxxxxxxx` |
| `NEXTAUTH_SECRET` | Clé secrète pour l'authentification NextAuth | `your_nextauth_secret` |
| `NEXTAUTH_URL` | URL de l'application frontend | `http://localhost:3000` |

---

## 📦 Installation & Lancement local

### Option 1 : Lancement avec Docker Compose (Recommandé)

1. Clonez le dépôt et accédez au dossier :
   ```bash
   git clone https://github.com/agnide/coverletter-ai.git
   cd coverletter-ai
   ```

2. Configurez votre fichier `.env` à la racine :
   ```bash
   cp .env.example .env
   # Renseignez au minimum MISTRAL_API_KEY
   ```

3. Lancez les services :
   ```bash
   docker-compose up --build
   ```

L'application sera accessible sur :
- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend API** : [http://localhost:8000](http://localhost:8000)
- **Documentation OpenAPI (Swagger)** : [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2 : Installation manuelle (Développement)

#### 1. Backend (FastAPI & Python)

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel Python 3.12
python3.12 -m venv .venv
source .venv/bin/activate  # Sur Windows: .venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur Uvicorn
uvicorn main:app --reload --port 8000
```

#### 2. Frontend (Next.js 15)

```bash
# Dans un nouveau terminal, aller dans le dossier frontend
cd frontend

# Installer les dépendances Node.js
npm install

# Démarrer le serveur de développement Next.js
npm run dev
```

L'interface utilisateur est disponible sur `http://localhost:3000`.

---

## 📡 Documentation de l'API

### 1. Vérification de santé

- **Endpoint** : `GET /health`
- **Description** : Vérifie l'état de fonctionnement de l'API backend.
- **Réponse exemple** :
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-08-02T22:28:00Z"
  }
  ```

---

### 2. Générer une lettre de motivation

- **Endpoint** : `POST /api/v1/generate`
- **En-têtes** : `Content-Type: application/json`
- **Corps de la requête (Request Body)** :
  ```json
  {
    "resume_text": "Développeur Full Stack Senior avec 5 ans d'expérience en Next.js, Python et FastAPI...",
    "job_description": "Nous recherchons un Développeur Senior Python/Next.js pour concevoir des applications web haute performance...",
    "company_name": "TechCorp",
    "job_title": "Développeur Full Stack Senior",
    "tone": "professionnel",
    "language": "fr"
  }
  ```
- **Réponse exemple (200 OK)** :
  ```json
  {
    "id": "cl_987654321",
    "cover_letter": "Madame, Monsieur,\n\nC'est avec un vif intérêt que je vous adresse ma candidature pour le poste de Développeur Full Stack Senior au sein de TechCorp...",
    "tone": "professionnel",
    "word_count": 340,
    "created_at": "2026-08-02T22:28:00Z"
  }
  ```

---

### 3. Exporter un document (PDF / DOCX)

- **Endpoint** : `POST /api/v1/export`
- **En-têtes** : `Content-Type: application/json`
- **Corps de la requête (Request Body)** :
  ```json
  {
    "content": "Contenu complet de la lettre de motivation...",
    "format": "pdf",
    "template": "modern"
  }
  ```
- **Réponse exemple (200 OK)** :
  ```json
  {
    "download_url": "https://api.docengine.com/v1/download/doc_123456789.pdf",
    "format": "pdf",
    "expires_at": "2026-08-03T22:28:00Z"
  }
  ```

---

### 4. Initialiser un paiement (Notch Pay)

- **Endpoint** : `POST /api/v1/checkout`
- **En-têtes** : `Content-Type: application/json`
- **Corps de la requête (Request Body)** :
  ```json
  {
    "plan_id": "pro_pack_10",
    "amount": 5000,
    "currency": "XAF",
    "email": "user@example.com"
  }
  ```
- **Réponse exemple (200 OK)** :
  ```json
  {
    "transaction_reference": "trx_notch_998877",
    "payment_url": "https://pay.notchpay.co/checkout/trx_notch_998877",
    "status": "pending"
  }
  ```

---

## 🚀 Déploiement en Production

### Frontend (Vercel)

1. Connectez votre dépôt Git à [Vercel](https://vercel.com).
2. Configurez le dossier racine du projet Frontend : `frontend`.
3. Ajoutez les variables d'environnement suivantes dans les paramètres du projet Vercel :
   - `NEXT_PUBLIC_API_URL` (ex: `https://backend-production.up.railway.app`)
   - `NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Déployez.

### Backend (Railway / Render)

#### Déploiement sur Railway :
1. Créez un nouveau projet sur [Railway](https://railway.app/).
2. Connectez le dépôt Git et définissez le Root Directory sur `backend`.
3. Ajoutez les variables d'environnement nécessaires :
   - `MISTRAL_API_KEY`
   - `DOCENGINE_API_KEY`
   - `NOTCH_PAY_PRIVATE_KEY`
   - `NOTCH_PAY_PUBLIC_KEY`
   - `CORS_ORIGINS` (URL de votre frontend Vercel)
4. La commande de démarrage est générée automatiquement ou spécifiée via : `uvicorn main:app --host 0.0.0.0 --port $PORT`.

#### Déploiement sur Render :
1. Créez un nouveau **Web Service** sur [Render](https://render.com/).
2. Spécifiez l'environnement **Python**.
3. Repertoire racine : `backend`.
4. Build Command : `pip install -r requirements.txt`.
5. Start Command : `uvicorn main:app --host 0.0.0.0 --port $PORT`.
6. Configurez les variables d'environnement dans la section **Environment**.

---

## 📄 Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](./LICENSE) pour plus de détails.

Copyright (c) 2026 Agnide Farhane.
