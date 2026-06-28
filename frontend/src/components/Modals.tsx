import React from "react";
import { Collection } from "../utils/requests";

interface ModalsProps {
  modals: {
    createCollection: boolean;
    saveRequest: boolean;
    editEnvironment: boolean;
  };
  setModals: React.Dispatch<React.SetStateAction<{
    createCollection: boolean;
    saveRequest: boolean;
    editEnvironment: boolean;
  }>>;
  modalInputs: {
    collectionName: string;
    requestName: string;
    targetCollectionId: string;
    envName: string;
    envVariables: Array<{ key: string; value: string }>;
    editingEnvId: number | null;
  };
  setModalInputs: React.Dispatch<React.SetStateAction<{
    collectionName: string;
    requestName: string;
    targetCollectionId: string;
    envName: string;
    envVariables: Array<{ key: string; value: string }>;
    editingEnvId: number | null;
  }>>;
  collections: Collection[];
  handleCreateCollection: () => void;
  handleSaveEnvironment: () => void;
  saveRequestToDB: (collectionId: number) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  modals,
  setModals,
  modalInputs,
  setModalInputs,
  collections,
  handleCreateCollection,
  handleSaveEnvironment,
  saveRequestToDB,
}) => {
  return (
    <>
      {/* 1. Create Collection Modal */}
      {modals.createCollection && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span>Create New Collection</span>
              <button
                className="table-action-btn"
                style={{ fontSize: "18px" }}
                onClick={() => setModals((p) => ({ ...p, createCollection: false }))}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Collection Name</label>
                <input
                  type="text"
                  placeholder="e.g. Test Collection"
                  className="form-control"
                  value={modalInputs.collectionName}
                  onChange={(e) =>
                    setModalInputs((prev) => ({ ...prev, collectionName: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateCollection();
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setModals((p) => ({ ...p, createCollection: false }))}
              >
                Cancel
              </button>
              <button className="send-btn" onClick={handleCreateCollection}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Save Request Modal */}
      {modals.saveRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span>Save Request to Collection</span>
              <button
                className="table-action-btn"
                style={{ fontSize: "18px" }}
                onClick={() => setModals((p) => ({ ...p, saveRequest: false }))}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>Request Name</label>
                <input
                  type="text"
                  placeholder="e.g. Get Posts"
                  className="form-control"
                  value={modalInputs.requestName}
                  onChange={(e) =>
                    setModalInputs((prev) => ({ ...prev, requestName: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Select Collection</label>
                {collections.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>
                    No collections. Create one first!
                  </div>
                ) : (
                  <select
                    className="form-control"
                    value={modalInputs.targetCollectionId}
                    onChange={(e) =>
                      setModalInputs((prev) => ({ ...prev, targetCollectionId: e.target.value }))
                    }
                  >
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setModals((p) => ({ ...p, saveRequest: false }))}
              >
                Cancel
              </button>
              <button
                className="send-btn"
                onClick={() => saveRequestToDB(Number(modalInputs.targetCollectionId))}
                disabled={collections.length === 0}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Create / Edit Environment Modal */}
      {modals.editEnvironment && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: "600px" }}>
            <div className="modal-header">
              <span>{modalInputs.editingEnvId ? "Edit Environment" : "New Environment"}</span>
              <button
                className="table-action-btn"
                style={{ fontSize: "18px" }}
                onClick={() => setModals((p) => ({ ...p, editEnvironment: false }))}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>Environment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Production"
                  className="form-control"
                  value={modalInputs.envName}
                  onChange={(e) =>
                    setModalInputs((prev) => ({ ...prev, envName: e.target.value }))
                  }
                />
              </div>

              <h4 style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Variables
              </h4>
              <table className="kv-table">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Variable (Key)</th>
                    <th>Value</th>
                    <th style={{ width: "40px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {modalInputs.envVariables.map((v, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          placeholder="Key"
                          className="kv-input"
                          value={v.key}
                          onChange={(e) => {
                            const updated = [...modalInputs.envVariables];
                            updated[idx].key = e.target.value;
                            if (idx === updated.length - 1 && e.target.value) {
                              updated.push({ key: "", value: "" });
                            }
                            setModalInputs((p) => ({ ...p, envVariables: updated }));
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Value"
                          className="kv-input"
                          value={v.value}
                          onChange={(e) => {
                            const updated = [...modalInputs.envVariables];
                            updated[idx].value = e.target.value;
                            if (idx === updated.length - 1 && e.target.value) {
                              updated.push({ key: "", value: "" });
                            }
                            setModalInputs((p) => ({ ...p, envVariables: updated }));
                          }}
                        />
                      </td>
                      <td>
                        {idx < modalInputs.envVariables.length - 1 && (
                          <button
                            className="table-action-btn"
                            onClick={() => {
                              const updated = modalInputs.envVariables.filter((_, i) => i !== idx);
                              setModalInputs((p) => ({ ...p, envVariables: updated }));
                            }}
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setModals((p) => ({ ...p, editEnvironment: false }))}
              >
                Cancel
              </button>
              <button className="send-btn" onClick={handleSaveEnvironment}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
