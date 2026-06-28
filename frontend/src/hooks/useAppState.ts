"use client";

import { useState, useRef } from "react";
import { Tab, Toast, WorkspaceItem, ChatMessage } from "../app/types";
import { Collection, Environment, HistoryItem } from "../utils/requests";

export function useAppState() {
  // --- Auth States ---
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("ayushrai.ju13@gmail.com");
  const [loginPassword, setLoginPassword] = useState("password123");

  // --- View States ---
  const [currentView, setCurrentView] = useState<"home" | "workspaces" | "workspace">("home");
  const [activeWorkspace, setActiveWorkspace] = useState("Ayush Kumar Rai's Workspace");
  
  // --- Data States ---
  const [collections, setCollections] = useState<Collection[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // --- UI Layout States ---
  const [sidebarTab, setSidebarTab] = useState<"collections" | "environments" | "history" | "mocks" | "monitors">("collections");
  const [homeSidebarTab, setHomeSidebarTab] = useState<"home" | "workspaces" | "apps" | "catalog" | "private" | "public" | "integrations" | "reports">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnvId, setSelectedEnvId] = useState<number | null>(null);
  const [builderSubTab, setBuilderSubTab] = useState<"params" | "auth" | "headers" | "body" | "snippet">("params");
  const [responseSubTab, setResponseSubTab] = useState<"body" | "headers">("body");
  const [snippetLanguage, setSnippetLanguage] = useState<"curl" | "fetch" | "python">("curl");
  
  // --- Dropdowns & Toggles ---
  const [showEnvQuickLook, setShowEnvQuickLook] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<"none" | "type" | "org">("none");
  const [showHomeDropdown, setShowHomeDropdown] = useState(false);
  const [sidebarMainTab, setSidebarMainTab] = useState<"elements" | "environments" | "history">("elements");
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [environmentsExpanded, setEnvironmentsExpanded] = useState(true);
  const [specsExpanded, setSpecsExpanded] = useState(true);
  const [flowsExpanded, setFlowsExpanded] = useState(true);
  const [workspacesSubTab, setWorkspacesSubTab] = useState<"all" | "project" | "external">("all");
  const [selectedWorkspaceNames, setSelectedWorkspaceNames] = useState<string[]>([]);
  const [showWorkspaceFilterDropdown, setShowWorkspaceFilterDropdown] = useState(false);
  const [workspaceFilters, setWorkspaceFilters] = useState({
    type: { internal: false, public: false, partner: false },
    access: { inviteOnly: false, team: false, partnerOnly: false, internet: false }
  });

  // --- Resizing States ---
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [responseHeight, setResponseHeight] = useState(260);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingResponse, setIsResizingResponse] = useState(false);

  // --- Inline Editing (Renaming) States ---
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [renameInputVal, setRenameInputVal] = useState("");

  // --- Tabs States ---
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  // --- Search Filter Values ---
  const [searchFilters, setSearchFilters] = useState({
    type: "All",
    org: "Ayush Kumar Rai's Team"
  });
  const [workspaceSearchQuery, setWorkspaceSearchQuery] = useState("");

  // --- AI Chat States ---
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatInput, setAiChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // --- Home Card Input ---
  const [homeChatbarInput, setHomeChatbarInput] = useState("");

  // --- Modals ---
  const [modals, setModals] = useState<{
    createCollection: boolean;
    saveRequest: boolean;
    editEnvironment: boolean;
  }>({
    createCollection: false,
    saveRequest: false,
    editEnvironment: false,
  });

  const [modalInputs, setModalInputs] = useState<{
    collectionName: string;
    requestName: string;
    targetCollectionId: string;
    envName: string;
    envVariables: Array<{ key: string; value: string }>;
    editingEnvId: number | null;
  }>({
    collectionName: "",
    requestName: "",
    targetCollectionId: "",
    envName: "",
    envVariables: [{ key: "", value: "" }],
    editingEnvId: null,
  });

  // --- Toasts state ---
  const [toasts, setToasts] = useState<Toast[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([
    {
      name: "AYUSH",
      type: "Public",
      creator: "You",
      contributors: 1,
      lastActivity: "22 days ago",
      access: "Anyone on the internet",
      role: "Admin"
    },
    {
      name: "Ayush Kumar Rai's Workspace",
      type: "Internal",
      creator: "You",
      contributors: 1,
      lastActivity: "23 days ago",
      access: "Everyone in your team",
      role: "Admin"
    },
    {
      name: "My Workspace",
      type: "Internal",
      creator: "You",
      contributors: 1,
      lastActivity: "-",
      access: "Only you and invited...",
      role: "Admin"
    }
  ]);

  return {
    // Auth
    isSignedIn, setIsSignedIn,
    loginEmail, setLoginEmail,
    loginPassword, setLoginPassword,
    // Views
    currentView, setCurrentView,
    activeWorkspace, setActiveWorkspace,
    // Data
    collections, setCollections,
    environments, setEnvironments,
    history, setHistory,
    // UI Layout
    sidebarTab, setSidebarTab,
    homeSidebarTab, setHomeSidebarTab,
    searchQuery, setSearchQuery,
    selectedEnvId, setSelectedEnvId,
    builderSubTab, setBuilderSubTab,
    responseSubTab, setResponseSubTab,
    snippetLanguage, setSnippetLanguage,
    // Dropdowns
    showEnvQuickLook, setShowEnvQuickLook,
    showProfileDropdown, setShowProfileDropdown,
    showWorkspaceDropdown, setShowWorkspaceDropdown,
    showSearchDropdown, setShowSearchDropdown,
    activeFilterDropdown, setActiveFilterDropdown,
    showHomeDropdown, setShowHomeDropdown,
    sidebarMainTab, setSidebarMainTab,
    collectionsExpanded, setCollectionsExpanded,
    environmentsExpanded, setEnvironmentsExpanded,
    specsExpanded, setSpecsExpanded,
    flowsExpanded, setFlowsExpanded,
    workspacesSubTab, setWorkspacesSubTab,
    selectedWorkspaceNames, setSelectedWorkspaceNames,
    showWorkspaceFilterDropdown, setShowWorkspaceFilterDropdown,
    workspaceFilters, setWorkspaceFilters,
    // Resizing
    sidebarWidth, setSidebarWidth,
    responseHeight, setResponseHeight,
    isResizingSidebar, setIsResizingSidebar,
    isResizingResponse, setIsResizingResponse,
    // Inline editing
    editingCollectionId, setEditingCollectionId,
    editingRequestId, setEditingRequestId,
    renameInputVal, setRenameInputVal,
    // Tabs
    tabs, setTabs,
    activeTabId, setActiveTabId,
    // Search filters
    searchFilters, setSearchFilters,
    workspaceSearchQuery, setWorkspaceSearchQuery,
    // AI Chat
    showAIChat, setShowAIChat,
    aiChatInput, setAiChatInput,
    chatMessages, setChatMessages,
    // Home
    homeChatbarInput, setHomeChatbarInput,
    // Modals
    modals, setModals,
    modalInputs, setModalInputs,
    // Toasts
    toasts, setToasts,
    // Refs
    searchInputRef,
    // Workspaces
    workspaces, setWorkspaces,
  };
}

export type AppState = ReturnType<typeof useAppState>;
