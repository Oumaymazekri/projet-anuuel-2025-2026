"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import router from 'next/router';
type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string,Email: string,Full_Name: string,Phone_Number: string,Adress: string,image: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier la présence du token lors du chargement initial
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true); // Si le token existe, on considère que l'utilisateur est authentifié
    }
  }, []);

  const login = (token: string,Email: string,Full_Name: string,Phone_Number: string,Adress: string,image: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("Email",Email );
    localStorage.setItem("Full_Name",Full_Name );
    localStorage.setItem("Phone_Number",Phone_Number );
    localStorage.setItem("Adress",Adress );
    localStorage.setItem("image",image ); // Sauvegarder le token
    setIsAuthenticated(true); // L'utilisateur est maintenant authentifié
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("Email" );
    localStorage.removeItem("Full_Name" );
    localStorage.removeItem("Phone_Number" );
    localStorage.removeItem("Adress" );
    localStorage.removeItem("image" );
     // Supprimer le token
    setIsAuthenticated(false); // L'utilisateur n'est plus authentifié
 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
