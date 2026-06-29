import React from "react";
import { WorkspaceItem } from "../app/types";

interface HomeViewProps {
  currentView: "home" | "workspaces" | "workspace";
  setCurrentView: (v: "home" | "workspaces" | "workspace") => void;
  homeSidebarTab: string;
  setHomeSidebarTab: (t: any) => void;
  workspaces: WorkspaceItem[];
  setWorkspaces: React.Dispatch<React.SetStateAction<WorkspaceItem[]>>;
  workspacesSubTab: "all" | "project" | "external";
  setWorkspacesSubTab: (t: "all" | "project" | "external") => void;
  workspaceSearchQuery: string;
  setWorkspaceSearchQuery: (q: string) => void;
  showWorkspaceFilterDropdown: boolean;
  setShowWorkspaceFilterDropdown: (b: boolean) => void;
  workspaceFilters: {
    type: { internal: boolean; public: boolean; partner: boolean };
    access: { inviteOnly: boolean; team: boolean; partnerOnly: boolean; internet: boolean };
  };
  setWorkspaceFilters: React.Dispatch<React.SetStateAction<{
    type: { internal: boolean; public: boolean; partner: boolean };
    access: { inviteOnly: boolean; team: boolean; partnerOnly: boolean; internet: boolean };
  }>>;
  selectedWorkspaceIds: number[];
  setSelectedWorkspaceIds: (ids: number[]) => void;
  handleSelectWorkspace: (wId: number) => void;
  handleDeleteWorkspaces?: (ids: number[]) => void;
  handleCreateWorkspace?: () => void;
  handleHomeChatSubmit: (e?: React.FormEvent) => void;
  homeChatbarInput: string;
  setHomeChatbarInput: (val: string) => void;
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
  setSidebarTab: (t: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentView,
  setCurrentView,
  homeSidebarTab,
  setHomeSidebarTab,
  workspaces,
  setWorkspaces,
  workspacesSubTab,
  setWorkspacesSubTab,
  workspaceSearchQuery,
  setWorkspaceSearchQuery,
  showWorkspaceFilterDropdown,
  setShowWorkspaceFilterDropdown,
  workspaceFilters,
  setWorkspaceFilters,
  selectedWorkspaceIds,
  setSelectedWorkspaceIds,
  handleSelectWorkspace,
  handleDeleteWorkspaces,
  handleCreateWorkspace,
  handleHomeChatSubmit,
  homeChatbarInput,
  setHomeChatbarInput,
  addToast,
  setSidebarTab,
}) => {
  const fullText = "Hi there! 👋 Tell me what you're working on and I'll help you get started with Postman. I can help create requests, debug calls, generate tests, and more.";
  const [animatedText, setAnimatedText] = React.useState("");

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setAnimatedText((prev) => {
        const next = fullText.slice(0, index + 1);
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
        }
        return next;
      });
    }, 12);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-layout">
      <aside className="home-sidebar">
        {/* Left Sidebar top team card matching Screenshot 1 */}
        <div className="home-sidebar-team-card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="team-avatar-purple">A</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>Ayush Kumar Rai's T...</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>1 member</span>
            </div>
          </div>
          <button className="team-invite-btn">Invite</button>
        </div>

        <div 
          className={`home-sidebar-item ${currentView === "home" ? "active" : ""}`}
          onClick={() => {
            setCurrentView("home");
            setHomeSidebarTab("home");
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </div>
        <div 
          className={`home-sidebar-item ${currentView === "workspaces" ? "active" : ""}`}
          onClick={() => {
            setCurrentView("workspaces");
            setHomeSidebarTab("workspaces");
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          Workspaces
        </div>
        <div className="home-sidebar-item" style={{ opacity: 0.6 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
          Application Inventory
        </div>
        <div className="home-sidebar-item" style={{ opacity: 0.6 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
          API Catalog
        </div>
        <div className="profile-dropdown-divider"></div>
        <div className="home-sidebar-item" style={{ opacity: 0.6 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Private API Network
        </div>
        <div className="home-sidebar-item" style={{ opacity: 0.6 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Public API Network
        </div>
        <div className="profile-dropdown-divider"></div>
        <div className="home-sidebar-item" style={{ opacity: 0.6 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          Integrations
        </div>
        <div className="home-sidebar-item" style={{ opacity: 0.6 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Reports
        </div>

        {/* Bottom links on sidebar matching Screenshot 1 */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px", padding: "12px 8px" }}>
          <span className="home-footer-link">What is Postman ↗</span>
          <span className="home-footer-link">How to Publish ↗</span>
          <span className="home-footer-link">Learning Center ↗</span>
          <span className="home-footer-link">Support Center ↗</span>
          <span className="home-footer-link">Postman Enterprise ↗</span>
          <span className="home-footer-link">Download Desktop App ↗</span>
        </div>
      </aside>

      {/* Split layout: Welcome Main OR Workspaces List + Right sidebar Needs Attention */}
      <div className="home-main-layout" style={{ gap: currentView === "workspaces" ? 0 : "24px" }}>
        {currentView === "home" ? (
          <>
            <main className="home-main">
              <h2 className="home-title">Ayush Kumar Rai, how would you like to use Postman today?</h2>
              
              {/* AI assistant section matching Screenshot 1 */}
              <form className="assistant-card" onSubmit={handleHomeChatSubmit}>
                <span className="assistant-icon-mesh">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>
                </span>
                <div className="assistant-content">
                  <span className="assistant-text" style={{ minHeight: "38px", display: "block" }}>
                    {animatedText}
                    {animatedText.length < fullText.length && <span className="typing-caret">|</span>}
                  </span>

                  <div className="assistant-suggestions">
                    <div className="assistant-suggestions-title">Suggestions to get started with:</div>
                    <div className="assistant-suggestion-item" onClick={() => setHomeChatbarInput("I want to create a new API from scratch")}>
                      I want to create a new API from scratch
                    </div>
                    <div className="assistant-suggestion-item" onClick={() => setHomeChatbarInput("I want to import and manage my existing API in Postman")}>
                      I want to import and manage my existing API in Postman
                    </div>
                    <div className="assistant-suggestion-item" onClick={() => setHomeChatbarInput("I want to explore and integrate third-party APIs")}>
                      I want to explore and integrate third-party APIs
                    </div>
                  </div>

                  <div className="assistant-input-row">
                    <input 
                      type="text" 
                      placeholder="Tell us what you want to build..." 
                      className="assistant-input" 
                      value={homeChatbarInput}
                      onChange={(e) => setHomeChatbarInput(e.target.value)}
                    />
                    <button type="submit" className="assistant-btn">Let's Go</button>
                  </div>
                </div>
              </form>

              {/* Pick up where you left off matching Screenshot 1 */}
              <div className="recents-section">
                <div className="recents-header-row">
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Pick up where you left off</span>
                  <div className="recents-segmented-tabs">
                    <div className="recents-segmented-tab active">Recents</div>
                    <div className="recents-segmented-tab">Favorites</div>
                  </div>
                </div>

                <div className="recents-list-container">
                  {/* Row 1: Workspace */}
                  <div className="recent-row" onClick={() => {
                    const ws = workspaces.find(w => w.name === "Ayush Kumar Rai's Workspace");
                    if (ws) handleSelectWorkspace(ws.id);
                  }}>
                    <span className="recent-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </span>
                    <div className="recent-name-group">
                      <span className="recent-name">Ayush Kumar Rai's Workspace</span>
                    </div>
                  </div>

                  {/* Row 2: Collection */}
                  <div className="recent-row" onClick={() => { setCurrentView("workspace"); setSidebarTab("collections"); }}>
                    <span className="recent-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </span>
                    <div className="recent-name-group">
                      <span className="recent-name" style={{ color: "var(--text-primary)" }}>My Collection</span>
                      <span className="recent-parent-workspace">• Ayush Kumar Rai's Workspace</span>
                    </div>
                  </div>

                  {/* Row 3: Request */}
                  <div className="recent-row" onClick={() => { setCurrentView("workspace"); setSidebarTab("history"); }}>
                    <span className="recent-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    </span>
                    <div className="recent-name-group">
                      <span className="recent-name" style={{ color: "var(--text-primary)" }}>Post data</span>
                      <span className="recent-parent-workspace">• Ayush Kumar Rai's Workspace</span>
                    </div>
                  </div>

                  {/* Row 4: Request */}
                  <div className="recent-row" onClick={() => { setCurrentView("workspace"); setSidebarTab("history"); }}>
                    <span className="recent-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    </span>
                    <div className="recent-name-group">
                      <span className="recent-name" style={{ color: "var(--text-primary)" }}>Get data</span>
                      <span className="recent-parent-workspace">• Ayush Kumar Rai's Workspace</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Right Sidebar: Needs Attention (Screenshot 1) */}
            <aside className="needs-attention-col">
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Needs your attention</span>
              <div className="attention-card">
                <span style={{ fontSize: "28px" }}>🎉</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>All caught up!</span>
                <p style={{ color: "var(--text-secondary)", fontSize: "11px", lineHeight: "1.4", margin: 0 }}>
                  Requests to access, edit, and take action on resources, PRs raised by you and ones that require your review, plus other actions that need your attention will appear here.
                </p>
              </div>
            </aside>
          </>
        ) : (
          <main className="home-main" style={{ padding: "24px 32px", display: "flex", flexDirection: "column", flex: 1, maxWidth: "100%", overflowY: "auto", position: "relative" }}>
            {/* workspaces list view */}
            <div className="workspaces-header">
              <h2 className="workspaces-title" style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>Workspaces</h2>
              <button className="upgrade-btn-orange" style={{ padding: "8px 16px", borderRadius: "4px", fontSize: "12px", height: "auto" }} onClick={handleCreateWorkspace}>
                Create workspace
              </button>
            </div>

            {/* Tabs matching 2nd screenshot */}
            <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", margin: "16px 0" }}>
              <div style={{ display: "flex", gap: "2px", backgroundColor: "#242424", padding: "2px", borderRadius: "6px" }}>
                <div 
                  className={`recents-segmented-tab ${workspacesSubTab === "all" ? "active" : ""}`} 
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setWorkspacesSubTab("all");
                    setSelectedWorkspaceIds([]);
                  }}
                >
                  All
                </div>
                <div 
                  className={`recents-segmented-tab ${workspacesSubTab === "project" ? "active" : ""}`} 
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setWorkspacesSubTab("project");
                    setSelectedWorkspaceIds([]);
                  }}
                >
                  Project Workspaces
                </div>
                <div 
                  className={`recents-segmented-tab ${workspacesSubTab === "external" ? "active" : ""}`} 
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setWorkspacesSubTab("external");
                    setSelectedWorkspaceIds([]);
                  }}
                >
                  External
                </div>
              </div>
            </div>

            {/* Filter row matching 2nd screenshot */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px", position: "relative" }}>
              <div style={{ position: "relative", width: "320px" }}>
                <input 
                  type="text" 
                  placeholder="Search workspaces" 
                  className="search-bar" 
                  style={{ paddingLeft: "28px" }} 
                  value={workspaceSearchQuery}
                  onChange={(e) => setWorkspaceSearchQuery(e.target.value)}
                />
                <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
              </div>
              <button 
                className={`action-btn-icon ${showWorkspaceFilterDropdown ? "active" : ""}`} 
                style={{ 
                  width: "32px", 
                  height: "32px", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "4px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  backgroundColor: showWorkspaceFilterDropdown ? "rgba(255, 255, 255, 0.1)" : "transparent"
                }} 
                title="Filters"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWorkspaceFilterDropdown(!showWorkspaceFilterDropdown);
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              </button>

              {/* Filter Dropdown Popover */}
              {showWorkspaceFilterDropdown && (
                <div className="profile-dropdown" style={{ 
                  position: "absolute", 
                  left: "328px", 
                  top: "40px", 
                  width: "280px", 
                  zIndex: 100,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  backgroundColor: "#1e1e1e",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                }} onClick={(e) => e.stopPropagation()}>
                  
                  {/* Created by */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Created by</span>
                    <select style={{ 
                      backgroundColor: "var(--bg-tertiary)", 
                      border: "1px solid var(--border-color)", 
                      color: "var(--text-primary)", 
                      padding: "6px", 
                      borderRadius: "4px", 
                      fontSize: "12px",
                      outline: "none"
                    }}>
                      <option>Select creators</option>
                      <option>You</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Type</span>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={workspaceFilters.type.internal} 
                        onChange={(e) => setWorkspaceFilters({
                          ...workspaceFilters,
                          type: { ...workspaceFilters.type, internal: e.target.checked }
                        })} 
                      />
                      Internal
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={workspaceFilters.type.public} 
                        onChange={(e) => setWorkspaceFilters({
                          ...workspaceFilters,
                          type: { ...workspaceFilters.type, public: e.target.checked }
                        })} 
                      />
                      Public
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={workspaceFilters.type.partner} 
                        onChange={(e) => setWorkspaceFilters({
                          ...workspaceFilters,
                          type: { ...workspaceFilters.type, partner: e.target.checked }
                        })} 
                      />
                      Partner
                    </label>
                  </div>

                  {/* Access */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Access</span>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={workspaceFilters.access.inviteOnly} 
                        onChange={(e) => setWorkspaceFilters({
                          ...workspaceFilters,
                          access: { ...workspaceFilters.access, inviteOnly: e.target.checked }
                        })} 
                      />
                      Only you and invited people
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={workspaceFilters.access.team} 
                        onChange={(e) => setWorkspaceFilters({
                          ...workspaceFilters,
                          access: { ...workspaceFilters.access, team: e.target.checked }
                        })} 
                      />
                      Everyone in your team
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={workspaceFilters.access.partnerOnly} 
                        onChange={(e) => setWorkspaceFilters({
                          ...workspaceFilters,
                          access: { ...workspaceFilters.access, partnerOnly: e.target.checked }
                        })} 
                      />
                      Only invited partners
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={workspaceFilters.access.internet} 
                        onChange={(e) => setWorkspaceFilters({
                          ...workspaceFilters,
                          access: { ...workspaceFilters.access, internet: e.target.checked }
                        })} 
                      />
                      Anyone on the internet
                    </label>
                  </div>

                  {/* Clear Filters Link */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                    <span 
                      style={{ fontSize: "11px", color: "var(--accent-color)", cursor: "pointer" }}
                      onClick={() => setWorkspaceFilters({
                        type: { internal: false, public: false, partner: false },
                        access: { inviteOnly: false, team: false, partnerOnly: false, internet: false }
                      })}
                    >
                      Clear Filters
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Views based on SubTab */}
            {workspacesSubTab === "project" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "80px 20px", textAlign: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>No workspaces</h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "320px", margin: "0 auto 16px auto", lineHeight: "1.5" }}>
                  A workspace lets you organize and collaborate on APIs.
                </p>
                <button className="sidebar-create-btn" style={{ padding: "6px 16px", fontSize: "12px" }}>Learn More</button>
              </div>
            ) : workspacesSubTab === "external" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "80px 20px", textAlign: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Waiting for the crew... No connections yet!</h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 16px auto", lineHeight: "1.5" }}>
                  When you are invited to join external workspaces by your partners, they will appear here, ready for you to explore and collaborate.
                </p>
                <button className="sidebar-create-btn" style={{ padding: "6px 16px", fontSize: "12px" }}>Learn More</button>
              </div>
            ) : (() => {
              const filteredWorkspaces = workspaces.filter(w => {
                if (workspaceSearchQuery && !w.name.toLowerCase().includes(workspaceSearchQuery.toLowerCase())) {
                  return false;
                }
                const hasTypeFilters = workspaceFilters.type.internal || workspaceFilters.type.public || workspaceFilters.type.partner;
                if (hasTypeFilters) {
                  if (w.type === "Internal" && !workspaceFilters.type.internal) return false;
                  if (w.type === "Public" && !workspaceFilters.type.public) return false;
                  if (w.type !== "Public" && w.type !== "Internal" && !workspaceFilters.type.partner) return false;
                }
                const hasAccessFilters = workspaceFilters.access.inviteOnly || workspaceFilters.access.team || workspaceFilters.access.partnerOnly || workspaceFilters.access.internet;
                if (hasAccessFilters) {
                  if (w.access.includes("Only you") && !workspaceFilters.access.inviteOnly) return false;
                  if (w.access.includes("Everyone in your team") && !workspaceFilters.access.team) return false;
                  if (w.access.includes("Anyone on the internet") && !workspaceFilters.access.internet) return false;
                  if (!w.access.includes("Only you") && !w.access.includes("Everyone") && !w.access.includes("Anyone") && !workspaceFilters.access.partnerOnly) return false;
                }
                return true;
              });

              const allSelected = filteredWorkspaces.length > 0 && filteredWorkspaces.every(w => selectedWorkspaceIds.includes(w.id));

              return (
                <>
                  {/* Selected banner matching Screenshot 1 */}
                  {selectedWorkspaceIds.length > 0 && (
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      backgroundColor: "#18243c", 
                      padding: "8px 12px", 
                      borderRadius: "4px", 
                      marginBottom: "12px",
                      border: "1px solid #1c2e4e"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input 
                          type="checkbox" 
                          checked={true} 
                          onChange={() => setSelectedWorkspaceIds([])} 
                        />
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#90caf9" }}>
                          {selectedWorkspaceIds.length} workspace{selectedWorkspaceIds.length > 1 ? "s" : ""} selected
                        </span>
                        <span 
                          onClick={() => setSelectedWorkspaceIds([])} 
                          style={{ fontSize: "12px", color: "#42a5f5", cursor: "pointer", marginLeft: "8px", textDecoration: "underline" }}
                        >
                          Clear selection
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          className="sidebar-create-btn" 
                          style={{ padding: "4px 12px", fontSize: "11px", borderColor: "rgba(255,255,255,0.15)" }}
                          onClick={() => addToast(`Archived ${selectedWorkspaceIds.length} workspace(s)`, "success")}
                        >
                          Archive
                        </button>
                        <button 
                          className="sidebar-create-btn" 
                          style={{ padding: "4px 12px", fontSize: "11px", backgroundColor: "#d32f2f", borderColor: "#d32f2f", color: "white" }}
                          onClick={() => {
                            if (handleDeleteWorkspaces) {
                              handleDeleteWorkspaces(selectedWorkspaceIds);
                              setSelectedWorkspaceIds([]);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Workspaces Table matching 2nd screenshot */}
                  <table className="workspaces-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>
                          <input 
                            type="checkbox" 
                            checked={allSelected} 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWorkspaceIds(filteredWorkspaces.map(w => w.id));
                              } else {
                                setSelectedWorkspaceIds([]);
                              }
                            }} 
                          />
                        </th>
                        <th style={{ minWidth: "220px" }}>Name</th>
                        <th>Creator</th>
                        <th>Contributors</th>
                        <th>Last Activity</th>
                        <th>Access</th>
                        <th>Your Role</th>
                        <th style={{ width: "80px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorkspaces.map((w, idx) => {
                        let iconSvg;
                        if (w.access === "Anyone on the internet") {
                          iconSvg = (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                          );
                        } else if (w.access === "Everyone in your team") {
                          iconSvg = (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          );
                        } else {
                          iconSvg = (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          );
                        }

                        const visibilityLabel = w.access === "Anyone on the internet" ? "Public" : "Internal";
                        const rowSelected = selectedWorkspaceIds.includes(w.id);

                        return (
                          <tr 
                            key={idx} 
                            onClick={() => handleSelectWorkspace(w.id)}
                            style={{ backgroundColor: rowSelected ? "rgba(24, 36, 60, 0.2)" : "transparent" }}
                          >
                            <td>
                              <input 
                                type="checkbox" 
                                checked={rowSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (rowSelected) {
                                    setSelectedWorkspaceIds(selectedWorkspaceIds.filter(id => id !== w.id));
                                  } else {
                                    setSelectedWorkspaceIds([...selectedWorkspaceIds, w.id]);
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()} 
                              />
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div className="workspace-list-type-box">
                                  {iconSvg}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "13px" }}>{w.name}</span>
                                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{visibilityLabel}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div 
                                  style={{ 
                                    width: "20px", 
                                    height: "20px", 
                                    borderRadius: "50%", 
                                    backgroundColor: "#5c6bc0", 
                                    color: "white", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    fontSize: "10px", 
                                    fontWeight: "bold" 
                                  }}
                                >
                                  A
                                </div>
                                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{w.creator}</span>
                              </div>
                            </td>
                            <td style={{ fontSize: "12px" }}>{w.contributors}</td>
                            <td style={{ fontSize: "12px" }}>{w.last_activity}</td>
                            <td style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{w.access}</td>
                            <td style={{ fontSize: "12px" }}>{w.role}</td>
                            <td>
                              <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
                                <span className="star-outline-icon" style={{ cursor: "pointer", color: "var(--text-muted)" }}>
                                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                </span>
                                <span style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: "14px", fontWeight: "bold" }}>...</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              );
            })()}
          </main>
        )}
      </div>
    </div>
  );
};
