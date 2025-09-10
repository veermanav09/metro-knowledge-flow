import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { Auth } from "@/components/Auth";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dashboardRef = useScrollReveal(0.1);

  if (!isAuthenticated) {
    return <Auth onAuthChange={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={dashboardRef.ref}
          className={`flex-1 p-6 scroll-reveal ${dashboardRef.isVisible ? 'revealed' : ''}`}
        >
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Index;
