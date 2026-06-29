"use client";

import { useAppState } from "../hooks/useAppState";
import { useAppHandlers } from "../hooks/useAppHandlers";

// Sub-components
import { ToastContainer } from "../components/ToastContainer";
import { LoginView } from "../components/LoginView";
import { Header } from "../components/Header";
import { HomeView } from "../components/HomeView";
import { WorkspaceBuilderView } from "../components/WorkspaceBuilderView";
import { Modals } from "../components/Modals";
import { Footer } from "../components/Footer";

export default function PostmanClone() {
  const state = useAppState();
  const handlers = useAppHandlers(state);

  // ============================
  // RENDER: LOGIN VIEW
  // ============================
  if (!state.isSignedIn) {
    return (
      <LoginView
        loginEmail={state.loginEmail}
        setLoginEmail={state.setLoginEmail}
        loginPassword={state.loginPassword}
        setLoginPassword={state.setLoginPassword}
        handleLogin={handlers.handleLogin}
        onQuickSignIn={handlers.handleQuickSignIn}
      />
    );
  }

  // ============================
  // RENDER: MAIN APP
  // ============================
  return (
    <div className="workspace-container" onClick={() => {
      state.setShowProfileDropdown(false);
      state.setShowWorkspaceDropdown(false);
      state.setShowSearchDropdown(false);
      state.setActiveFilterDropdown("none");
      state.setShowHomeDropdown(false);
      state.setShowWorkspaceFilterDropdown(false);
    }}>

      {/* Persisted Top Navigation Header */}
      <Header
        currentView={state.currentView}
        setCurrentView={state.setCurrentView}
        homeSidebarTab={state.homeSidebarTab}
        setHomeSidebarTab={state.setHomeSidebarTab}
        workspaces={state.workspaces}
        activeWorkspace={state.activeWorkspace}
        handleSelectWorkspace={handlers.handleSelectWorkspace}
        showHomeDropdown={state.showHomeDropdown}
        setShowHomeDropdown={state.setShowHomeDropdown}
        showWorkspaceDropdown={state.showWorkspaceDropdown}
        setShowWorkspaceDropdown={state.setShowWorkspaceDropdown}
        showProfileDropdown={state.showProfileDropdown}
        setShowProfileDropdown={state.setShowProfileDropdown}
        showSearchDropdown={state.showSearchDropdown}
        setShowSearchDropdown={state.setShowSearchDropdown}
        activeFilterDropdown={state.activeFilterDropdown}
        setActiveFilterDropdown={state.setActiveFilterDropdown}
        searchFilters={state.searchFilters}
        handleTypeSelect={handlers.handleTypeSelect}
        handleOrgToggle={handlers.handleOrgToggle}
        handleSignOut={handlers.handleSignOut}
        setSidebarTab={state.setSidebarTab}
        searchInputRef={state.searchInputRef}
      />

      {/* Main Workspace container */}
      <div className="main-content">

        {/* --- VIEW 1 & VIEW 2: HOME PAGE & WORKSPACES VIEW WITH PERSISTENT SIDEBARS --- */}
        {(state.currentView === "home" || state.currentView === "workspaces") && (
          <HomeView
            currentView={state.currentView}
            setCurrentView={state.setCurrentView}
            homeSidebarTab={state.homeSidebarTab}
            setHomeSidebarTab={state.setHomeSidebarTab}
            workspaces={state.workspaces}
            setWorkspaces={state.setWorkspaces}
            workspacesSubTab={state.workspacesSubTab}
            setWorkspacesSubTab={state.setWorkspacesSubTab}
            workspaceSearchQuery={state.workspaceSearchQuery}
            setWorkspaceSearchQuery={state.setWorkspaceSearchQuery}
            showWorkspaceFilterDropdown={state.showWorkspaceFilterDropdown}
            setShowWorkspaceFilterDropdown={state.setShowWorkspaceFilterDropdown}
            workspaceFilters={state.workspaceFilters}
            setWorkspaceFilters={state.setWorkspaceFilters}
            selectedWorkspaceIds={state.selectedWorkspaceIds}
            setSelectedWorkspaceIds={state.setSelectedWorkspaceIds}
            handleSelectWorkspace={handlers.handleSelectWorkspace}
            handleDeleteWorkspaces={handlers.handleDeleteWorkspaces}
            handleCreateWorkspace={handlers.handleCreateWorkspace}
            handleHomeChatSubmit={handlers.handleHomeChatSubmit}
            homeChatbarInput={state.homeChatbarInput}
            setHomeChatbarInput={state.setHomeChatbarInput}
            addToast={handlers.addToast}
            setSidebarTab={state.setSidebarTab}
          />
        )}

        {/* --- VIEW 3: WORKSPACE BUILDER --- */}
        {state.currentView === "workspace" && (
          <WorkspaceBuilderView
            sidebarWidth={state.sidebarWidth}
            sidebarMainTab={state.sidebarMainTab}
            setSidebarMainTab={state.setSidebarMainTab}
            searchQuery={state.searchQuery}
            setSearchQuery={state.setSearchQuery}
            setModals={state.setModals}
            collectionsExpanded={state.collectionsExpanded}
            setCollectionsExpanded={state.setCollectionsExpanded}
            filteredCollections={handlers.filteredCollections}
            editingCollectionId={state.editingCollectionId}
            setEditingCollectionId={state.setEditingCollectionId}
            renameInputVal={state.renameInputVal}
            setRenameInputVal={state.setRenameInputVal}
            handleRenameCollection={handlers.handleRenameCollection}
            handleDeleteCollection={handlers.handleDeleteCollection}
            filteredHistory={handlers.filteredHistory}
            clearHistory={handlers.handleClearHistory}
            loadAllData={handlers.loadAllData}
            loadHistoryItem={handlers.loadHistoryItem}
            loadSavedRequest={handlers.loadSavedRequest}
            editingRequestId={state.editingRequestId}
            setEditingRequestId={state.setEditingRequestId}
            handleRenameRequest={handlers.handleRenameRequest}
            deleteSavedRequest={async (id: number) => {
              const { deleteSavedRequest: deleteAPI } = await import("../utils/requests");
              await deleteAPI(id);
            }}
            environmentsExpanded={state.environmentsExpanded}
            setEnvironmentsExpanded={state.setEnvironmentsExpanded}
            filteredEnvironments={handlers.filteredEnvironments}
            handleOpenEditEnv={handlers.handleOpenEditEnv}
            handleDeleteEnvironment={handlers.handleDeleteEnvironment}
            specsExpanded={state.specsExpanded}
            setSpecsExpanded={state.setSpecsExpanded}
            flowsExpanded={state.flowsExpanded}
            setFlowsExpanded={state.setFlowsExpanded}
            handleSidebarResizeStart={handlers.handleSidebarResizeStart}
            tabs={state.tabs}
            setTabs={state.setTabs}
            activeTabId={state.activeTabId}
            setActiveTabId={state.setActiveTabId}
            createNewTab={handlers.createNewTab}
            closeTab={handlers.closeTab}
            activeWorkspace={state.activeWorkspace?.name || ""}
            activeWorkspaceId={state.activeWorkspace?.id || 1}
            selectedEnvId={state.selectedEnvId}
            setSelectedEnvId={state.setSelectedEnvId}
            environments={state.environments}
            showEnvQuickLook={state.showEnvQuickLook}
            setShowEnvQuickLook={state.setShowEnvQuickLook}
            showAIChat={state.showAIChat}
            setShowAIChat={state.setShowAIChat}
            updateActiveTab={handlers.updateActiveTab}
            handleUrlChange={handlers.handleUrlChange}
            handleSend={handlers.handleSend}
            handleSaveClick={handlers.handleSaveClick}
            builderSubTab={state.builderSubTab}
            setBuilderSubTab={state.setBuilderSubTab}
            toggleParam={handlers.toggleParam}
            handleParamChange={handlers.handleParamChange}
            removeParamRow={handlers.removeParamRow}
            toggleHeader={handlers.toggleHeader}
            handleHeaderChange={handlers.handleHeaderChange}
            removeHeaderRow={handlers.removeHeaderRow}
            snippetLanguage={state.snippetLanguage}
            setSnippetLanguage={state.setSnippetLanguage}
            generateSnippet={handlers.generateSnippet}
            handleResponseResizeStart={handlers.handleResponseResizeStart}
            responseHeight={state.responseHeight}
            responseSubTab={state.responseSubTab}
            setResponseSubTab={state.setResponseSubTab}
            chatMessages={state.chatMessages}
            handleWorkspaceChatSubmit={handlers.handleWorkspaceChatSubmit}
            aiChatInput={state.aiChatInput}
            setAiChatInput={state.setAiChatInput}
            handleChatActionClick={handlers.handleChatActionClick}
            searchInputRef={state.searchInputRef}
            addToast={handlers.addToast}
          />
        )}
      </div>

      {/* Persisted Bottom Footer */}
      <Footer />

      {/* --- MODALS --- */}
      <Modals
        modals={state.modals}
        setModals={state.setModals}
        modalInputs={state.modalInputs}
        setModalInputs={state.setModalInputs}
        collections={state.collections}
        handleCreateCollection={handlers.handleCreateCollection}
        handleSaveEnvironment={handlers.handleSaveEnvironment}
        saveRequestToDB={handlers.saveRequestToDB}
      />

      {/* --- TOASTS --- */}
      <ToastContainer toasts={state.toasts} setToasts={state.setToasts} />
    </div>
  );
}
