import React from "react";
import { Tab, Toast, WorkspaceItem, ChatMessage } from "../app/types";
import { Collection, Environment, HistoryItem, SavedRequest } from "../utils/requests";

interface WorkspaceBuilderViewProps {
  sidebarWidth: number;
  sidebarMainTab: "elements" | "environments" | "history";
  setSidebarMainTab: (t: "elements" | "environments" | "history") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setModals: React.Dispatch<React.SetStateAction<{
    createCollection: boolean;
    saveRequest: boolean;
    editEnvironment: boolean;
  }>>;
  collectionsExpanded: boolean;
  setCollectionsExpanded: (b: boolean) => void;
  filteredCollections: Collection[];
  editingCollectionId: number | null;
  setEditingCollectionId: (id: number | null) => void;
  renameInputVal: string;
  setRenameInputVal: (v: string) => void;
  handleRenameCollection: (id: number) => void;
  handleDeleteCollection: (id: number, e: React.MouseEvent) => void;
  filteredHistory: HistoryItem[];
  clearHistory: () => Promise<void>;
  loadAllData: () => void;
  loadHistoryItem: (item: HistoryItem) => void;
  loadSavedRequest: (req: SavedRequest) => void;
  editingRequestId: number | null;
  setEditingRequestId: (id: number | null) => void;
  handleRenameRequest: (req: SavedRequest) => void;
  deleteSavedRequest: (id: number) => Promise<void>;
  environmentsExpanded: boolean;
  setEnvironmentsExpanded: (b: boolean) => void;
  filteredEnvironments: Environment[];
  handleOpenEditEnv: (env: Environment | null) => void;
  handleDeleteEnvironment: (id: number, e: React.MouseEvent) => void;
  specsExpanded: boolean;
  setSpecsExpanded: (b: boolean) => void;
  flowsExpanded: boolean;
  setFlowsExpanded: (b: boolean) => void;
  handleSidebarResizeStart: (e: React.MouseEvent) => void;
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  createNewTab: (initial?: Partial<Tab>) => void;
  closeTab: (tabIdToClose: string, e: React.MouseEvent) => void;
  activeWorkspace: string;
  activeWorkspaceId: number;
  selectedEnvId: number | null;
  setSelectedEnvId: (id: number | null) => void;
  environments: Environment[];
  showEnvQuickLook: boolean;
  setShowEnvQuickLook: (b: boolean) => void;
  showAIChat: boolean;
  setShowAIChat: (b: boolean) => void;
  updateActiveTab: (updates: Partial<Tab>) => void;
  handleUrlChange: (newUrl: string) => void;
  handleSend: () => void;
  handleSaveClick: () => void;
  builderSubTab: "params" | "auth" | "headers" | "body" | "snippet";
  setBuilderSubTab: (t: "params" | "auth" | "headers" | "body" | "snippet") => void;
  toggleParam: (idx: number) => void;
  handleParamChange: (index: number, field: "key" | "value" | "description", val: string) => void;
  removeParamRow: (idx: number) => void;
  toggleHeader: (idx: number) => void;
  handleHeaderChange: (index: number, field: "key" | "value" | "description", val: string) => void;
  removeHeaderRow: (idx: number) => void;
  snippetLanguage: "curl" | "fetch" | "python";
  setSnippetLanguage: (l: "curl" | "fetch" | "python") => void;
  generateSnippet: () => string;
  handleResponseResizeStart: (e: React.MouseEvent) => void;
  responseHeight: number;
  responseSubTab: "body" | "headers";
  setResponseSubTab: (t: "body" | "headers") => void;
  chatMessages: ChatMessage[];
  handleWorkspaceChatSubmit: (e: React.FormEvent) => void;
  aiChatInput: string;
  setAiChatInput: (v: string) => void;
  handleChatActionClick: (act: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const WorkspaceBuilderView: React.FC<WorkspaceBuilderViewProps> = ({
  sidebarWidth,
  sidebarMainTab,
  setSidebarMainTab,
  searchQuery,
  setSearchQuery,
  setModals,
  collectionsExpanded,
  setCollectionsExpanded,
  filteredCollections,
  editingCollectionId,
  setEditingCollectionId,
  renameInputVal,
  setRenameInputVal,
  handleRenameCollection,
  handleDeleteCollection,
  filteredHistory,
  clearHistory,
  loadAllData,
  loadHistoryItem,
  loadSavedRequest,
  editingRequestId,
  setEditingRequestId,
  handleRenameRequest,
  deleteSavedRequest,
  environmentsExpanded,
  setEnvironmentsExpanded,
  filteredEnvironments,
  handleOpenEditEnv,
  handleDeleteEnvironment,
  specsExpanded,
  setSpecsExpanded,
  flowsExpanded,
  setFlowsExpanded,
  handleSidebarResizeStart,
  tabs,
  setTabs,
  activeTabId,
  setActiveTabId,
  createNewTab,
  closeTab,
  activeWorkspace,
  activeWorkspaceId,
  selectedEnvId,
  setSelectedEnvId,
  environments,
  showEnvQuickLook,
  setShowEnvQuickLook,
  showAIChat,
  setShowAIChat,
  updateActiveTab,
  handleUrlChange,
  handleSend,
  handleSaveClick,
  builderSubTab,
  setBuilderSubTab,
  toggleParam,
  handleParamChange,
  removeParamRow,
  toggleHeader,
  handleHeaderChange,
  removeHeaderRow,
  snippetLanguage,
  setSnippetLanguage,
  generateSnippet,
  handleResponseResizeStart,
  responseHeight,
  responseSubTab,
  setResponseSubTab,
  chatMessages,
  handleWorkspaceChatSubmit,
  aiChatInput,
  setAiChatInput,
  handleChatActionClick,
  searchInputRef,
  addToast,
}) => {
  const activeTab = tabs.find((t) => t.id === activeTabId) || null;
  
  const [chatDropdown, setChatDropdown] = React.useState<"none" | "context" | "skills">("none");
  const [searchFilter, setSearchFilter] = React.useState("");

  const getContextItems = () => {
    const items: Array<{ category: string; name: string; value: string }> = [];

    // Code Snippets
    items.push({ category: "Snippet", name: "cURL Code Snippet", value: "cURL Snippet" });
    items.push({ category: "Snippet", name: "Fetch Code Snippet", value: "Fetch Snippet" });
    items.push({ category: "Snippet", name: "Python Code Snippet", value: "Python Snippet" });

    // Collections
    filteredCollections.forEach(c => {
      items.push({ category: "Collection", name: c.name, value: `Collection: ${c.name}` });
      if (c.requests) {
        c.requests.forEach(r => {
          items.push({ category: "Request", name: `${r.method} ${r.name}`, value: `Request: ${r.name} (${r.method})` });
        });
      }
    });

    // Environments
    environments.forEach(e => {
      items.push({ category: "Environment", name: e.name, value: `Environment: ${e.name}` });
    });

    return items.filter(item => 
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
      item.category.toLowerCase().includes(searchFilter.toLowerCase())
    );
  };

  const getSkillsItems = () => {
    const skillsList = [
      { name: "/create-request", desc: "Generate a request builder tab", value: "/create-request" },
      { name: "/debug-call", desc: "Troubleshoot a failing request", value: "/debug-call" },
      { name: "/generate-tests", desc: "Write Javascript tests for active tab", value: "/generate-tests" },
      { name: "/explain-code", desc: "Explain the active request parameters/response", value: "/explain-code" },
    ];
    return skillsList.filter(s => s.name.toLowerCase().includes(searchFilter.toLowerCase()));
  };

  const [showSidebarPlusDropdown, setShowSidebarPlusDropdown] = React.useState(false);
  const [showSpecSubmenu, setShowSpecSubmenu] = React.useState(false);
  const [plusSearchQuery, setPlusSearchQuery] = React.useState("");

  const plusItems = [
    { name: "Ask AI", icon: "✨", shortcut: "Ctrl+Alt+P", action: () => { setShowAIChat(true); setShowSidebarPlusDropdown(false); } },
    { type: "divider" },
    { name: "HTTP", icon: "🌐", action: () => { createNewTab(); setShowSidebarPlusDropdown(false); } },
    { name: "GraphQL", icon: "⚛️", action: () => { createNewTab({ method: "POST", url: "/graphql" }); setShowSidebarPlusDropdown(false); } },
    { name: "AI", icon: "🤖", action: () => { setShowAIChat(true); setShowSidebarPlusDropdown(false); } },
    { name: "MCP", icon: "🔌", action: () => { addToast("MCP Protocol integration is a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
    { name: "gRPC", icon: "📦", action: () => { addToast("gRPC Request creator is a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
    { name: "WebSocket", icon: "⚡", action: () => { addToast("WebSocket connections are a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
    { name: "Socket.IO", icon: "🔌", action: () => { addToast("Socket.IO client is a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
    { name: "MQTT", icon: "📡", action: () => { addToast("MQTT client is a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
    { type: "divider" },
    { 
      name: "Collection", 
      icon: "📁", 
      action: async () => {
        try {
          const { createCollection: createAPI } = await import("../utils/requests");
          const created = await createAPI(activeWorkspaceId, "New Collection");
          addToast("Collection created", "success");
          loadAllData();
          createNewTab({
            savedId: null,
            collectionId: created.id,
            name: "New Collection",
            method: "COLL",
            tabType: "collection",
            collectionTabActiveTab: "overview"
          });
        } catch (err: any) {
          addToast("Failed to create collection: " + err.message, "error");
        }
        setShowSidebarPlusDropdown(false);
      }
    },
    { name: "Environment", icon: "⚙️", action: () => { handleOpenEditEnv(null); setShowSidebarPlusDropdown(false); } },
    { 
      name: "Spec", 
      icon: "📄", 
      hasSubmenu: true,
      action: () => {
        setShowSpecSubmenu(!showSpecSubmenu);
      }
    },
    { name: "Mock", icon: "🎭", action: () => { addToast("Mock servers panel is a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
    { name: "Monitor", icon: "📊", action: () => { addToast("API Monitors panel is a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
    { name: "Webhook", icon: "⚓", action: () => { addToast("Webhooks listener is a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
    { name: "Flow", icon: "🔀", action: () => { addToast("API Flows workspace is a placeholder", "info"); setShowSidebarPlusDropdown(false); } },
  ];

  const specSubmenuItems = [
    { name: "OpenAPI 3.1" },
    { name: "OpenAPI 3.0" },
    { name: "OpenAPI 2.0" },
    { type: "divider" },
    { name: "AsyncAPI 3.0" },
    { name: "AsyncAPI 2.0" },
    { type: "divider" },
    { name: "GraphQL" },
    { type: "divider" },
    { name: "Protobuf 3" },
    { name: "Protobuf 2" },
    { type: "divider" },
    { name: "Smithy" },
  ];

  const handleSpecItemClick = (name: string) => {
    addToast(`Creating spec: ${name}`, "info");
    setShowSidebarPlusDropdown(false);
    setShowSpecSubmenu(false);
  };

  return (
    <div className="workspace-chat-container">
      {/* Left Narrow Icon Sidebar matching Postman */}
      <div className="vertical-icon-sidebar">
        <button 
          className={`sidebar-icon-btn ${sidebarMainTab === "elements" ? "active" : ""}`}
          onClick={() => setSidebarMainTab("elements")}
          title="Collections"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </button>
        <button 
          className={`sidebar-icon-btn ${sidebarMainTab === "environments" ? "active" : ""}`}
          onClick={() => setSidebarMainTab("environments")}
          title="Environments"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
        <button 
          className={`sidebar-icon-btn ${sidebarMainTab === "history" ? "active" : ""}`}
          onClick={() => setSidebarMainTab("history")}
          title="History"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </button>
      </div>

      {/* Secondary Sidebar Content Panel */}
      <aside className="sidebar" style={{ width: sidebarWidth }}>

        {/* Sidebar Header with filtering */}
        <div className="sidebar-header" style={{ paddingBottom: "4px" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="Filter items"
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "24px" }}
              />
              <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", opacity: 0.5, pointerEvents: "none" }}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
            </div>
            {sidebarMainTab === "elements" && (
              <div style={{ position: "relative" }}>
                <button
                  className="action-btn-icon"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSidebarPlusDropdown(!showSidebarPlusDropdown);
                    setShowSpecSubmenu(false);
                    setPlusSearchQuery("");
                  }}
                  title="Create New..."
                >
                  +
                </button>
                <button
                  className="action-btn-icon"
                  style={{ fontSize: "14px", fontWeight: "bold", marginLeft: "4px" }}
                  title="Options"
                >
                  ...
                </button>

                {showSidebarPlusDropdown && (
                  <>
                    <div 
                      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                      onClick={() => { setShowSidebarPlusDropdown(false); setShowSpecSubmenu(false); }}
                    />
                    <div className="sidebar-plus-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="plus-search-container">
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="plus-search-input"
                          value={plusSearchQuery}
                          onChange={(e) => setPlusSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                      
                      <div className="plus-dropdown-items">
                        {plusItems
                          .filter(item => {
                            if (item.type === "divider") return true;
                            return item.name?.toLowerCase().includes(plusSearchQuery.toLowerCase());
                          })
                          .map((item, idx) => {
                            if (item.type === "divider") {
                              return <div key={idx} className="plus-dropdown-divider" />;
                            }
                            return (
                              <div 
                                key={idx} 
                                className="plus-dropdown-item" 
                                onClick={item.action}
                                style={{ display: "flex", justifyContent: "space-between" }}
                              >
                                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span className="plus-dropdown-item-icon">{item.icon}</span>
                                  <span>{item.name}</span>
                                </span>
                                {item.shortcut && (
                                  <span className="plus-dropdown-item-shortcut">{item.shortcut}</span>
                                )}
                                {item.hasSubmenu && (
                                  <span style={{ fontSize: "9px", opacity: 0.5 }}>▶</span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {showSpecSubmenu && (
                      <div className="plus-spec-submenu" onClick={(e) => e.stopPropagation()}>
                        {specSubmenuItems.map((item, idx) => {
                          if (item.type === "divider") {
                            return <div key={idx} className="plus-dropdown-divider" />;
                          }
                          return (
                            <div 
                              key={idx} 
                              className="plus-dropdown-item" 
                              onClick={() => handleSpecItemClick(item.name!)}
                            >
                              <span>{item.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-content" style={{ padding: 0 }}>
          {/* 1. ELEMENTS TAB (COLLECTIONS LIST VIEW) */}
          {sidebarMainTab === "elements" && (
            <div style={{ display: "flex", flexDirection: "column", padding: "8px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", padding: "0 4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Collections</span>
              </div>
              
              <div className="sidebar-collections-list">
                {filteredCollections.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", padding: "8px 4px" }}>
                    No collections found
                  </div>
                ) : (
                  filteredCollections.map((coll) => (
                    <div key={coll.id} style={{ marginBottom: "4px" }}>
                      <div className="list-item-btn">
                        <span className="list-item-title" style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "12px", opacity: 0.8 }}>📁</span>
                          {editingCollectionId === coll.id ? (
                            <input
                              type="text"
                              className="inline-rename-input"
                              value={renameInputVal}
                              onChange={(e) => setRenameInputVal(e.target.value)}
                              onBlur={() => handleRenameCollection(coll.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleRenameCollection(coll.id);
                                if (e.key === "Escape") setEditingCollectionId(null);
                              }}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span 
                              style={{ width: "100%", fontWeight: 500 }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingCollectionId(coll.id);
                                setRenameInputVal(coll.name);
                              }}
                            >
                              {coll.name}
                            </span>
                          )}
                        </span>
                        
                        {editingCollectionId !== coll.id && (
                          <div className="list-item-actions">
                            <button
                              className="action-btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCollectionId(coll.id);
                                setRenameInputVal(coll.name);
                              }}
                              title="Rename"
                            >
                              Rename
                            </button>
                            <button
                              className="action-btn-icon"
                              onClick={(e) => handleDeleteCollection(coll.id, e)}
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="nested-list">
                        {coll.requests.map((req) => (
                          <div
                            key={req.id}
                            className="list-item-btn"
                            style={{ padding: "4px 8px" }}
                            onClick={() => loadSavedRequest(req)}
                          >
                            <span style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%" }}>
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: "bold",
                                  color: `var(--method-${req.method.toLowerCase()}, var(--method-other))`,
                                  minWidth: "28px"
                                }}
                              >
                                {req.method}
                              </span>
                              
                              {editingRequestId === req.id ? (
                                <input
                                  type="text"
                                  className="inline-rename-input"
                                  value={renameInputVal}
                                  onChange={(e) => setRenameInputVal(e.target.value)}
                                  onBlur={() => handleRenameRequest(req)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRenameRequest(req);
                                    if (e.key === "Escape") setEditingRequestId(null);
                                  }}
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <span
                                  style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    setEditingRequestId(req.id);
                                    setRenameInputVal(req.name);
                                  }}
                                >
                                  {req.name}
                                </span>
                              )}
                            </span>
                            
                            {editingRequestId !== req.id && (
                              <div className="list-item-actions">
                                <button
                                  className="action-btn-icon"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirm("Delete request?")) {
                                      await deleteSavedRequest(req.id);
                                      addToast("Request deleted", "success");
                                      loadAllData();
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. ENVIRONMENTS LIST VIEW */}
          {sidebarMainTab === "environments" && (
            <div style={{ padding: "8px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>ENVIRONMENTS</span>
                <button className="sidebar-create-btn" onClick={() => handleOpenEditEnv(null)}>+ Create</button>
              </div>
              {filteredEnvironments.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "11px", padding: "12px 0" }}>
                  No environments found
                </div>
              ) : (
                filteredEnvironments.map((env) => (
                  <div
                    key={env.id}
                    className="list-item-btn"
                    style={{ padding: "8px 12px" }}
                    onClick={() => handleOpenEditEnv(env)}
                  >
                    <span className="list-item-title">Env {env.name}</span>
                    <div className="list-item-actions">
                      <button
                        className="action-btn-icon"
                        onClick={(e) => handleDeleteEnvironment(env.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. HISTORY VIEW */}
          {sidebarMainTab === "history" && (
            <div style={{ padding: "8px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>HISTORY</span>
                <button
                  className="btn-secondary"
                  style={{ padding: "2px 6px", fontSize: "11px" }}
                  onClick={async () => {
                    if (confirm("Clear history?")) {
                      await clearHistory();
                      addToast("History cleared", "success");
                      loadAllData();
                    }
                  }}
                >
                  Clear All
                </button>
              </div>

              {filteredHistory.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "11px", padding: "12px 0" }}>
                  History is empty
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="list-item-btn"
                    style={{ padding: "8px", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}
                    onClick={() => loadHistoryItem(item)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          color: `var(--method-${item.method.toLowerCase()}, var(--method-other))`,
                        }}
                      >
                        {item.method}
                      </span>
                      <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                        {new Date(item.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.url}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span style={{ fontSize: "10px", color: item.is_error ? "var(--method-delete)" : "var(--method-get)" }}>
                        {item.status_code || "Error"}
                      </span>
                      <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                        {item.response_time_ms ? `${item.response_time_ms} ms` : ""}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Drag resizer */}
      <div className="resizer-horizontal" onMouseDown={handleSidebarResizeStart} />

      {/* Central Workspace Builder area */}
      <main className="request-pane">
        {/* Open Tabs */}
        <div className="tabs-container">
          {tabs.map((t) => (
            <div
              key={t.id}
              className={`request-tab ${t.id === activeTabId ? "active" : ""}`}
              onClick={() => setActiveTabId(t.id)}
            >
              {t.tabType === "collection" ? (
                <span style={{ fontSize: "11px", marginRight: "6px" }}>📁</span>
              ) : (
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "bold",
                    color: `var(--method-${t.method.toLowerCase()}, var(--method-other))`,
                    marginRight: "4px"
                  }}
                >
                  {t.method}
                </span>
              )}
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100px",
                }}
              >
                {t.name}
                {t.isDirty && "*"}
              </span>
              <button className="close-tab" onClick={(e) => closeTab(t.id, e)}>
                ×
              </button>
            </div>
          ))}
          <button className="new-tab-btn" onClick={() => createNewTab()}>
            +
          </button>
        </div>

        {/* Workspace info bar */}
        <div className="workspace-info-bar">
          <span className="workspace-title-label">{activeWorkspace}</span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>Invite</button>
            
            {/* Quick Look Environment Variables */}
            <div style={{ position: "relative" }}>
              <select
                className="method-select"
                style={{ padding: "4px 8px", minWidth: "140px" }}
                value={selectedEnvId || ""}
                onChange={(e) => setSelectedEnvId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">No Environment</option>
                {environments.map((env) => (
                  <option key={env.id} value={env.id}>
                    {env.name}
                  </option>
                ))}
              </select>
              
              <button
                className="action-btn-icon"
                style={{ marginLeft: "6px", fontSize: "14px" }}
                onClick={() => setShowEnvQuickLook(!showEnvQuickLook)}
                title="Quick look environment variables"
              >
                👁️
              </button>

              {showEnvQuickLook && (
                <div
                  style={{
                    position: "absolute",
                    top: "34px",
                    right: 0,
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    padding: "12px",
                    zIndex: 100,
                    minWidth: "260px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  <h4 style={{ marginBottom: "8px", fontSize: "11px", color: "var(--accent-color)" }}>
                    Active Environment Variables
                  </h4>
                  {selectedEnvId ? (
                    (() => {
                      const env = environments.find((e) => e.id === selectedEnvId);
                      if (!env || env.variables.length === 0) {
                        return <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>No variables defined</div>;
                      }
                      return (
                        <table style={{ width: "100%", fontSize: "11px" }}>
                          <thead>
                            <tr style={{ color: "var(--text-muted)" }}>
                              <th style={{ textAlign: "left", paddingBottom: "4px" }}>Variable</th>
                              <th style={{ textAlign: "left", paddingBottom: "4px" }}>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {env.variables.map((v, i) => (
                              <tr key={i}>
                                <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{v.key}</td>
                                <td style={{ color: "var(--method-get)" }}>{v.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()
                  ) : (
                    <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Select environment to view variables</div>
                  )}
                </div>
              )}
            </div>

            {/* AI toggle button matching Screenshot 4 */}
            <button 
              className={`btn-secondary ${showAIChat ? "send-btn" : ""}`} 
              style={{ padding: "4px 10px", display: "flex", gap: "4px", alignItems: "center", fontSize: "12px" }}
              onClick={() => setShowAIChat(!showAIChat)}
            >
              <span>🪄 AI</span>
            </button>
          </div>
        </div>

        {activeTab ? (
          activeTab.tabType === "collection" ? (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", backgroundColor: "var(--bg-primary)" }}>
              {/* Collection title and metadata */}
              <div style={{ padding: "24px 32px 12px 32px", borderBottom: "1px solid var(--border-color)" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "8px" }}>
                  {activeTab.name}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", color: "var(--text-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    👤 You
                  </span>
                  <span>•</span>
                  <span>0 requests</span>
                  <span>•</span>
                  <span>1 folders</span>
                  <span>•</span>
                  <span>01:17 PM, June 28, 2026</span>
                </div>

                {/* Collection tabs: Overview, Authorization, Scripts, Variables, Runs */}
                <div style={{ display: "flex", gap: "24px", marginTop: "20px", borderBottom: "1px solid var(--border-color)" }}>
                  {["Overview", "Authorization", "Scripts", "Variables", "Runs"].map((subTab) => {
                    const isActive = (activeTab.collectionTabActiveTab || "overview") === subTab.toLowerCase();
                    return (
                      <button
                        key={subTab}
                        onClick={() => updateActiveTab({ collectionTabActiveTab: subTab.toLowerCase() as any })}
                        style={{
                          background: "none",
                          border: "none",
                          borderBottom: isActive ? "2px solid var(--accent-color)" : "2px solid transparent",
                          color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                          padding: "8px 0",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                          marginBottom: "-1px"
                        }}
                      >
                        {subTab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-tab content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
                {(activeTab.collectionTabActiveTab || "overview") === "overview" && (
                  <div style={{ display: "flex", gap: "48px", maxWidth: "900px" }}>
                    {/* Left panel: empty state */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-primary)" }}>Collection is empty</h3>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                        Add a request or folder to structure your API workflow.
                      </p>
                      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                        <button 
                          className="send-btn" 
                          style={{ padding: "8px 16px", fontSize: "12px" }}
                          onClick={() => {
                            createNewTab({ 
                              collectionId: activeTab.collectionId, 
                              name: "Get data",
                              method: "GET"
                            });
                          }}
                        >
                          Add request
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: "8px 16px", fontSize: "12px" }}
                          onClick={() => addToast("Folder creation is a placeholder", "info")}
                        >
                          Add folder
                        </button>
                      </div>
                    </div>

                    {/* Right panel: Description */}
                    <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "16px", borderLeft: "1px solid var(--border-color)", paddingLeft: "32px" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
                        Help people understand your collection by adding a description. <span style={{ color: "var(--accent-color)", cursor: "pointer" }}>Write with AI</span>
                      </p>
                      <a href="#" style={{ fontSize: "12px", color: "var(--accent-color)", textDecoration: "none" }}>
                        View complete documentation
                      </a>
                    </div>
                  </div>
                )}

                {(activeTab.collectionTabActiveTab || "overview") === "runs" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* segmented tab inside runs: Functional, Scheduled, Performance */}
                    <div style={{ display: "flex", gap: "2px", backgroundColor: "var(--bg-tertiary)", padding: "2px", borderRadius: "6px", width: "fit-content" }}>
                      {["Functional", "Scheduled", "Performance"].map((tab) => (
                        <div 
                          key={tab} 
                          className="recents-segmented-tab active" 
                          style={{ 
                            fontSize: "11px", 
                            padding: "4px 12px", 
                            borderRadius: "4px",
                            backgroundColor: tab === "Functional" ? "var(--bg-secondary)" : "transparent",
                            color: tab === "Functional" ? "var(--text-primary)" : "var(--text-muted)"
                          }}
                        >
                          {tab}
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      Runs triggered for this collection via Collection Runner and Postman CLI.
                    </div>

                    {/* Table headers */}
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "bold" }}>
                      <span style={{ flex: 2 }}>Last 100 runs</span>
                      <span style={{ flex: 1 }}>Run by</span>
                      <span style={{ flex: 1 }}>Run status</span>
                      <span style={{ flex: 1 }}>Source</span>
                    </div>

                    {/* Empty run state */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: "16px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Your collection has not been run yet
                      </span>
                      <button 
                        className="upgrade-btn-orange" 
                        style={{ backgroundColor: "#ff6c37", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => addToast("Starting collection runner...", "info")}
                      >
                        Run Collection
                      </button>
                    </div>
                  </div>
                )}

                {["authorization", "scripts", "variables"].includes(activeTab.collectionTabActiveTab || "") && (
                  <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                    Configure {activeTab.collectionTabActiveTab} for the collection here. (Placeholder view)
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              
              {/* Address bar */}
              <div className="address-bar-container">
                <div className="url-bar-wrapper">
                  <select
                    className="method-select"
                    value={activeTab.method}
                    onChange={(e) => updateActiveTab({ method: e.target.value })}
                    style={{
                      color: `var(--method-${activeTab.method.toLowerCase()}, var(--text-primary))`
                    }}
                  >
                    <option value="GET" style={{ color: "var(--method-get)" }}>GET</option>
                    <option value="POST" style={{ color: "var(--method-post)" }}>POST</option>
                    <option value="PUT" style={{ color: "var(--method-put)" }}>PUT</option>
                    <option value="DELETE" style={{ color: "var(--method-delete)" }}>DELETE</option>
                    <option value="PATCH" style={{ color: "var(--method-patch)" }}>PATCH</option>
                    <option value="HEAD" style={{ color: "var(--text-primary)" }}>HEAD</option>
                    <option value="OPTIONS" style={{ color: "var(--text-primary)" }}>OPTIONS</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Enter URL or paste text"
                    className="url-input"
                    value={activeTab.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                  />
                </div>

                <button className="send-btn" onClick={handleSend} disabled={activeTab.loading}>
                  {activeTab.loading ? "Sending..." : "Send"}
                </button>

                <button
                  className="btn-secondary"
                  onClick={handleSaveClick}
                  style={{ height: "32px", padding: "0 14px", display: "flex", alignItems: "center" }}
                >
                  {activeTab.savedId ? "Save" : "Save As"}
                </button>
              </div>

            {/* Request Builder Sub-Tabs */}
            <div className="builder-tabs">
              <div
                className={`builder-tab ${builderSubTab === "params" ? "active" : ""}`}
                onClick={() => setBuilderSubTab("params")}
              >
                Params ({activeTab.params.filter((p) => p.key.trim() !== "").length})
              </div>
              <div
                className={`builder-tab ${builderSubTab === "auth" ? "active" : ""}`}
                onClick={() => setBuilderSubTab("auth")}
              >
                Authorization
              </div>
              <div
                className={`builder-tab ${builderSubTab === "headers" ? "active" : ""}`}
                onClick={() => setBuilderSubTab("headers")}
              >
                Headers ({activeTab.headers.filter((h) => h.key.trim() !== "").length})
              </div>
              <div
                className={`builder-tab ${builderSubTab === "body" ? "active" : ""}`}
                onClick={() => setBuilderSubTab("body")}
              >
                Body
              </div>
              <div
                className={`builder-tab ${builderSubTab === "snippet" ? "active" : ""}`}
                onClick={() => setBuilderSubTab("snippet")}
                style={{ marginLeft: "auto", color: "var(--accent-color)" }}
              >
                Code Snippet
              </div>
            </div>

            {/* Builder Content */}
            <div className="builder-tab-content">
              
              {/* Params View */}
              {builderSubTab === "params" && (
                <div>
                  <h4 style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "11px" }}>
                    Query Parameters
                  </h4>
                  <table className="kv-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th style={{ width: "30%" }}>Key</th>
                        <th style={{ width: "40%" }}>Value</th>
                        <th>Description</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab.params.map((param, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={param.enabled}
                              onChange={() => toggleParam(index)}
                              disabled={!param.key && !param.value}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Key"
                              className="kv-input"
                              value={param.key}
                              onChange={(e) => handleParamChange(index, "key", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Value"
                              className="kv-input"
                              value={param.value}
                              onChange={(e) => handleParamChange(index, "value", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Description"
                              className="kv-input"
                              value={param.description}
                              onChange={(e) => handleParamChange(index, "description", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {index < activeTab.params.length - 1 && (
                              <button className="table-action-btn" onClick={() => removeParamRow(index)}>
                                ×
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Authorization View */}
              {builderSubTab === "auth" && (
                <div className="auth-container">
                  <div className="form-group">
                    <label>Auth Type</label>
                    <select
                      className="form-control"
                      value={activeTab.auth_type}
                      onChange={(e) => updateActiveTab({ auth_type: e.target.value })}
                    >
                      <option value="none">No Auth</option>
                      <option value="bearer">Bearer Token</option>
                      <option value="basic">Basic Auth</option>
                    </select>
                  </div>

                  {activeTab.auth_type === "bearer" && (
                    <div className="form-group">
                      <label>Token</label>
                      <input
                        type="text"
                        placeholder="Token"
                        className="form-control"
                        value={activeTab.auth_config.token || ""}
                        onChange={(e) =>
                          updateActiveTab({
                            auth_config: { ...activeTab.auth_config, token: e.target.value },
                          })
                        }
                      />
                    </div>
                  )}

                  {activeTab.auth_type === "basic" && (
                    <>
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          type="text"
                          placeholder="Username"
                          className="form-control"
                          value={activeTab.auth_config.username || ""}
                          onChange={(e) =>
                            updateActiveTab({
                              auth_config: { ...activeTab.auth_config, username: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          type="password"
                          placeholder="Password"
                          className="form-control"
                          value={activeTab.auth_config.password || ""}
                          onChange={(e) =>
                            updateActiveTab({
                              auth_config: { ...activeTab.auth_config, password: e.target.value },
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {activeTab.auth_type === "none" && (
                    <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      This request does not use auth headers.
                    </div>
                  )}
                </div>
              )}

              {/* Headers View */}
              {builderSubTab === "headers" && (
                <div>
                  <h4 style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "11px" }}>
                    Headers
                  </h4>
                  <table className="kv-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th style={{ width: "30%" }}>Key</th>
                        <th style={{ width: "40%" }}>Value</th>
                        <th>Description</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab.headers.map((header, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={header.enabled}
                              onChange={() => toggleHeader(index)}
                              disabled={!header.key && !header.value}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Key"
                              className="kv-input"
                              value={header.key}
                              onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Value"
                              className="kv-input"
                              value={header.value}
                              onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Description"
                              className="kv-input"
                              value={header.description}
                              onChange={(e) => handleHeaderChange(index, "description", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {index < activeTab.headers.length - 1 && (
                              <button className="table-action-btn" onClick={() => removeHeaderRow(index)}>
                                ×
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Body View */}
              {builderSubTab === "body" && (
                <div>
                  <div className="body-radio-group">
                    <label className="body-radio-label">
                      <input
                        type="radio"
                        name="bodyType"
                        value="none"
                        checked={activeTab.body_type === "none"}
                        onChange={() => updateActiveTab({ body_type: "none" })}
                      />
                      none
                    </label>
                    <label className="body-radio-label">
                      <input
                        type="radio"
                        name="bodyType"
                        value="form-data"
                        checked={activeTab.body_type === "form-data"}
                        onChange={() => updateActiveTab({ body_type: "form-data" })}
                      />
                      form-data
                    </label>
                    <label className="body-radio-label">
                      <input
                        type="radio"
                        name="bodyType"
                        value="x-www-form-urlencoded"
                        checked={activeTab.body_type === "x-www-form-urlencoded"}
                        onChange={() => updateActiveTab({ body_type: "x-www-form-urlencoded" })}
                      />
                      x-www-form-urlencoded
                    </label>
                    <label className="body-radio-label">
                      <input
                        type="radio"
                        name="bodyType"
                        value="raw"
                        checked={activeTab.body_type === "raw"}
                        onChange={() => updateActiveTab({ body_type: "raw" })}
                      />
                      raw
                    </label>
                    <label className="body-radio-label" style={{ opacity: 0.5 }}>
                      <input type="radio" disabled />
                      binary
                    </label>
                    <label className="body-radio-label" style={{ opacity: 0.5 }}>
                      <input type="radio" disabled />
                      GraphQL
                    </label>
                  </div>

                  {activeTab.body_type !== "none" ? (
                    <div>
                      {activeTab.body_type === "raw" && (
                        <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "6px" }}>
                          Text area raw content:
                        </div>
                      )}
                      {(activeTab.body_type === "x-www-form-urlencoded" || activeTab.body_type === "form-data") && (
                        <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "6px" }}>
                          Format: enter key=value strings per line, or JSON key-value array.
                        </div>
                      )}
                      <textarea
                        placeholder="Request Body..."
                        className="body-editor-textarea"
                        value={activeTab.body_content}
                        onChange={(e) => updateActiveTab({ body_content: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div style={{ color: "var(--text-muted)", fontSize: "12px", padding: "16px 0" }}>
                      This request does not have a body
                    </div>
                  )}
                </div>
              )}

              {/* Code Snippet View */}
              {builderSubTab === "snippet" && (
                <div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <button
                      className={`btn-secondary ${snippetLanguage === "curl" ? "send-btn" : ""}`}
                      style={{ padding: "4px 8px", fontSize: "11px" }}
                      onClick={() => setSnippetLanguage("curl")}
                    >
                      cURL
                    </button>
                    <button
                      className={`btn-secondary ${snippetLanguage === "fetch" ? "send-btn" : ""}`}
                      style={{ padding: "4px 8px", fontSize: "11px" }}
                      onClick={() => setSnippetLanguage("fetch")}
                    >
                      Fetch API
                    </button>
                    <button
                      className={`btn-secondary ${snippetLanguage === "python" ? "send-btn" : ""}`}
                      style={{ padding: "4px 8px", fontSize: "11px" }}
                      onClick={() => setSnippetLanguage("python")}
                    >
                      Python (requests)
                    </button>
                  </div>
                  <pre
                    style={{
                      padding: "12px",
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-primary)",
                      overflow: "auto",
                      whiteSpace: "pre-wrap",
                      fontSize: "11px",
                    }}
                  >
                    {generateSnippet()}
                  </pre>
                </div>
              )}
            </div>

            {/* Resize handle for Response View */}
            <div className="resizer-vertical" onMouseDown={handleResponseResizeStart} />

            {/* Bottom Response Panel */}
            <div className="response-container" style={{ height: responseHeight }}>
              <div className="response-header-bar">
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    className={`builder-tab ${responseSubTab === "body" ? "active" : ""}`}
                    style={{ padding: "4px 8px", fontSize: "12px" }}
                    onClick={() => setResponseSubTab("body")}
                  >
                    Response Body
                  </div>
                  <div
                    className={`builder-tab ${responseSubTab === "headers" ? "active" : ""}`}
                    style={{ padding: "4px 8px", fontSize: "12px" }}
                    onClick={() => setResponseSubTab("headers")}
                  >
                    Headers ({activeTab.response?.headers ? Object.keys(activeTab.response.headers).length : 0})
                  </div>
                </div>

                {activeTab.response && (
                  <div className="response-status-group">
                    <div>
                      Status:{" "}
                      <span
                        className={`status-badge ${
                          activeTab.response.status_code && activeTab.response.status_code < 400
                            ? "success"
                            : "error"
                        }`}
                      >
                        {activeTab.response.status_code || "Error"} {activeTab.response.status_text || ""}
                      </span>
                    </div>
                    <div>
                      Time: <span style={{ color: "white", fontWeight: "bold" }}>{activeTab.response.time_ms} ms</span>
                    </div>
                    <div>
                      Size:{" "}
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        {(activeTab.response.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, overflow: "auto", backgroundColor: "var(--bg-tertiary)" }}>
                {activeTab.response ? (
                  responseSubTab === "body" ? (
                    (() => {
                      let text = activeTab.response.body || "";
                      try {
                        const parsed = JSON.parse(text);
                        text = JSON.stringify(parsed, null, 2);
                      } catch {}
                      
                      return <pre className="response-body-pre">{text}</pre>;
                    })()
                  ) : (
                    <table className="kv-table" style={{ margin: "12px", width: "calc(100% - 24px)" }}>
                      <thead>
                        <tr style={{ color: "var(--text-muted)" }}>
                          <th style={{ width: "30%" }}>Header</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeTab.response.headers &&
                          Object.entries(activeTab.response.headers).map(([k, v]) => (
                            <tr key={k}>
                              <td style={{ color: "var(--accent-color)", fontWeight: "bold", fontSize: "11px" }}>{k}</td>
                              <td style={{ color: "var(--text-primary)", fontSize: "11px" }}>{v}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", alignItems: "center", color: "var(--text-muted)" }}>
                    <span>Send a request to see response details here</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
          /* Watermark Empty State View matching Screenshot 4 */
          <div className="workspace-empty-view">
            <div className="watermark-circle">
              <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </div>
            
            <div className="empty-action-menu">
              <div className="empty-menu-row" onClick={() => setShowAIChat(!showAIChat)}>
                <span>Ask AI</span>
                <span className="empty-menu-shortcut">Ctrl Alt P</span>
              </div>
              <div className="empty-menu-row" onClick={() => createNewTab()}>
                <span>Create new</span>
                <span className="empty-menu-shortcut"></span>
              </div>
              <div className="empty-menu-row" onClick={() => addToast("Import is a placeholder", "info")}>
                <span>Import</span>
                <span className="empty-menu-shortcut">Ctrl O</span>
              </div>
              <div className="empty-menu-row" onClick={() => searchInputRef.current?.focus()}>
                <span>Find in workspace</span>
                <span className="empty-menu-shortcut">Ctrl K</span>
              </div>
              <div className="empty-menu-row" onClick={() => addToast("Overview triggered", "info")}>
                <span>Open workspace overview</span>
                <span className="empty-menu-shortcut"></span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Side Panel chat drawer in Workspace View (Screenshot 4) */}
      {showAIChat && (
        <aside className="ai-side-chat-drawer">
          <div className="ai-chat-header">
            <span className="ai-chat-title">Greeting Chat</span>
            <button className="table-action-btn" onClick={() => setShowAIChat(false)}>×</button>
          </div>

          <div className="ai-chat-messages">
            {chatMessages.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "11px", textAlign: "center", marginTop: "30px" }}>
                No messages yet. Ask me anything!
              </div>
            ) : (
              chatMessages.map((m, idx) => (
                <div key={idx} className={`ai-chat-bubble ${m.sender}`}>
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                  {m.actions && (
                    <div className="ai-chat-actions-list">
                      {m.actions.map(act => (
                        <button 
                          key={act} 
                          className="ai-chat-action-btn"
                          onClick={() => handleChatActionClick(act)}
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <form className="ai-chat-input-area" onSubmit={handleWorkspaceChatSubmit} style={{ position: "relative" }}>
            {chatDropdown !== "none" && (
              <div className="ai-chat-autocomplete-dropdown">
                <div className="autocomplete-header">
                  {chatDropdown === "context" ? "Insert Context (@)" : "Trigger Skill (/)"}
                </div>
                <div className="autocomplete-items-list">
                  {chatDropdown === "context" ? (
                    getContextItems().length === 0 ? (
                      <div className="autocomplete-empty">No matching context found</div>
                    ) : (
                      getContextItems().map((item, idx) => (
                        <div 
                          key={idx} 
                          className="autocomplete-item" 
                          onClick={() => {
                            const triggerIndex = aiChatInput.lastIndexOf("@");
                            const before = aiChatInput.slice(0, triggerIndex);
                            setAiChatInput(before + `[${item.value}] `);
                            setChatDropdown("none");
                          }}
                        >
                          <span className="autocomplete-item-category">{item.category}</span>
                          <span className="autocomplete-item-name">{item.name}</span>
                        </div>
                      ))
                    )
                  ) : (
                    getSkillsItems().length === 0 ? (
                      <div className="autocomplete-empty">No matching skills found</div>
                    ) : (
                      getSkillsItems().map((skill, idx) => (
                        <div 
                          key={idx} 
                          className="autocomplete-item" 
                          onClick={() => {
                            const triggerIndex = aiChatInput.lastIndexOf("/");
                            const before = aiChatInput.slice(0, triggerIndex);
                            setAiChatInput(before + `${skill.value} `);
                            setChatDropdown("none");
                          }}
                        >
                          <span className="autocomplete-item-name" style={{ color: "var(--accent-color)" }}>{skill.name}</span>
                          <span className="autocomplete-item-desc">{skill.desc}</span>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            )}
            <textarea
              className="ai-chat-textarea"
              placeholder="Describe what you need. Press @ for context, / for Skills."
              value={aiChatInput}
              onChange={(e) => {
                const val = e.target.value;
                setAiChatInput(val);
                
                const lastChar = val.slice(-1);
                if (lastChar === "@") {
                  setChatDropdown("context");
                  setSearchFilter("");
                } else if (lastChar === "/") {
                  setChatDropdown("skills");
                  setSearchFilter("");
                } else if (chatDropdown !== "none") {
                  const triggerIndex = val.lastIndexOf(chatDropdown === "context" ? "@" : "/");
                  if (triggerIndex !== -1) {
                    const filterText = val.slice(triggerIndex + 1);
                    if (filterText.includes(" ") || filterText.includes("\n")) {
                      setChatDropdown("none");
                    } else {
                      setSearchFilter(filterText);
                    }
                  } else {
                    setChatDropdown("none");
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setChatDropdown("none");
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleWorkspaceChatSubmit(e);
                  setChatDropdown("none");
                }
              }}
            />
            <div className="ai-chat-input-footer">
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Auto v</span>
              <button type="submit" className="send-btn" style={{ padding: "4px 8px", fontSize: "11px" }}>Send</button>
            </div>
          </form>
        </aside>
      )}
    </div>
  );
};
