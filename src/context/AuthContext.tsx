
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";

interface User {
  username: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Load the user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call to authenticate user
    try {
      // For the demo, we'll use localStorage as our "database"
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.username === username);
      
      if (user && user.password === password) {
        const loggedInUser = { username };
        setCurrentUser(loggedInUser);
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Invalid username or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const signup = async (username: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u: any) => u.username === username)) {
        toast.error("Username already exists");
        return false;
      }

      // Add new user
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
