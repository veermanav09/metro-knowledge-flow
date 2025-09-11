import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DocumentUpload } from "@/components/DocumentUpload";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Upload = () => {
  const uploadRef = useScrollReveal(0.1);

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