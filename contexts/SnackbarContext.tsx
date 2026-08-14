import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import AppSnackbar from "../components/Feedback/AppSnackbar";

interface SnackbarContextType {
  showSnackbar: (message: string) => void;
}

const SnackbarContext = createContext<
  SnackbarContextType | undefined
>(undefined);

export function SnackbarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackbar = (text: string) => {
    setMessage(text);
    setVisible(true);
  };

  return (
    <SnackbarContext.Provider
      value={{ showSnackbar }}
    >
      {children}

      <AppSnackbar
        visible={visible}
        message={message}
        onDismiss={() => setVisible(false)}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(
      "useSnackbar must be used inside SnackbarProvider"
    );
  }

  return context;
}