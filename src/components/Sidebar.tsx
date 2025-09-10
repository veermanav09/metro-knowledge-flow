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
  Languages,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  { icon: Upload, label: "Document Ingestion", description: "Upload & Process", path: "/upload" },
  { icon: FileText, label: "Knowledge Base", description: "Search Archive", path: "/knowledge" },
  { icon: Bot, label: "AI Assistant", description: "Ask Questions", path: "/assistant" },
  { icon: BarChart3, label: "Analytics", description: "Insights & Reports", path: "/analytics" },
  { icon: Users, label: "Department Routing", description: "Team Distribution", path: "/" },
  { icon: Shield, label: "Compliance", description: "Regulatory Tracking", path: "/compliance" },
  { icon: AlertCircle, label: "Alerts", description: "Priority Notifications", path: "/alerts" },
  { icon: Languages, label: "Translation", description: "English ⇄ Malayalam", path: "/translation" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Force page refresh to reset authentication state
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 bg-card shadow-card border-r border-border h-screen overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={location.pathname === item.path ? "kmrl" : "ghost"}
              className="w-full justify-start h-auto p-3 text-left animate-click animate-hover-lift"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5 mr-3 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Button>
          ))}
        </div>

        <Card className="mt-6 p-4 bg-gradient-ocean animate-hover-lift">
          <div className="text-center">
            <Bot className="h-8 w-8 mx-auto mb-2 text-primary animate-pulse-glow" />
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

        <div className="mt-6 p-3 bg-muted/30 rounded-lg animate-hover-lift">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Languages className="h-3 w-3 mr-1" />
            Language Support
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-success/20 text-success text-xs rounded animate-click">EN</span>
            <span className="px-2 py-1 bg-kmrl-blue/20 text-kmrl-blue text-xs rounded animate-click">മലയാളം</span>
            <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded animate-click">Mixed</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start animate-click animate-hover-lift"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};