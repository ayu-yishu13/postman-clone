const API_BASE_URL = "http://127.0.0.1:8000";

export interface EnvVariable {
  id?: number;
  key: string;
  value: string;
}

export interface Environment {
  id: number;
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
  name: string;
  created_at: string;
  requests: SavedRequest[];
}

export interface HistoryItem {
  id: number;
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

// Collections API
export async function getCollections(): Promise<Collection[]> {
  const res = await fetch(`${API_BASE_URL}/api/collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function createCollection(name: string): Promise<Collection> {
  const res = await fetch(`${API_BASE_URL}/api/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
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
export async function getEnvironments(): Promise<Environment[]> {
  const res = await fetch(`${API_BASE_URL}/api/environments`);
  if (!res.ok) throw new Error("Failed to fetch environments");
  return res.json();
}

export async function createEnvironment(
  name: string,
  variables: Omit<EnvVariable, "id">[]
): Promise<Environment> {
  const res = await fetch(`${API_BASE_URL}/api/environments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, variables }),
  });
  if (!res.ok) throw new Error("Failed to create environment");
  return res.json();
}

export async function updateEnvironment(
  id: number,
  name: string,
  variables: Omit<EnvVariable, "id">[]
): Promise<Environment> {
  const res = await fetch(`${API_BASE_URL}/api/environments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, variables }),
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
export async function getHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/history`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function deleteHistoryItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete history item");
}

export async function clearHistory(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/history`, {
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
