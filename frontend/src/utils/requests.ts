const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface Workspace {
  id: number;
  name: string;
  type: "Public" | "Internal";
  creator: string;
  contributors: number;
  last_activity: string;
  access: string;
  role: string;
  created_at: string;
}

export interface EnvVariable {
  id?: number;
  key: string;
  value: string;
}

export interface Environment {
  id: number;
  workspace_id: number;
  name: string;
  variables: EnvVariable[];
}

export interface SavedRequest {
  id: number;
  collection_id: number;
  name: string;
  method: string;
  url: string;
  headers?: string; // JSON string
  body_type?: string;
  body_content?: string;
  auth_type?: string;
  auth_config?: string; // JSON string
  created_at?: string;
}

export interface Collection {
  id: number;
  workspace_id: number;
  name: string;
  created_at: string;
  requests: SavedRequest[];
}

export interface HistoryItem {
  id: number;
  workspace_id: number;
  method: string;
  url: string;
  headers?: string;
  body_type?: string;
  body_content?: string;
  auth_type?: string;
  auth_config?: string;
  sent_at: string;
  status_code?: number;
  response_time_ms?: number;
  response_size_bytes?: number;
  is_error: boolean;
}

export interface ProxyRequestParams {
  workspace_id: number;
  method: string;
  url: string;
  headers?: Array<{ key: string; value: string; enabled: boolean }>;
  body_type?: string;
  body_content?: string;
  auth_type?: string;
  auth_config?: Record<string, any>;
  environment_id?: number | null;
}

export interface ProxyResponseData {
  status_code?: number | null;
  status_text?: string | null;
  headers?: Record<string, string> | null;
  body?: string | null;
  size: number;
  time_ms: number;
  error?: string | null;
}

// Workspaces API
export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await fetch(`${API_BASE_URL}/api/workspaces`);
  if (!res.ok) throw new Error("Failed to fetch workspaces");
  return res.json();
}

export async function createWorkspace(workspace: Omit<Workspace, "id" | "created_at">): Promise<Workspace> {
  const res = await fetch(`${API_BASE_URL}/api/workspaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workspace),
  });
  if (!res.ok) throw new Error("Failed to create workspace");
  return res.json();
}

export async function updateWorkspace(id: number, workspace: Omit<Workspace, "id" | "created_at">): Promise<Workspace> {
  const res = await fetch(`${API_BASE_URL}/api/workspaces/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workspace),
  });
  if (!res.ok) throw new Error("Failed to update workspace");
  return res.json();
}

export async function deleteWorkspace(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/workspaces/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete workspace");
}

// Collections API
export async function getCollections(workspaceId: number): Promise<Collection[]> {
  const res = await fetch(`${API_BASE_URL}/api/collections?workspace_id=${workspaceId}`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function createCollection(workspaceId: number, name: string): Promise<Collection> {
  const res = await fetch(`${API_BASE_URL}/api/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, workspace_id: workspaceId }),
  });
  if (!res.ok) throw new Error("Failed to create collection");
  return res.json();
}

export async function updateCollection(id: number, name: string): Promise<Collection> {
  const res = await fetch(`${API_BASE_URL}/api/collections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update collection");
  return res.json();
}

export async function deleteCollection(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/collections/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete collection");
}

// Saved Requests API
export async function createSavedRequest(
  collectionId: number,
  req: Omit<SavedRequest, "id" | "collection_id">
): Promise<SavedRequest> {
  const res = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Failed to save request to collection");
  return res.json();
}

export async function updateSavedRequest(
  id: number,
  req: Omit<SavedRequest, "id" | "collection_id">
): Promise<SavedRequest> {
  const res = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Failed to update saved request");
  return res.json();
}

export async function deleteSavedRequest(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete saved request");
}

// Environments API
export async function getEnvironments(workspaceId: number): Promise<Environment[]> {
  const res = await fetch(`${API_BASE_URL}/api/environments?workspace_id=${workspaceId}`);
  if (!res.ok) throw new Error("Failed to fetch environments");
  return res.json();
}

export async function createEnvironment(
  workspaceId: number,
  name: string,
  variables: Omit<EnvVariable, "id">[]
): Promise<Environment> {
  const res = await fetch(`${API_BASE_URL}/api/environments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, workspace_id: workspaceId, variables }),
  });
  if (!res.ok) throw new Error("Failed to create environment");
  return res.json();
}

export async function updateEnvironment(
  id: number,
  workspaceId: number,
  name: string,
  variables: Omit<EnvVariable, "id">[]
): Promise<Environment> {
  const res = await fetch(`${API_BASE_URL}/api/environments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, workspace_id: workspaceId, variables }),
  });
  if (!res.ok) throw new Error("Failed to update environment");
  return res.json();
}

export async function deleteEnvironment(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/environments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete environment");
}

// History API
export async function getHistory(workspaceId: number): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/history?workspace_id=${workspaceId}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function deleteHistoryItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete history item");
}

export async function clearHistory(workspaceId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/history?workspace_id=${workspaceId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to clear history");
}

// Proxy Request Executer
export async function sendProxyRequest(params: ProxyRequestParams): Promise<ProxyResponseData> {
  const res = await fetch(`${API_BASE_URL}/api/proxy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to send request via proxy");
  }
  return res.json();
}
