# ☄️ Antigravity — Postman Clone

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-ORM-003B57?style=flat-square&logo=sqlite)
![HTTPX](https://img.shields.io/badge/HTTPX-async-FF6B6B?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blueviolet?style=flat-square)

> A fully functional API client built with **Next.js**, **FastAPI**, and **SQLite** — featuring workspace management, environment variables, proxy execution, and code snippet generation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) · TypeScript · Vanilla CSS (glassmorphism) |
| Backend | Python 3.10+ · FastAPI · Uvicorn · HTTPX |
| Database | SQLite · SQLAlchemy ORM · Cascade deletes |

---

## ⚡ Features

- **Workspace Management** — Create, switch, and delete internal/public workspaces; all data is strictly scoped per workspace
- **Collections & Requests** — Save, organize, and reuse requests inside named collections
- **Environment Variables** — Define `{{variable}}` placeholders and resolve them dynamically at send time across URLs, headers, and body
- **Proxy HTTP Runner** — Executes real HTTP requests server-side via `httpx` to bypass browser CORS; returns status, response time (ms), headers, and syntax-highlighted body
- **Request Builder** — Full control over query params (auto-synced), headers, body (raw, JSON, URL-encoded, form-data), and auth (none, bearer token, basic auth)
- **History Log** — Every request is persisted to history, scoped to the active workspace
- **Code Snippet Generator** — One-click export to `cURL`, JS `fetch`, or Python `requests`
- **Cascade Deletes** — Deleting a workspace purges all child collections, environments, variables, and history

---

## 🧪 Sample URLs to Test

Ready-to-use public APIs — no auth required unless noted.

### ✅ GET Requests

| Name | URL | Notes |
|---|---|---|
| Public IP | `https://api.ipify.org?format=json` | Returns your public IP |
| Random joke | `https://official-joke-api.appspot.com/random_joke` | Chuck Norris not included |
| UUID generator | `https://www.uuidtools.com/api/generate/v4` | Generates a UUID v4 |
| Random user | `https://randomuser.me/api/` | Fake user profile |
| Dog image | `https://dog.ceo/api/breeds/image/random` | Random dog photo URL |
| ISS position | `http://api.open-notify.org/iss-now.json` | Live ISS location |
| Countries list | `https://restcountries.com/v3.1/all?fields=name,capital,population` | 250 countries |
| JSONPlaceholder posts | `https://jsonplaceholder.typicode.com/posts` | Fake blog posts |
| JSONPlaceholder post | `https://jsonplaceholder.typicode.com/posts/1` | Single post by ID |
| GitHub user | `https://api.github.com/users/torvalds` | Any GitHub username |
| GitHub repos | `https://api.github.com/users/torvalds/repos` | Public repos |
| Open Meteo weather | `https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current_weather=true` | Bengaluru weather, no key |
| Pokemon | `https://pokeapi.co/api/v2/pokemon/pikachu` | Pokémon data |
| Chuck Norris joke | `https://api.chucknorris.io/jokes/random` | He *is* included |
| Advice slip | `https://api.adviceslip.com/advice` | Random life advice |

### 📝 POST Requests

| Name | URL | Body (JSON) |
|---|---|---|
| Create post | `https://jsonplaceholder.typicode.com/posts` | `{"title": "Test", "body": "Hello world", "userId": 1}` |
| Create todo | `https://jsonplaceholder.typicode.com/todos` | `{"title": "Buy milk", "completed": false, "userId": 1}` |
| Echo request | `https://httpbin.org/post` | Any JSON — echoed back |
| Delay response | `https://httpbin.org/delay/2` | Tests timeout handling (2s delay) |

### 🔐 Auth Testing

| Name | URL | Auth |
|---|---|---|
| Basic auth | `https://httpbin.org/basic-auth/user/pass` | Basic — username: `user`, password: `pass` |
| Bearer token | `https://httpbin.org/bearer` | Bearer — any token string |

### 🧨 Error & Edge Cases

| Name | URL | Expected |
|---|---|---|
| 404 not found | `https://httpbin.org/status/404` | `404 Not Found` |
| 500 server error | `https://httpbin.org/status/500` | `500 Internal Server Error` |
| Slow response | `https://httpbin.org/delay/5` | Tests 5-second timeout |
| Large payload | `https://jsonplaceholder.typicode.com/photos` | 5,000 records — stress test |

---

## 💾 Database Schema

```mermaid
erDiagram
    WORKSPACES ||--o{ COLLECTIONS : "cascade delete"
    WORKSPACES ||--o{ ENVIRONMENTS : "cascade delete"
    WORKSPACES ||--o{ HISTORY_ITEMS : "cascade delete"
    COLLECTIONS ||--o{ SAVED_REQUESTS : "cascade delete"
    ENVIRONMENTS ||--o{ ENV_VARIABLES : "cascade delete"

    WORKSPACES {
        integer id PK
        string name UNIQUE
        string type "Internal / Public"
        string creator
        integer contributors
        string last_activity
        string access
        string role
        datetime created_at
    }

    COLLECTIONS {
        integer id PK
        integer workspace_id FK
        string name
        datetime created_at
    }

    SAVED_REQUESTS {
        integer id PK
        integer collection_id FK
        string name
        string method
        text url
        text headers "JSON"
        string body_type
        text body_content
        string auth_type
        text auth_config "JSON"
        datetime created_at
    }

    ENVIRONMENTS {
        integer id PK
        integer workspace_id FK
        string name
        datetime created_at
    }

    ENV_VARIABLES {
        integer id PK
        integer environment_id FK
        string key
        text value
    }

    HISTORY_ITEMS {
        integer id PK
        integer workspace_id FK
        string method
        text url
        text headers "JSON"
        string body_type
        text body_content
        string auth_type
        text auth_config "JSON"
        datetime sent_at
        integer status_code
        integer response_time_ms
        integer response_size_bytes
        boolean is_error
    }
```

---

## 🚀 Getting Started

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

> On first startup, the backend auto-seeds SQLite with default workspaces, collections, environments, and history — only if the workspaces table is empty.

### Frontend (Next.js)

```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📽️ Workspace Flow Demo

The walkthrough below shows user sign-in, workspace switching, collections isolation, new workspace creation, and cascade deletion.

![Workspace Flow Walkthrough](./workspace_flow_demo.webp)
