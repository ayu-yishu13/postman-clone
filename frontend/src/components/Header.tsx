import React from "react";
import { WorkspaceItem } from "../app/types";

interface HeaderProps {
  currentView: "home" | "workspaces" | "workspace";
  setCurrentView: (v: "home" | "workspaces" | "workspace") => void;
  homeSidebarTab: string;
  setHomeSidebarTab: (t: any) => void;
  workspaces: WorkspaceItem[];
  activeWorkspace: WorkspaceItem | null;
  handleSelectWorkspace: (wId: number) => void;
  showHomeDropdown: boolean;
  setShowHomeDropdown: (b: boolean) => void;
  showWorkspaceDropdown: boolean;
  setShowWorkspaceDropdown: (b: boolean) => void;
  showProfileDropdown: boolean;
  setShowProfileDropdown: (b: boolean) => void;
  showSearchDropdown: boolean;
  setShowSearchDropdown: (b: boolean) => void;
  activeFilterDropdown: "none" | "type" | "org";
  setActiveFilterDropdown: (f: "none" | "type" | "org") => void;
  searchFilters: { type: string; org: string };
  handleTypeSelect: (type: string) => void;
  handleOrgToggle: (org: string) => void;
  handleSignOut: () => void;
  setSidebarTab: (t: any) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  homeSidebarTab,
  setHomeSidebarTab,
  workspaces,
  activeWorkspace,
  handleSelectWorkspace,
  showHomeDropdown,
  setShowHomeDropdown,
  showWorkspaceDropdown,
  setShowWorkspaceDropdown,
  showProfileDropdown,
  setShowProfileDropdown,
  showSearchDropdown,
  setShowSearchDropdown,
  activeFilterDropdown,
  setActiveFilterDropdown,
  searchFilters,
  handleTypeSelect,
  handleOrgToggle,
  handleSignOut,
  setSidebarTab,
  searchInputRef,
}) => {
  return (
    <header className="top-nav">
      <div className="top-nav-left">
        {/* Brand Logo */}
        <div 
          style={{ display: "flex", alignItems: "center", marginRight: "4px", cursor: "pointer" }} 
          title="Postman Clone"
          onClick={() => { setCurrentView("home"); setHomeSidebarTab("home"); }}
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#FF6C37"/>
            <path d="M16 6C13.5 10.5 10.5 15.5 10.5 19C10.5 22 13 24.5 16 24.5C19 24.5 21.5 22 21.5 19C21.5 15.5 18.5 10.5 16 6Z" fill="white"/>
            <circle cx="16" cy="16" r="2.5" fill="#FF6C37"/>
          </svg>
        </div>

        {/* Home button with dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            className={`workspace-dropdown-btn ${currentView === "home" ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowHomeDropdown(!showHomeDropdown);
              setShowWorkspaceDropdown(false);
              setShowProfileDropdown(false);
              setShowSearchDropdown(false);
            }}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <span>Home</span>
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          {showHomeDropdown && (
            <div 
              className="profile-dropdown" 
              style={{ 
                left: 0, 
                right: "auto", 
                width: "240px", 
                maxHeight: "360px", 
                overflowY: "auto",
                padding: "6px 0",
                zIndex: 1100
              }} 
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={`profile-dropdown-item ${currentView === "home" && homeSidebarTab === "home" ? "active" : ""}`} 
                onClick={() => { setCurrentView("home"); setHomeSidebarTab("home"); setShowHomeDropdown(false); }}
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Home
              </div>
              <div 
                className={`profile-dropdown-item ${currentView === "workspaces" ? "active" : ""}`} 
                onClick={() => { setCurrentView("workspaces"); setHomeSidebarTab("workspaces"); setShowHomeDropdown(false); }}
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                Workspaces
              </div>
              <div 
                className="profile-dropdown-item" 
                onClick={() => { setShowHomeDropdown(false); }}
                style={{ display: "flex", gap: "8px", alignItems: "center", opacity: 0.6 }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                Application Inventory
              </div>
              <div 
                className="profile-dropdown-item" 
                onClick={() => { setShowHomeDropdown(false); }}
                style={{ display: "flex", gap: "8px", alignItems: "center", opacity: 0.6 }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                API Catalog
              </div>
              <div className="profile-dropdown-divider"></div>
              <div 
                className="profile-dropdown-item" 
                onClick={() => { setShowHomeDropdown(false); }}
                style={{ display: "flex", gap: "8px", alignItems: "center", opacity: 0.6 }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Private API Network
              </div>
              <div 
                className="profile-dropdown-item" 
                onClick={() => { setShowHomeDropdown(false); }}
                style={{ display: "flex", gap: "8px", alignItems: "center", opacity: 0.6 }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Public API Network
              </div>
              <div className="profile-dropdown-divider"></div>
              <div 
                className="profile-dropdown-item" 
                onClick={() => { setShowHomeDropdown(false); }}
                style={{ display: "flex", gap: "8px", alignItems: "center", opacity: 0.6 }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                Integrations
              </div>
              <div 
                className="profile-dropdown-item" 
                onClick={() => { setShowHomeDropdown(false); }}
                style={{ display: "flex", gap: "8px", alignItems: "center", opacity: 0.6 }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                Reports
              </div>
            </div>
          )}
        </div>
        
        {/* Workspaces dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            className={`workspace-dropdown-btn ${currentView === "workspace" || currentView === "workspaces" ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowWorkspaceDropdown(!showWorkspaceDropdown);
              setShowHomeDropdown(false);
              setShowProfileDropdown(false);
              setShowSearchDropdown(false);
            }}
          >
            <span>Workspaces</span>
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          {showWorkspaceDropdown && (
            <div className="profile-dropdown" style={{ left: 0, right: "auto", width: "240px" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ padding: "8px 12px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Workspaces</div>
              {workspaces.map((w, idx) => (
                <div 
                  key={idx} 
                  className="profile-dropdown-item"
                  onClick={() => handleSelectWorkspace(w.id)}
                  style={{ fontWeight: activeWorkspace?.id === w.id ? 600 : 400 }}
                >
                  <span>{w.name} ({w.type})</span>
                </div>
              ))}
              <div className="profile-dropdown-divider"></div>
              <div 
                className="profile-dropdown-item"
                style={{ color: "var(--accent-color)", fontWeight: 500 }}
                onClick={() => {
                  setCurrentView("workspaces");
                  setShowWorkspaceDropdown(false);
                }}
              >
                View all workspaces
              </div>
            </div>
          )}
        </div>

        {/* API Network & Explore buttons matching Postman */}
        <button 
          className="workspace-dropdown-btn" 
          style={{ opacity: 0.8, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
          onClick={() => alert("API Network is a placeholder")}
        >
          <span>API Network</span>
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <button 
          className="workspace-dropdown-btn" 
          style={{ opacity: 0.8, fontSize: "12px" }}
          onClick={() => alert("Explore is a placeholder")}
        >
          <span>Explore</span>
        </button>
      </div>

      {/* Global Search Bar with overlay dropdown */}
      <div className="top-nav-center" onClick={(e) => e.stopPropagation()}>
        <div className="search-bar-container">
          <span className="search-magnifier-icon">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search" 
            className="header-search-bar" 
            onFocus={() => {
              setShowSearchDropdown(true);
              setShowProfileDropdown(false);
              setShowWorkspaceDropdown(false);
            }}
          />

          {showSearchDropdown && (
            <div className="search-dropdown-overlay" style={{ left: "-180px" }}>
              <div className="search-overlay-filters">
                <button className="filter-pill-btn">Visibility v</button>
                
                {/* Type Filter */}
                <div style={{ position: "relative" }}>
                  <button 
                    className={`filter-pill-btn ${searchFilters.type !== "All" ? "active" : ""}`}
                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === "type" ? "none" : "type")}
                  >
                    Type: {searchFilters.type} v
                  </button>
                  {activeFilterDropdown === "type" && (
                    <div className="profile-dropdown" style={{ left: 0, width: "160px", top: "26px", padding: "4px 0" }}>
                      {["All", "Workspace", "Collection", "Request", "Environment", "Specs", "Flow", "Publisher"].map(t => (
                        <div key={t} className="search-opt-row" onClick={() => handleTypeSelect(t)}>
                          {searchFilters.type === t ? "✓ " : ""} {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="filter-pill-btn">In v</button>
                <button className="filter-pill-btn">By v</button>

                {/* Org Filter */}
                <div style={{ position: "relative" }}>
                  <button 
                    className="filter-pill-btn active"
                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === "org" ? "none" : "org")}
                  >
                    Org: {searchFilters.org} v
                  </button>
                  {activeFilterDropdown === "org" && (
                    <div className="profile-dropdown" style={{ left: 0, width: "240px", top: "26px", padding: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", paddingLeft: "6px" }}>Organizations</div>
                      {[
                        "Ayush Kumar Rai's Team", "LinkedIn", "Salesforce Developers", 
                        "X", "Meta", "Cisco", "Notion", "Twilio", 
                        "Cisco Meraki", "Zoom Developer", "PayPal"
                      ].map(o => (
                        <div key={o} className="search-opt-row" onClick={() => handleOrgToggle(o)} style={{ display: "flex", gap: "8px" }}>
                          <input type="checkbox" readOnly checked={searchFilters.org === o} className="search-opt-checkbox" />
                          <span>{o}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="search-overlay-content">
                <div className="search-recent-viewed">
                  <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Recently Viewed</div>
                  <div className="search-opt-row" onClick={() => {
                    const ws = workspaces.find(w => w.name === "Ayush Kumar Rai's Workspace");
                    if (ws) handleSelectWorkspace(ws.id);
                  }}>
                    <span>Workspace: Ayush Kumar Rai's Workspace (Internal)</span>
                  </div>
                  <div className="search-opt-row" onClick={() => {
                    const ws = workspaces.find(w => w.name === "AYUSH");
                    if (ws) handleSelectWorkspace(ws.id);
                  }}>
                    <span>Workspace: AYUSH (Public)</span>
                  </div>
                  <div className="search-opt-row" onClick={() => { setCurrentView("workspace"); setSidebarTab("collections"); }}>
                    <span>Collection: SignSetu QA — Ayush Kumar Rai</span>
                  </div>
                  <div className="search-opt-row" onClick={() => { setCurrentView("workspace"); setSidebarTab("collections"); }}>
                    <span>Collection: New Collection</span>
                  </div>
                  <div className="search-opt-row" onClick={() => { setCurrentView("workspace"); setSidebarTab("collections"); }}>
                    <span>Collection: My Collection</span>
                  </div>
                </div>

                <div className="search-filter-options-pane" style={{ backgroundColor: "#171717" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", textAlign: "center", marginTop: "40px" }}>
                    Search workspaces, collections, and requests
                  </div>
                </div>
              </div>

              <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border-color)", fontSize: "11px", color: "var(--text-secondary)", cursor: "pointer" }}>
                Show and run commands &gt;
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Header Right Menu */}
      <div className="top-nav-right">
        <button className="upgrade-btn-orange">Upgrade</button>
        
        <button className="action-btn-icon" style={{ fontSize: "14px" }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>

        <button className="action-btn-icon" style={{ fontSize: "14px" }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><circle cx="19" cy="12" r="3"></circle><circle cx="5" cy="12" r="3"></circle></svg>
        </button>

        {/* User profile dropdown triggers avatar dropdown */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              backgroundColor: "#5c6bc0",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileDropdown(!showProfileDropdown);
              setShowWorkspaceDropdown(false);
              setShowSearchDropdown(false);
            }}
          >
            A
          </div>

          {/* Profile Dropdown matching Screenshot 1 */}
          {showProfileDropdown && (
            <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="profile-dropdown-header">
                <div className="profile-avatar-large" style={{ backgroundColor: "#5c6bc0" }}>A</div>
                <div className="profile-info">
                  <span className="profile-name">Ayush Kumar Rai</span>
                  <span className="profile-email">ayushrai.ju13@gmail.com</span>
                </div>
              </div>

              <div className="profile-dropdown-team">
                <span className="profile-team-name">Ayush Kumar Rai's Team</span>
                <span className="profile-team-plan">Free plan</span>
              </div>

              <div className="profile-dropdown-item">
                <span>Switch to</span>
                <span>&gt;</span>
              </div>
              <div className="profile-dropdown-item">
                <span>Billing & resource usage</span>
              </div>
              <div className="profile-dropdown-item">
                <span>Public elements</span>
              </div>
              <div className="profile-dropdown-item">
                <span>Postman keys</span>
              </div>
              <div className="profile-dropdown-item">
                <span>Audit logs</span>
              </div>
              
              <div className="profile-dropdown-divider"></div>
              
              <div className="profile-dropdown-item" onClick={handleSignOut} style={{ color: "var(--method-delete)", fontWeight: 500 }}>
                Sign out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
