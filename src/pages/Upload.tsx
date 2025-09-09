import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DocumentUpload } from "@/components/DocumentUpload";

const Upload = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <DocumentUpload />
        </div>
      </div>
    </div>
  );
};

export default Upload;