
import React from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showBackButton = true,
  title 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center flex-grow">
            {/* Logo */}
            <div className="text-xl font-bold text-primary">
              <img 
                src="/lovable-uploads/73e83bc2-faa2-485c-8821-610ce90f2d7d.png" 
                alt="BRIGS Logo" 
                className="h-10" 
              />
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/leads')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    navigate('/login');
                  }}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="page-container page-transition">
          {showBackButton && !isAuthPage && (
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeft size={20} className="mr-1" /> Back
            </button>
          )}
          
          {title && <h1 className="text-2xl font-bold mb-6 text-primary">{title}</h1>}
          
          {children}
        </div>
      </main>
      
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Factory Lead Generation System
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
