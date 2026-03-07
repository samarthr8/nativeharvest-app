import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const colors = {
    success: { bg: "#e6f4ec", border: "#2f6f4e", text: "#2f6f4e" },
    error: { bg: "#fdeced", border: "#d9534f", text: "#d9534f" },
    warning: { bg: "#fff3cd", border: "#ffc107", text: "#856404" },
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        style={{
          position: "fixed",
          top: "90px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "380px",
        }}
      >
        {toasts.map((t) => {
          const c = colors[t.type] || colors.error;
          return (
            <div
              key={t.id}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.text,
                padding: "14px 20px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                animation: "toastIn 0.3s ease",
              }}
            >
              {t.message}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
