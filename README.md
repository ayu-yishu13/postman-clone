# ☄️ Antigravity Postman Clone

A fully functional clone of the Postman API client built with **Next.js (TypeScript)**, **FastAPI (Python)**, and **SQLite**. 

This application acts as a proxy HTTP runner that executes outbound requests on behalf of the client to bypass browser CORS restrictions while supporting request collections, history persistence, environment variable replacement (`{{variable}}`), code snippet generation, and a fully integrated **Workspace Management System** with scoping and cascade deletes.

---

## 📽️ Workspace Flow Walkthrough

Here is the walkthrough demonstrating user sign-in, workspace switching, collections isolation, new workspace creation, and workspace deletion:

![Workspace Flow walkthough](./workspace_flow_demo.webp)

---

## 🛠️ Technical Stack

- **Frontend**: Next.js (App Router), TypeScript, Vanilla CSS (rich glassmorphism and modern UI transitions).
- **Backend**: Python 3.10+, FastAPI, Uvicorn, HTTPX (async HTTP proxy client).
- **Database**: SQLite (SQLAlchemy ORM) with foreign key constraints and cascade deletes.

---

## ⚡ Key Features Implemented

1. **Workspace Layout & Navigation**: Side-by-side collections navigation panel, history log, environment selection, and tabbed open requests matching the layout and resizable panes of the original Postman client.
2. **Dynamic Workspace Scoping**: All collections, environments, and history logs are strictly scoped by the active workspace. Switching workspaces dynamically fetches and updates the sidebar.
3. **Workspace CRUD**: Full workspace lifecycle (create new internal/public workspaces, switch workspaces, select multiple workspaces, delete workspaces).
4. **Cascade Deletions**: Deleting a workspace automatically purges all child collections, requests, environments, environment variables, and history items from the SQLite database.
5. **Variables Resolution**: Resolves double-bracketed `{{var}}` placeholders dynamically inside URLs, Headers, and Request Body payloads using the active environment configuration at send time.
6. **Request Builder & Viewer**: Full control over URL parameters (synced automatically with the query parameter table), Headers, request Body (Raw text, JSON, URL-Encoded, Form-Data), and Authorization (None, Bearer Token, and Basic Auth).
7. **Proxy HTTP Runner**: Real HTTP request execution using async Python client `httpx` to bypass browser CORS blocks and return status code, response time (ms), headers, and formatted/syntax-highlighted pretty response body.
8. **Code Snippet Generator**: Automatic generation of `cURL`, Javascript `fetch`, or Python `requests` snippets.

---

## 💾 Database Design (SQLite)

We use SQLite via SQLAlchemy with the following database schema design and relationships:

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
        text headers "JSON String"
        string body_type
        text body_content
        string auth_type
        text auth_config "JSON String"
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
        text headers "JSON String"
        string body_type
        text body_content
        string auth_type
        text auth_config "JSON String"
        datetime sent_at
        integer status_code
        integer response_time_ms
        integer response_size_bytes
        boolean is_error
    }
```

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
   *Note: On startup, the backend automatically seeds SQLite with default workspaces, sample collections, open requests, environment variables, and history items only if the workspaces table is empty.*

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
