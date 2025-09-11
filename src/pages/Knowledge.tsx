import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DocumentList } from "@/components/DocumentList";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Knowledge = () => {
  const knowledgeRef = useScrollReveal(0.1);

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