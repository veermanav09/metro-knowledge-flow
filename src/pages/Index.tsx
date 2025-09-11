import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  const dashboardRef = useScrollReveal(0.1);

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
