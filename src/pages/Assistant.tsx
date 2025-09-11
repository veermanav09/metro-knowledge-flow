import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { AIChat } from "@/components/AIChat";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Assistant = () => {
  const assistantRef = useScrollReveal(0.1);

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