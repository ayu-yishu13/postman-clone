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
  tabType?: "request" | "collection";
  collectionTabActiveTab?: "overview" | "runs";
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export interface WorkspaceItem {
  id: number;
  name: string;
  type: "Public" | "Internal";
  creator: string;
  contributors: number;
  last_activity: string;
  access: string;
  role: string;
  created_at?: string;
}

export interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
  actions?: string[];
}
