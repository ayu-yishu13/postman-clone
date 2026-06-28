import { ProxyResponseData } from "../utils/requests";

export interface Tab {
  id: string; // temp unique tab id
  savedId: number | null; // DB ID if saved request
  collectionId: number | null; // collection ID if saved
  name: string;
  method: string;
  url: string;
  headers: Array<{ key: string; value: string; enabled: boolean; description: string }>;
  params: Array<{ key: string; value: string; enabled: boolean; description: string }>;
  body_type: string; // none, raw, form-data, x-www-form-urlencoded
  body_content: string;
  auth_type: string; // none, bearer, basic
  auth_config: Record<string, any>;
  response: ProxyResponseData | null;
  loading: boolean;
  isDirty: boolean;
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export interface WorkspaceItem {
  name: string;
  type: "Public" | "Internal";
  creator: string;
  contributors: number;
  lastActivity: string;
  access: string;
  role: string;
}

export interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
  actions?: string[];
}
