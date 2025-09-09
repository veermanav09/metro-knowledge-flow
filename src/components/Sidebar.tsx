import { 
  FileText, 
  Upload, 
  BarChart3, 
  Users, 
  Shield, 
  Search,
  Bot,
  AlertCircle,
  Settings,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const menuItems = [
  { icon: Upload, label: "Document Ingestion", description: "Upload & Process", active: false },
  { icon: FileText, label: "Knowledge Base", description: "Search Archive", active: false },
  { icon: Bot, label: "AI Assistant", description: "Ask Questions", active: false },
  { icon: BarChart3, label: "Analytics", description: "Insights & Reports", active: false },
  { icon: Users, label: "Department Routing", description: "Team Distribution", active: true },
  { icon: Shield, label: "Compliance", description: "Regulatory Tracking", active: false },
  { icon: AlertCircle, label: "Alerts", description: "Priority Notifications", active: false },
  { icon: Languages, label: "Translation", description: "English ⇄ Malayalam", active: false },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-card shadow-card border-r border-border h-screen overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "kmrl" : "ghost"}
              className="w-full justify-start h-auto p-3 text-left"
            >
              <item.icon className="h-5 w-5 mr-3 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Button>
          ))}
        </div>

        <Card className="mt-6 p-4 bg-gradient-ocean">
          <div className="text-center">
            <Bot className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold text-sm mb-1">AI Processing</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Currently processing 12 documents
            </p>
            <div className="w-full bg-background/20 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-3/4 transition-all duration-500"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">75% Complete</p>
          </div>
        </Card>

        <div className="mt-6 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Languages className="h-3 w-3 mr-1" />
            Language Support
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-success/20 text-success text-xs rounded">EN</span>
            <span className="px-2 py-1 bg-kmrl-blue/20 text-kmrl-blue text-xs rounded">മലയാളം</span>
            <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded">Mixed</span>
          </div>
        </div>
      </div>
    </aside>
  );
};