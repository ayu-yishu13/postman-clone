#☄️ Antigravity Postman Clone

A fully functional clone of the Postman API client built with **Next.js (TypeScript)**, **FastAPI (Python)**, and **SQLite**.

This application acts as a proxy HTTP runner that executes outbound requests on behalf of the client to bypass browser CORS restrictions while supporting request collections, history persistence, environment variable replacement (`{{variable}}`), and beautiful code snippet generation.

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 16+ (App Router), TypeScript, Vanilla CSS.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, HTTPX (async requests proxy).
- **Database**: SQLite (SQLAlchemy ORM) to persist workspace data.

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Initialize virtual environment:
   ```bash
   python -m venv .venv
   ```
3. Activate virtual environment:
   - **Windows PowerShell**: `.\.venv\Scripts\Activate.ps1`
   - **macOS / Linux**: `source .venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   *Note: On startup, the backend automatically seeds SQLite with sample collections, open requests, environment variables, and history items.*

### 2. Frontend Setup (Next.js)

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Turbopack development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💾 Database Schema (SQLite)

We use SQLite via SQLAlchemy with the following database design:

### 1. `collections`
- `id` (INTEGER, Primary Key)
- `name` (TEXT, NOT NULL)
- `created_at` (DATETIME, default now)

### 2. `saved_requests`
- `id` (INTEGER, Primary Key)
- `collection_id` (INTEGER, Foreign Key referencing `collections.id` ON DELETE CASCADE)
- `name` (TEXT, NOT NULL)
- `method` (TEXT, e.g. `GET`, `POST`, `PUT`, `DELETE`)
- `url` (TEXT, NOT NULL)
- `headers` (TEXT, JSON string)
- `body_type` (TEXT, e.g., `none`, `raw`, `form-data`)
- `body_content` (TEXT)
- `auth_type` (TEXT, e.g., `none`, `bearer`, `basic`)
- `auth_config` (TEXT, JSON string)
- `created_at` (DATETIME)

### 3. `environments`
- `id` (INTEGER, Primary Key)
- `name` (TEXT, NOT NULL)
- `created_at` (DATETIME)

### 4. `env_variables`
- `id` (INTEGER, Primary Key)
- `environment_id` (INTEGER, Foreign Key referencing `environments.id` ON DELETE CASCADE)
- `key` (TEXT, NOT NULL)
- `value` (TEXT, NOT NULL)

### 5. `history_items`
- `id` (INTEGER, Primary Key)
- `method` (TEXT)
- `url` (TEXT)
- `headers` (TEXT, JSON string)
- `body_type` (TEXT)
- `body_content` (TEXT)
- `auth_type` (TEXT)
- `auth_config` (TEXT, JSON string)
- `sent_at` (DATETIME, default now)
- `status_code` (INTEGER)
- `response_time_ms` (INTEGER)
- `response_size_bytes` (INTEGER)
- `is_error` (BOOLEAN)

---

## ⚡ Key Features Implemented

1. **Workspace Layout**: Postman shell replica with side-by-side collections navigation and tabs.
2. **Variables Resolution**: Resolves double-bracketed `{{var}}` placeholders dynamically inside URLs, Headers, and Request Body payloads using the active environment configuration at send time.
3. **Request Builder**: Full control over URL parameters (synced automatically), Headers, Body, and Authorization (None, Bearer, and Basic).
4. **Proxy HTTP Runner**: Real HTTP request execution using async Python client `httpx` to bypass CORS blocks.
5. **Code Snippet Generator**: Automatic generation of `cURL`, Javascript `fetch`, or Python `requests` snippets.
