import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getToken,
  removeToken,
} from "../utils/secureStore";

import { getCurrentUser } from "../services/api/authService";

interface AuthContextType {
  user: any;

  setUser: React.Dispatch<
    React.SetStateAction<any>
  >;

  isLoading: boolean;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await getToken();

        if (!token) {
            return;
        }

        const response = await getCurrentUser();

        setUser(response.user);

        // In the next step, we'll verify the token
        // with the backend and restore the user.
      } catch (error) {
        await removeToken();
        setUser(null);

        console.log("Session expired.");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const logout = async () => {

      try {

        await removeToken();

        setUser(null);

      } catch (error) {

        console.error(
          "Logout failed:",
          error
        );

      }

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};