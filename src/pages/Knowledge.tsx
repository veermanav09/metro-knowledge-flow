import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DocumentList } from "@/components/DocumentList";

const Knowledge = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <DocumentList />
        </div>
      </div>
    </div>
  );
};

export default Knowledge;