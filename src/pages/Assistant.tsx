import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { AIChat } from "@/components/AIChat";
import { Auth } from "@/components/Auth";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";

const Assistant = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const assistantRef = useScrollReveal(0.1);

  if (!isAuthenticated) {
    return <Auth onAuthChange={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={assistantRef.ref}
          className={`flex-1 p-6 scroll-reveal ${assistantRef.isVisible ? 'revealed' : ''}`}
        >
          <AIChat />
        </div>
      </div>
    </div>
  );
};

export default Assistant;