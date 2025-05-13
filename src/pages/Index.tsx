
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      navigate("/leads");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Return loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Lead Generation System</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
