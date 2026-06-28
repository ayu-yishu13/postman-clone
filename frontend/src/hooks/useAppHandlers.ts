"use client";

import { useEffect, useCallback } from "react";
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  createSavedRequest,
  updateSavedRequest,
  deleteSavedRequest as deleteSavedRequestAPI,
  getEnvironments,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
  getHistory,
  clearHistory as clearHistoryAPI,
  sendProxyRequest,
  SavedRequest,
} from "../utils/requests";
import { Tab } from "../app/types";
import { AppState } from "./useAppState";

export function useAppHandlers(state: AppState) {
  const {
    isSignedIn, setIsSignedIn,
    currentView, setCurrentView,
    activeWorkspace, setActiveWorkspace,
    collections, setCollections,
    environments, setEnvironments,
    setHistory,
    setSidebarTab,
    selectedEnvId, setSelectedEnvId,
    builderSubTab, setBuilderSubTab,
    snippetLanguage,
    showProfileDropdown, setShowProfileDropdown,
    showWorkspaceDropdown, setShowWorkspaceDropdown,
    isResizingSidebar, setIsResizingSidebar,
    isResizingResponse, setIsResizingResponse,
    setSidebarWidth, setResponseHeight,
    editingCollectionId, setEditingCollectionId,
    editingRequestId, setEditingRequestId,
    renameInputVal, setRenameInputVal,
    tabs, setTabs,
    activeTabId, setActiveTabId,
    modals, setModals,
    modalInputs, setModalInputs,
    toasts, setToasts,
    showAIChat, setShowAIChat,
    aiChatInput, setAiChatInput,
    chatMessages, setChatMessages,
    homeChatbarInput, setHomeChatbarInput,
    searchFilters, setSearchFilters,
    activeFilterDropdown, setActiveFilterDropdown,
    searchQuery,
  } = state;

  // ============================
  // TOAST HELPER
  // ============================
  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, [setToasts]);

  // ============================
  // DATA LOADING
  // ============================
  const loadAllData = useCallback(async () => {
    try {
      const colls = await getCollections();
      setCollections(colls);
      const envs = await getEnvironments();
      setEnvironments(envs);
      const hist = await getHistory();
      setHistory(hist);
    } catch (err: any) {
      addToast("Error fetching server data: " + err.message, "error");
    }
  }, [setCollections, setEnvironments, setHistory, addToast]);

  // ============================
  // EFFECTS
  // ============================
  useEffect(() => {
    const sessionAuth = localStorage.getItem("isSignedIn");
    if (sessionAuth === "true") {
      setIsSignedIn(true);
    }
  }, [setIsSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      loadAllData();
    }
  }, [isSignedIn, loadAllData]);

  useEffect(() => {
    if (tabs.length === 0 && isSignedIn) {
      createNewTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.length, isSignedIn]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        const newWidth = Math.max(180, Math.min(500, e.clientX - 48));
        setSidebarWidth(newWidth);
      }
      if (isResizingResponse) {
        const newHeight = Math.max(100, Math.min(window.innerHeight - 150, window.innerHeight - e.clientY - 28));
        setResponseHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingResponse(false);
    };

    if (isResizingSidebar || isResizingResponse) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingSidebar, isResizingResponse, setSidebarWidth, setResponseHeight, setIsResizingSidebar, setIsResizingResponse]);

  // ============================
  // AUTH HANDLERS
  // ============================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignedIn(true);
    localStorage.setItem("isSignedIn", "true");
    addToast("Logged in successfully as Ayush Kumar Rai", "success");
    setCurrentView("home");
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    localStorage.removeItem("isSignedIn");
    setShowProfileDropdown(false);
    addToast("Signed out successfully", "info");
  };

  const handleQuickSignIn = () => {
    setIsSignedIn(true);
    localStorage.setItem("isSignedIn", "true");
    addToast("Signed in as Ayush Kumar Rai", "success");
    setCurrentView("home");
  };

  // ============================
  // RESIZING HANDLERS
  // ============================
  const handleSidebarResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  };

  const handleResponseResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingResponse(true);
  };

  // ============================
  // RENAMING HANDLERS
  // ============================
  const handleRenameCollection = async (id: number) => {
    if (!renameInputVal.trim()) {
      setEditingCollectionId(null);
      return;
    }
    try {
      await updateCollection(id, renameInputVal.trim());
      addToast("Collection renamed", "success");
      setEditingCollectionId(null);
      const updated = await getCollections();
      setCollections(updated);
    } catch (err: any) {
      addToast("Failed to rename: " + err.message, "error");
    }
  };

  const handleRenameRequest = async (req: SavedRequest) => {
    if (!renameInputVal.trim()) {
      setEditingRequestId(null);
      return;
    }
    try {
      const payload = {
        name: renameInputVal.trim(),
        method: req.method,
        url: req.url,
        headers: req.headers,
        body_type: req.body_type,
        body_content: req.body_content,
        auth_type: req.auth_type,
        auth_config: req.auth_config,
      };
      await updateSavedRequest(req.id, payload);
      addToast("Request renamed", "success");
      setEditingRequestId(null);
      
      setTabs((prev) =>
        prev.map((t) => (t.savedId === req.id ? { ...t, name: renameInputVal.trim() } : t))
      );

      const updated = await getCollections();
      setCollections(updated);
    } catch (err: any) {
      addToast("Failed to rename: " + err.message, "error");
    }
  };

  // ============================
  // TAB MANAGEMENT
  // ============================
  const activeTab = tabs.find((t) => t.id === activeTabId) || null;

  const parseUrlParams = (url: string) => {
    const parts = url.split("?");
    if (parts.length < 2) return [{ key: "", value: "", enabled: true, description: "" }];
    
    const query = parts.slice(1).join("?");
    const pairs = query.split("&");
    const parsed = pairs
      .map((p) => {
        const [k, v] = p.split("=");
        return {
          key: decodeURIComponent(k || ""),
          value: decodeURIComponent(v || ""),
          enabled: true,
          description: "",
        };
      })
      .filter((p) => p.key !== "");

    return parsed.length > 0 ? [...parsed, { key: "", value: "", enabled: true, description: "" }] : [{ key: "", value: "", enabled: true, description: "" }];
  };

  const rebuildUrlWithParams = (url: string, paramsList: Tab["params"]) => {
    const baseUrl = url.split("?")[0];
    const enabledParams = paramsList.filter((p) => p.enabled && p.key.trim() !== "");
    if (enabledParams.length === 0) return baseUrl;

    const queryString = enabledParams
      .map((p) => `${encodeURIComponent(p.key.trim())}=${encodeURIComponent(p.value)}`)
      .join("&");
    return `${baseUrl}?${queryString}`;
  };

  const createNewTab = (initial?: Partial<Tab>) => {
    const newId = "tab-" + Date.now();
    const newTab: Tab = {
      id: newId,
      savedId: initial?.savedId || null,
      collectionId: initial?.collectionId || null,
      name: initial?.name || "Untitled Request",
      method: initial?.method || "GET",
      url: initial?.url || "",
      headers: initial?.headers || [{ key: "", value: "", enabled: true, description: "" }],
      params: initial?.params || [{ key: "", value: "", enabled: true, description: "" }],
      body_type: initial?.body_type || "none",
      body_content: initial?.body_content || "",
      auth_type: initial?.auth_type || "none",
      auth_config: initial?.auth_config || {},
      response: initial?.response || null,
      loading: false,
      isDirty: false,
    };
    
    if (initial?.url) {
      newTab.params = parseUrlParams(initial.url);
    }

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (tabIdToClose: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remainingTabs = tabs.filter((t) => t.id !== tabIdToClose);
    setTabs(remainingTabs);

    if (activeTabId === tabIdToClose) {
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
      } else {
        setActiveTabId("");
      }
    }
  };

  const updateActiveTab = (updates: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, ...updates, isDirty: true } : t))
    );
  };

  // ============================
  // URL & PARAM SYNC
  // ============================
  const handleUrlChange = (newUrl: string) => {
    if (!activeTab) return;
    const parsedParams = parseUrlParams(newUrl);
    const mergedParams = parsedParams.map((p) => {
      const existing = activeTab.params.find((old) => old.key === p.key);
      return existing ? { ...p, description: existing.description } : p;
    });

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: newUrl, params: mergedParams, isDirty: true }
          : t
      )
    );
  };

  const handleParamChange = (index: number, field: "key" | "value" | "description", val: string) => {
    if (!activeTab) return;
    const updatedParams = [...activeTab.params];
    updatedParams[index][field] = val;

    if (index === updatedParams.length - 1 && (updatedParams[index].key || updatedParams[index].value)) {
      updatedParams.push({ key: "", value: "", enabled: true, description: "" });
    }

    const newUrl = rebuildUrlWithParams(activeTab.url, updatedParams);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, params: updatedParams, url: newUrl, isDirty: true }
          : t
      )
    );
  };

  const handleHeaderChange = (index: number, field: "key" | "value" | "description", val: string) => {
    if (!activeTab) return;
    const updated = [...activeTab.headers];
    updated[index][field] = val;

    if (index === updated.length - 1 && (updated[index].key || updated[index].value)) {
      updated.push({ key: "", value: "", enabled: true, description: "" });
    }
    updateActiveTab({ headers: updated });
  };

  const toggleParam = (index: number) => {
    if (!activeTab) return;
    const updated = [...activeTab.params];
    updated[index].enabled = !updated[index].enabled;
    const newUrl = rebuildUrlWithParams(activeTab.url, updated);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, params: updated, url: newUrl, isDirty: true }
          : t
      )
    );
  };

  const toggleHeader = (index: number) => {
    if (!activeTab) return;
    const updated = [...activeTab.headers];
    updated[index].enabled = !updated[index].enabled;
    updateActiveTab({ headers: updated });
  };

  const removeParamRow = (index: number) => {
    if (!activeTab || activeTab.params.length <= 1) return;
    const updated = activeTab.params.filter((_, i) => i !== index);
    const newUrl = rebuildUrlWithParams(activeTab.url, updated);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, params: updated, url: newUrl, isDirty: true }
          : t
      )
    );
  };

  const removeHeaderRow = (index: number) => {
    if (!activeTab || activeTab.headers.length <= 1) return;
    const updated = activeTab.headers.filter((_, i) => i !== index);
    updateActiveTab({ headers: updated });
  };

  // ============================
  // SEND PROXY REQUEST
  // ============================
  const handleSend = async () => {
    if (!activeTab || activeTab.loading) return;
    if (!activeTab.url.trim()) {
      addToast("Please enter a URL", "error");
      return;
    }

    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, loading: true } : t))
    );

    try {
      const cleanHeaders = activeTab.headers
        .filter((h) => h.key.trim() !== "")
        .map((h) => ({ key: h.key, value: h.value, enabled: h.enabled }));

      let parsedBodyContent = activeTab.body_content;

      if (activeTab.body_type === "x-www-form-urlencoded" || activeTab.body_type === "form-data") {
        try {
          JSON.parse(activeTab.body_content);
        } catch {
          if (activeTab.body_content.includes("=")) {
            const rows = activeTab.body_content.split("\n").map(line => {
              const [k, v] = line.split("=");
              return { key: k.trim(), value: v ? v.trim() : "", enabled: true };
            });
            parsedBodyContent = JSON.stringify(rows);
          }
        }
      }

      const res = await sendProxyRequest({
        method: activeTab.method,
        url: activeTab.url,
        headers: cleanHeaders,
        body_type: activeTab.body_type,
        body_content: parsedBodyContent,
        auth_type: activeTab.auth_type,
        auth_config: activeTab.auth_config,
        environment_id: selectedEnvId,
      });

      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, response: res, loading: false }
            : t
        )
      );

      if (res.error) {
        addToast(res.error, "error");
      } else {
        addToast(`Response: ${res.status_code} ${res.status_text || ""}`, "success");
      }

      const hist = await getHistory();
      setHistory(hist);
    } catch (err: any) {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, loading: false } : t))
      );
      addToast(err.message, "error");
    }
  };

  // ============================
  // SAVE REQUESTS
  // ============================
  const saveRequestToDB = async (collectionId: number, requestId?: number) => {
    if (!activeTab) return;
    try {
      const payload = {
        name: requestId ? activeTab.name : modalInputs.requestName || "Saved Request",
        method: activeTab.method,
        url: activeTab.url,
        headers: JSON.stringify(activeTab.headers),
        body_type: activeTab.body_type,
        body_content: activeTab.body_content,
        auth_type: activeTab.auth_type,
        auth_config: JSON.stringify(activeTab.auth_config),
      };

      if (requestId) {
        await updateSavedRequest(requestId, payload);
        addToast("Request updated", "success");
        updateActiveTab({ isDirty: false });
      } else {
        const created = await createSavedRequest(collectionId, payload);
        addToast("Request saved", "success");
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId
              ? {
                  ...t,
                  savedId: created.id,
                  collectionId: created.collection_id,
                  name: created.name,
                  isDirty: false,
                }
              : t
          )
        );
        setModals((prev) => ({ ...prev, saveRequest: false }));
      }
      const updatedColls = await getCollections();
      setCollections(updatedColls);
    } catch (err: any) {
      addToast("Failed to save request: " + err.message, "error");
    }
  };

  const handleSaveClick = () => {
    if (!activeTab) return;
    if (activeTab.savedId) {
      saveRequestToDB(activeTab.collectionId!, activeTab.savedId);
    } else {
      setModalInputs((prev) => ({
        ...prev,
        requestName: activeTab.name === "Untitled Request" ? "" : activeTab.name,
        targetCollectionId: collections[0]?.id.toString() || "",
      }));
      setModals((prev) => ({ ...prev, saveRequest: true }));
    }
  };

  // ============================
  // CRUD COLLECTIONS
  // ============================
  const handleCreateCollection = async () => {
    if (!modalInputs.collectionName.trim()) {
      addToast("Collection name is required", "error");
      return;
    }
    try {
      await createCollection(modalInputs.collectionName);
      addToast("Collection created", "success");
      setModalInputs((prev) => ({ ...prev, collectionName: "" }));
      setModals((prev) => ({ ...prev, createCollection: false }));
      const updated = await getCollections();
      setCollections(updated);
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  const handleDeleteCollection = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this collection?")) return;
    try {
      await deleteCollection(id);
      addToast("Collection deleted", "success");
      const updated = await getCollections();
      setCollections(updated);
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  // ============================
  // LOAD REQUESTS
  // ============================
  const loadSavedRequest = (req: SavedRequest) => {
    setCurrentView("workspace");
    const existingTab = tabs.find((t) => t.savedId === req.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    let parsedHeaders = [{ key: "", value: "", enabled: true, description: "" }];
    try {
      if (req.headers) parsedHeaders = JSON.parse(req.headers);
    } catch {}

    let parsedAuth = {};
    try {
      if (req.auth_config) parsedAuth = JSON.parse(req.auth_config);
    } catch {}

    createNewTab({
      savedId: req.id,
      collectionId: req.collection_id,
      name: req.name,
      method: req.method,
      url: req.url,
      headers: parsedHeaders,
      body_type: req.body_type || "none",
      body_content: req.body_content || "",
      auth_type: req.auth_type || "none",
      auth_config: parsedAuth,
      isDirty: false,
    });
  };

  const loadHistoryItem = (item: any) => {
    setCurrentView("workspace");
    let parsedHeaders = [{ key: "", value: "", enabled: true, description: "" }];
    try {
      if (item.headers) parsedHeaders = JSON.parse(item.headers);
    } catch {}

    let parsedAuth = {};
    try {
      if (item.auth_config) parsedAuth = JSON.parse(item.auth_config);
    } catch {}

    createNewTab({
      name: `${item.method} ${item.url.slice(0, 20)}...`,
      method: item.method,
      url: item.url,
      headers: parsedHeaders,
      body_type: item.body_type || "none",
      body_content: item.body_content || "",
      auth_type: item.auth_type || "none",
      auth_config: parsedAuth,
      isDirty: false,
    });
    addToast("History item loaded", "info");
  };

  // ============================
  // CRUD ENVIRONMENTS
  // ============================
  const handleOpenEditEnv = (env: any | null) => {
    if (env) {
      setModalInputs({
        ...modalInputs,
        envName: env.name,
        envVariables: env.variables.length > 0 ? env.variables.map((v: any) => ({ key: v.key, value: v.value })) : [{ key: "", value: "" }],
        editingEnvId: env.id,
      });
    } else {
      setModalInputs({
        ...modalInputs,
        envName: "",
        envVariables: [{ key: "", value: "" }],
        editingEnvId: null,
      });
    }
    setModals((prev) => ({ ...prev, editEnvironment: true }));
  };

  const handleSaveEnvironment = async () => {
    if (!modalInputs.envName.trim()) {
      addToast("Environment name is required", "error");
      return;
    }
    const filteredVars = modalInputs.envVariables.filter((v) => v.key.trim() !== "");
    try {
      if (modalInputs.editingEnvId) {
        await updateEnvironment(modalInputs.editingEnvId, modalInputs.envName, filteredVars);
        addToast("Environment updated", "success");
      } else {
        await createEnvironment(modalInputs.envName, filteredVars);
        addToast("Environment created", "success");
      }
      setModals((prev) => ({ ...prev, editEnvironment: false }));
      const updated = await getEnvironments();
      setEnvironments(updated);
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  const handleDeleteEnvironment = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete environment?")) return;
    try {
      await deleteEnvironment(id);
      addToast("Environment deleted", "success");
      if (selectedEnvId === id) setSelectedEnvId(null);
      const updated = await getEnvironments();
      setEnvironments(updated);
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  // ============================
  // WORKSPACE HELPERS
  // ============================
  const handleSelectWorkspace = (wName: string) => {
    setActiveWorkspace(wName);
    setCurrentView("workspace");
    setShowWorkspaceDropdown(false);
    addToast(`Switched to workspace: ${wName}`, "info");
  };

  // ============================
  // AI CHAT LOGIC
  // ============================
  const handleHomeChatSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!homeChatbarInput.trim()) return;

    const userMsg = homeChatbarInput.trim();
    setHomeChatbarInput("");
    
    setCurrentView("workspace");
    setShowAIChat(true);

    setChatMessages([
      { sender: "user", text: userMsg },
      { 
        sender: "assistant", 
        text: `Hi! I'm your Postman assistant. I can help you with a wide range of API-related tasks, such as:\n\n• Creating and managing requests (HTTP, GraphQL, WebSocket, gRPC, etc.)\n• Writing tests and scripts for your collections\n• Setting up environments and variables\n• Creating monitors, mock servers, and flows\n• Searching for APIs on the Postman API Network\n• Organizing collections and workspaces\n\nWhat would you like to do today?`,
        actions: [
          "Create a new request",
          "Explore my collection",
          "Write tests for my API",
          "Find a public API"
        ]
      }
    ]);
  };

  const handleWorkspaceChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const text = aiChatInput.trim();
    setAiChatInput("");

    setChatMessages(prev => [...prev, { sender: "user", text }]);

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: "assistant",
        text: `I've received your query: "${text}". I can assist you in building queries, writing test scripts (e.g. check status equals 200), or mapping keys. Let me know what specific step you'd like to run!`,
        actions: ["Create a new request", "Explore my collection"]
      }]);
    }, 800);
  };

  const handleChatActionClick = (action: string) => {
    if (action === "Create a new request") {
      createNewTab();
      addToast("Created new request tab", "success");
    } else if (action === "Explore my collection") {
      setSidebarTab("collections");
      addToast("Opened collections side panel", "info");
    } else if (action === "Write tests for my API") {
      setBuilderSubTab("params");
      addToast("Switched to parameters/query panel", "info");
    } else {
      addToast(`Action triggered: ${action}`, "info");
    }
  };

  // ============================
  // SEARCH FILTER HANDLERS
  // ============================
  const handleTypeSelect = (type: string) => {
    setSearchFilters(prev => ({ ...prev, type }));
    setActiveFilterDropdown("none");
  };

  const handleOrgToggle = (org: string) => {
    setSearchFilters(prev => ({ ...prev, org }));
    setActiveFilterDropdown("none");
  };

  // ============================
  // CODE SNIPPET GENERATOR
  // ============================
  const generateSnippet = (): string => {
    if (!activeTab) return "";
    const enabledHeaders = activeTab.headers.filter(h => h.enabled && h.key.trim());

    if (snippetLanguage === "curl") {
      let cmd = `curl -X ${activeTab.method} '${activeTab.url}'`;
      enabledHeaders.forEach(h => {
        cmd += ` \\\n  -H '${h.key}: ${h.value}'`;
      });
      if (activeTab.body_type !== "none" && activeTab.body_content) {
        cmd += ` \\\n  -d '${activeTab.body_content}'`;
      }
      return cmd;
    } else if (snippetLanguage === "fetch") {
      let code = `fetch('${activeTab.url}', {\n  method: '${activeTab.method}',\n`;
      if (enabledHeaders.length > 0) {
        code += `  headers: {\n`;
        enabledHeaders.forEach(h => {
          code += `    '${h.key}': '${h.value}',\n`;
        });
        code += `  },\n`;
      }
      if (activeTab.body_type !== "none" && activeTab.body_content) {
        code += `  body: ${JSON.stringify(activeTab.body_content)},\n`;
      }
      code += `})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`;
      return code;
    } else {
      let code = `import requests\n\n`;
      code += `response = requests.${activeTab.method.toLowerCase()}(\n  '${activeTab.url}',\n`;
      if (enabledHeaders.length > 0) {
        code += `  headers={\n`;
        enabledHeaders.forEach(h => {
          code += `    '${h.key}': '${h.value}',\n`;
        });
        code += `  },\n`;
      }
      if (activeTab.body_type !== "none" && activeTab.body_content) {
        code += `  data='${activeTab.body_content}',\n`;
      }
      code += `)\nprint(response.json())`;
      return code;
    }
  };

  // ============================
  // FILTERED DATA
  // ============================
  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.requests.some((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredHistory = state.history.filter((h) =>
    h.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEnvironments = state.environments.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    // Helpers
    addToast,
    loadAllData,
    // Auth
    handleLogin,
    handleSignOut,
    handleQuickSignIn,
    // Resizing
    handleSidebarResizeStart,
    handleResponseResizeStart,
    // Renaming
    handleRenameCollection,
    handleRenameRequest,
    // Tabs
    activeTab,
    createNewTab,
    closeTab,
    updateActiveTab,
    // URL & Params
    handleUrlChange,
    handleParamChange,
    handleHeaderChange,
    toggleParam,
    toggleHeader,
    removeParamRow,
    removeHeaderRow,
    // Send
    handleSend,
    handleSaveClick,
    saveRequestToDB,
    // Collections
    handleCreateCollection,
    handleDeleteCollection,
    // Load requests
    loadSavedRequest,
    loadHistoryItem,
    // Environments
    handleOpenEditEnv,
    handleSaveEnvironment,
    handleDeleteEnvironment,
    // Workspaces
    handleSelectWorkspace,
    // AI Chat
    handleHomeChatSubmit,
    handleWorkspaceChatSubmit,
    handleChatActionClick,
    // Search
    handleTypeSelect,
    handleOrgToggle,
    // Snippet
    generateSnippet,
    // Filtered data
    filteredCollections,
    filteredHistory,
    filteredEnvironments,
  };
}

export type AppHandlers = ReturnType<typeof useAppHandlers>;
