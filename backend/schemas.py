from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- EnvVariable Schemas ---
class EnvVariableBase(BaseModel):
    key: str
    value: str

class EnvVariableCreate(EnvVariableBase):
    pass

class EnvVariableResponse(EnvVariableBase):
    id: int
    environment_id: int

    class Config:
        from_attributes = True

# --- Environment Schemas ---
class EnvironmentBase(BaseModel):
    name: str

class EnvironmentCreate(EnvironmentBase):
    variables: List[EnvVariableCreate] = []

class EnvironmentResponse(EnvironmentBase):
    id: int
    created_at: datetime
    variables: List[EnvVariableResponse] = []

    class Config:
        from_attributes = True

# --- SavedRequest Schemas ---
class SavedRequestBase(BaseModel):
    name: str
    method: str
    url: str
    headers: Optional[str] = None  # JSON string
    body_type: Optional[str] = None  # none, raw, form-data, x-www-form-urlencoded
    body_content: Optional[str] = None  # JSON string or text
    auth_type: Optional[str] = None  # none, bearer, basic
    auth_config: Optional[str] = None  # JSON string

class SavedRequestCreate(SavedRequestBase):
    pass

class SavedRequestResponse(SavedRequestBase):
    id: int
    collection_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Collection Schemas ---
class CollectionBase(BaseModel):
    name: str

class CollectionCreate(CollectionBase):
    pass

class CollectionResponse(CollectionBase):
    id: int
    created_at: datetime
    requests: List[SavedRequestResponse] = []

    class Config:
        from_attributes = True

# --- HistoryItem Schemas ---
class HistoryItemBase(BaseModel):
    method: str
    url: str
    headers: Optional[str] = None
    body_type: Optional[str] = None
    body_content: Optional[str] = None
    auth_type: Optional[str] = None
    auth_config: Optional[str] = None

class HistoryItemCreate(HistoryItemBase):
    status_code: Optional[int] = None
    response_time_ms: Optional[int] = None
    response_size_bytes: Optional[int] = None
    is_error: Optional[bool] = False

class HistoryItemResponse(HistoryItemBase):
    id: int
    sent_at: datetime
    status_code: Optional[int] = None
    response_time_ms: Optional[int] = None
    response_size_bytes: Optional[int] = None
    is_error: bool

    class Config:
        from_attributes = True

# --- Proxy request / response ---
class ProxyRequest(BaseModel):
    method: str
    url: str
    headers: Optional[List[Dict[str, Any]]] = None  # key-value array from client table
    body_type: Optional[str] = "none"  # none, raw, form-data, x-www-form-urlencoded
    body_content: Optional[str] = None  # JSON string or key-value list JSON
    auth_type: Optional[str] = "none"  # none, bearer, basic
    auth_config: Optional[Dict[str, Any]] = None  # username/password/token
    environment_id: Optional[int] = None

class ProxyResponse(BaseModel):
    status_code: Optional[int] = None
    status_text: Optional[str] = None
    headers: Optional[Dict[str, str]] = None
    body: Optional[str] = None
    size: int = 0
    time_ms: int = 0
    error: Optional[str] = None
