import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DocumentList } from "@/components/DocumentList";
import { Auth } from "@/components/Auth";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";

const Knowledge = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const knowledgeRef = useScrollReveal(0.1);

  if (!isAuthenticated) {
    return <Auth onAuthChange={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={knowledgeRef.ref}
          className={`flex-1 p-6 scroll-reveal ${knowledgeRef.isVisible ? 'revealed' : ''}`}
        >
          <DocumentList />
        </div>
      </div>
    </div>
  );
};

export default Knowledge;