import os
import re
import time
import json
import httpx
import traceback
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

import models
import schemas
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Postman Clone API Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Variable Resolution Helper ---
def resolve_variables(value: Any, env_vars: Dict[str, str]) -> Any:
    if isinstance(value, str):
        # Match {{variable_name}}
        def replace(match):
            key = match.group(1).strip()
            return env_vars.get(key, match.group(0))
        return re.sub(r"\{\{([^}]+)\}\}", replace, value)
    elif isinstance(value, dict):
        return {k: resolve_variables(v, env_vars) for k, v in value.items()}
    elif isinstance(value, list):
        return [resolve_variables(item, env_vars) for item in value]
    return value

# --- Database Seeding on Startup ---
@app.on_event("startup")
def seed_data():
    db = next(get_db())
    try:
        # Check if we already have workspaces
        if db.query(models.Workspace).count() == 0:
            print("Seeding database...")
            # 1. Create Default Workspaces
            ws1 = models.Workspace(
                name="Ayush Kumar Rai's Workspace",
                type="Internal",
                creator="You",
                contributors=1,
                last_activity="Just now",
                access="Everyone in your team",
                role="Admin"
            )
            ws2 = models.Workspace(
                name="AYUSH",
                type="Public",
                creator="You",
                contributors=1,
                last_activity="Just now",
                access="Anyone on the internet",
                role="Admin"
            )
            ws3 = models.Workspace(
                name="My Workspace",
                type="Internal",
                creator="You",
                contributors=1,
                last_activity="Just now",
                access="Only you and invited...",
                role="Admin"
            )
            db.add_all([ws1, ws2, ws3])
            db.commit()
            db.refresh(ws1)
            db.refresh(ws2)
            db.refresh(ws3)

            # 2. Create Collections under the main workspace (ws1)
            coll1 = models.Collection(workspace_id=ws1.id, name="JSONPlaceholder API")
            coll2 = models.Collection(workspace_id=ws1.id, name="HTTPBin Sandbox")
            db.add_all([coll1, coll2])
            db.commit()
            db.refresh(coll1)
            db.refresh(coll2)

            # 3. Add Saved Requests for JSONPlaceholder
            req1 = models.SavedRequest(
                collection_id=coll1.id,
                name="Get All Posts",
                method="GET",
                url="{{placeholder_url}}/posts",
                headers=json.dumps([{"key": "Accept", "value": "application/json", "enabled": True}]),
                body_type="none",
                body_content="",
                auth_type="none",
                auth_config=json.dumps({}),
            )
            req2 = models.SavedRequest(
                collection_id=coll1.id,
                name="Create A Post",
                method="POST",
                url="{{placeholder_url}}/posts",
                headers=json.dumps([{"key": "Content-Type", "value": "application/json", "enabled": True}]),
                body_type="raw",
                body_content=json.dumps({"title": "Postman Clone Test", "body": "It works!", "userId": 1}),
                auth_type="none",
                auth_config=json.dumps({}),
            )
            db.add_all([req1, req2])

            # 4. Add Saved Requests for HTTPBin
            req3 = models.SavedRequest(
                collection_id=coll2.id,
                name="Bearer Auth Test",
                method="GET",
                url="https://httpbin.org/bearer",
                headers=json.dumps([]),
                body_type="none",
                body_content="",
                auth_type="bearer",
                auth_config=json.dumps({"token": "my_secret_token_123"}),
            )
            db.add(req3)

            # 5. Create Environments under ws1
            env_dev = models.Environment(workspace_id=ws1.id, name="Development Environment")
            env_prod = models.Environment(workspace_id=ws1.id, name="Production Environment")
            db.add_all([env_dev, env_prod])
            db.commit()
            db.refresh(env_dev)
            db.refresh(env_prod)

            # 6. Create Env Variables
            var1 = models.EnvVariable(environment_id=env_dev.id, key="placeholder_url", value="https://jsonplaceholder.typicode.com")
            var2 = models.EnvVariable(environment_id=env_prod.id, key="placeholder_url", value="https://jsonplaceholder.typicode.com")
            db.add_all([var1, var2])
            db.commit()
            print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


# --- CRUD Endpoints ---

# Workspaces
@app.get("/api/workspaces", response_model=List[schemas.WorkspaceResponse])
def get_workspaces(db: Session = Depends(get_db)):
    return db.query(models.Workspace).order_by(models.Workspace.created_at.desc()).all()

@app.post("/api/workspaces", response_model=schemas.WorkspaceResponse)
def create_workspace(workspace: schemas.WorkspaceCreate, db: Session = Depends(get_db)):
    db_workspace = models.Workspace(
        name=workspace.name,
        type=workspace.type,
        creator=workspace.creator,
        contributors=workspace.contributors,
        last_activity=workspace.last_activity,
        access=workspace.access,
        role=workspace.role
    )
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

@app.put("/api/workspaces/{id}", response_model=schemas.WorkspaceResponse)
def update_workspace(id: int, workspace: schemas.WorkspaceCreate, db: Session = Depends(get_db)):
    db_workspace = db.query(models.Workspace).filter(models.Workspace.id == id).first()
    if not db_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    db_workspace.name = workspace.name
    db_workspace.type = workspace.type
    db_workspace.creator = workspace.creator
    db_workspace.contributors = workspace.contributors
    db_workspace.last_activity = workspace.last_activity
    db_workspace.access = workspace.access
    db_workspace.role = workspace.role
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

@app.delete("/api/workspaces/{id}")
def delete_workspace(id: int, db: Session = Depends(get_db)):
    db_workspace = db.query(models.Workspace).filter(models.Workspace.id == id).first()
    if not db_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    db.delete(db_workspace)
    db.commit()
    return {"message": "Workspace deleted successfully"}

# Collections
@app.get("/api/collections", response_model=List[schemas.CollectionResponse])
def get_collections(workspace_id: int, db: Session = Depends(get_db)):
    return db.query(models.Collection).filter(models.Collection.workspace_id == workspace_id).order_by(models.Collection.created_at.desc()).all()

@app.post("/api/collections", response_model=schemas.CollectionResponse)
def create_collection(collection: schemas.CollectionCreate, db: Session = Depends(get_db)):
    db_collection = models.Collection(workspace_id=collection.workspace_id, name=collection.name)
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@app.put("/api/collections/{id}", response_model=schemas.CollectionResponse)
def update_collection(id: int, collection: schemas.CollectionBase, db: Session = Depends(get_db)):
    db_collection = db.query(models.Collection).filter(models.Collection.id == id).first()
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    db_collection.name = collection.name
    db.commit()
    db.refresh(db_collection)
    return db_collection

@app.delete("/api/collections/{id}")
def delete_collection(id: int, db: Session = Depends(get_db)):
    db_collection = db.query(models.Collection).filter(models.Collection.id == id).first()
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    db.delete(db_collection)
    db.commit()
    return {"message": "Collection deleted successfully"}

# Saved Requests
@app.post("/api/collections/{id}/requests", response_model=schemas.SavedRequestResponse)
def create_saved_request(id: int, request: schemas.SavedRequestCreate, db: Session = Depends(get_db)):
    # Check if collection exists
    db_collection = db.query(models.Collection).filter(models.Collection.id == id).first()
    if not db_collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    db_request = models.SavedRequest(
        collection_id=id,
        name=request.name,
        method=request.method,
        url=request.url,
        headers=request.headers,
        body_type=request.body_type,
        body_content=request.body_content,
        auth_type=request.auth_type,
        auth_config=request.auth_config
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@app.put("/api/requests/{id}", response_model=schemas.SavedRequestResponse)
def update_saved_request(id: int, request: schemas.SavedRequestCreate, db: Session = Depends(get_db)):
    db_request = db.query(models.SavedRequest).filter(models.SavedRequest.id == id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Saved request not found")
    
    db_request.name = request.name
    db_request.method = request.method
    db_request.url = request.url
    db_request.headers = request.headers
    db_request.body_type = request.body_type
    db_request.body_content = request.body_content
    db_request.auth_type = request.auth_type
    db_request.auth_config = request.auth_config
    
    db.commit()
    db.refresh(db_request)
    return db_request

@app.delete("/api/requests/{id}")
def delete_saved_request(id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.SavedRequest).filter(models.SavedRequest.id == id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Saved request not found")
    db.delete(db_request)
    db.commit()
    return {"message": "Saved request deleted successfully"}

# Environments
@app.get("/api/environments", response_model=List[schemas.EnvironmentResponse])
def get_environments(workspace_id: int, db: Session = Depends(get_db)):
    return db.query(models.Environment).filter(models.Environment.workspace_id == workspace_id).order_by(models.Environment.created_at.desc()).all()

@app.post("/api/environments", response_model=schemas.EnvironmentResponse)
def create_environment(environment: schemas.EnvironmentCreate, db: Session = Depends(get_db)):
    db_env = models.Environment(workspace_id=environment.workspace_id, name=environment.name)
    db.add(db_env)
    db.commit()
    db.refresh(db_env)
    
    # Save variables
    for var in environment.variables:
        db_var = models.EnvVariable(environment_id=db_env.id, key=var.key, value=var.value)
        db.add(db_var)
    db.commit()
    db.refresh(db_env)
    return db_env

@app.put("/api/environments/{id}", response_model=schemas.EnvironmentResponse)
def update_environment(id: int, environment: schemas.EnvironmentCreate, db: Session = Depends(get_db)):
    db_env = db.query(models.Environment).filter(models.Environment.id == id).first()
    if not db_env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    db_env.name = environment.name
    db_env.workspace_id = environment.workspace_id
    
    # Delete old variables and replace
    db.query(models.EnvVariable).filter(models.EnvVariable.environment_id == id).delete()
    for var in environment.variables:
        db_var = models.EnvVariable(environment_id=id, key=var.key, value=var.value)
        db.add(db_var)
        
    db.commit()
    db.refresh(db_env)
    return db_env

@app.delete("/api/environments/{id}")
def delete_environment(id: int, db: Session = Depends(get_db)):
    db_env = db.query(models.Environment).filter(models.Environment.id == id).first()
    if not db_env:
        raise HTTPException(status_code=404, detail="Environment not found")
    db.delete(db_env)
    db.commit()
    return {"message": "Environment deleted successfully"}

# History
@app.get("/api/history", response_model=List[schemas.HistoryItemResponse])
def get_history(workspace_id: int, db: Session = Depends(get_db)):
    return db.query(models.HistoryItem).filter(models.HistoryItem.workspace_id == workspace_id).order_by(models.HistoryItem.sent_at.desc()).all()

@app.delete("/api/history")
def clear_history(workspace_id: int, db: Session = Depends(get_db)):
    db.query(models.HistoryItem).filter(models.HistoryItem.workspace_id == workspace_id).delete()
    db.commit()
    return {"message": "History cleared"}

@app.delete("/api/history/{id}")
def delete_history_item(id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.HistoryItem).filter(models.HistoryItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="History item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "History item deleted"}


# --- Request Proxy / Runner ---
@app.post("/api/proxy", response_model=schemas.ProxyResponse)
async def proxy_request(req: schemas.ProxyRequest, db: Session = Depends(get_db)):
    # 1. Load active environment variables if present
    env_vars = {}
    if req.environment_id:
        db_env = db.query(models.Environment).filter(models.Environment.id == req.environment_id).first()
        if db_env:
            for var in db_env.variables:
                env_vars[var.key] = var.value

    # 2. Resolve variables in URL, headers, and body content
    resolved_url = resolve_variables(req.url, env_vars)
    
    # Process headers key-value table
    headers_dict = {}
    client_headers_to_save = []
    if req.headers:
        for h in req.headers:
            if h.get("enabled", True) and h.get("key"):
                resolved_k = resolve_variables(h["key"], env_vars)
                resolved_v = resolve_variables(h.get("value", ""), env_vars)
                headers_dict[resolved_k] = resolved_v
                client_headers_to_save.append(h)

    # Process Authorization
    client_auth_config = {}
    if req.auth_type == "bearer" and req.auth_config:
        token = resolve_variables(req.auth_config.get("token", ""), env_vars)
        if token:
            headers_dict["Authorization"] = f"Bearer {token}"
            client_auth_config = {"token": req.auth_config.get("token")}
    elif req.auth_type == "basic" and req.auth_config:
        username = resolve_variables(req.auth_config.get("username", ""), env_vars)
        password = resolve_variables(req.auth_config.get("password", ""), env_vars)
        import base64
        encoded = base64.b64encode(f"{username}:{password}".encode("utf-8")).decode("utf-8")
        headers_dict["Authorization"] = f"Basic {encoded}"
        client_auth_config = {
            "username": req.auth_config.get("username"),
            "password": req.auth_config.get("password"),
        }

    # Process Body
    client_body_content = req.body_content
    outbound_content = None
    
    if req.body_type == "raw" and req.body_content:
        outbound_content = resolve_variables(req.body_content, env_vars)
    elif req.body_type == "x-www-form-urlencoded" and req.body_content:
        try:
            # Body content is expected to be a JSON string of a key-value array or dict
            parsed = json.loads(req.body_content)
            resolved_parsed = resolve_variables(parsed, env_vars)
            
            # Convert to dictionary for application/x-www-form-urlencoded
            data_dict = {}
            if isinstance(resolved_parsed, list):
                for item in resolved_parsed:
                    if item.get("enabled", True) and item.get("key"):
                        data_dict[item["key"]] = item.get("value", "")
            elif isinstance(resolved_parsed, dict):
                data_dict = resolved_parsed
            
            # Let httpx encode it
            headers_dict["Content-Type"] = "application/x-www-form-urlencoded"
            # We will use data_dict for post parameters
            outbound_content = data_dict
        except Exception:
            # Fallback
            outbound_content = resolve_variables(req.body_content, env_vars)
    elif req.body_type == "form-data" and req.body_content:
        try:
            parsed = json.loads(req.body_content)
            resolved_parsed = resolve_variables(parsed, env_vars)
            
            # Simple form data dictionary
            data_dict = {}
            if isinstance(resolved_parsed, list):
                for item in resolved_parsed:
                    if item.get("enabled", True) and item.get("key"):
                        data_dict[item["key"]] = item.get("value", "")
            elif isinstance(resolved_parsed, dict):
                data_dict = resolved_parsed
            
            # Handled by httpx multipart
            outbound_content = data_dict
        except Exception:
            outbound_content = resolve_variables(req.body_content, env_vars)

    # 3. Execute outbound request
    start_time = time.time()
    response_size = 0
    status_code = None
    status_text = ""
    res_headers = {}
    res_body = ""
    error_message = None
    is_error = False

    try:
        # Validate URL scheme
        if not (resolved_url.startswith("http://") or resolved_url.startswith("https://")):
            # default to http if missing
            resolved_url = "http://" + resolved_url

        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            request_params = {
                "method": req.method.upper(),
                "url": resolved_url,
                "headers": headers_dict,
            }
            
            # Apply request body
            if req.body_type == "x-www-form-urlencoded" and isinstance(outbound_content, dict):
                request_params["data"] = outbound_content
            elif req.body_type == "form-data" and isinstance(outbound_content, dict):
                # For simplicity, form-data behaves as multipart fields
                request_params["data"] = outbound_content
            elif outbound_content is not None:
                request_params["content"] = outbound_content

            # Send request
            response = await client.request(**request_params)
            
            status_code = response.status_code
            status_text = response.reason_phrase
            res_headers = dict(response.headers)
            
            # Calculate size
            response_size = len(response.content)
            
            # Try to read body
            try:
                res_body = response.text
            except Exception:
                # If binary
                res_body = f"[Binary data - size: {response_size} bytes, type: {res_headers.get('content-type', 'unknown')}]"

    except httpx.TimeoutException:
        status_code = None
        error_message = "Request timed out after 15 seconds."
        is_error = True
    except httpx.RequestError as exc:
        status_code = None
        error_message = f"An error occurred while requesting {exc.request.url!r}."
        is_error = True
    except Exception as exc:
        status_code = None
        error_message = f"Failed to send request: {str(exc)}"
        is_error = True
        traceback.print_exc()

    duration_ms = int((time.time() - start_time) * 1000)

    # 4. Persist request details in history
    try:
        history_item = models.HistoryItem(
            workspace_id=req.workspace_id,
            method=req.method.upper(),
            url=req.url, # save original with placeholders
            headers=json.dumps(client_headers_to_save),
            body_type=req.body_type,
            body_content=client_body_content,
            auth_type=req.auth_type,
            auth_config=json.dumps(client_auth_config),
            status_code=status_code,
            response_time_ms=duration_ms,
            response_size_bytes=response_size,
            is_error=is_error
        )
        db.add(history_item)
        db.commit()
    except Exception as db_err:
        print(f"Failed to save history: {db_err}")

    # Return proxy result
    return schemas.ProxyResponse(
        status_code=status_code,
        status_text=status_text,
        headers=res_headers,
        body=res_body if not is_error else error_message,
        size=response_size,
        time_ms=duration_ms,
        error=error_message
    )
