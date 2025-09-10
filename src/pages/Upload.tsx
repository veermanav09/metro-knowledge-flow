import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DocumentUpload } from "@/components/DocumentUpload";
import { Auth } from "@/components/Auth";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";

const Upload = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const uploadRef = useScrollReveal(0.1);

  if (!isAuthenticated) {
    return <Auth onAuthChange={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={uploadRef.ref}
          className={`flex-1 p-6 scroll-reveal ${uploadRef.isVisible ? 'revealed' : ''}`}
        >
          <DocumentUpload />
        </div>
      </div>
    </div>
  );
};

export default Upload;