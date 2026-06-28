import React from "react";
import { Toast } from "../app/types";

interface ToastContainerProps {
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, setToasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast"
          style={{
            borderColor:
              toast.type === "error"
                ? "var(--method-delete)"
                : toast.type === "info"
                ? "var(--method-put)"
                : "var(--method-get)",
          }}
        >
          <span>{toast.message}</span>
          <button
            className="table-action-btn"
            style={{ marginLeft: "12px" }}
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
