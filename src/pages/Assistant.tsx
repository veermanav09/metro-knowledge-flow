import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { AIChat } from "@/components/AIChat";

const Assistant = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <AIChat />
        </div>
      </div>
    </div>
  );
};

export default Assistant;