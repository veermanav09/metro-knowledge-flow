import { 
  FileText, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Users,
  ArrowRight,
  Calendar,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { title: "Documents Processed Today", value: "247", change: "+12%", icon: FileText, color: "text-primary" },
  { title: "Pending Compliance Items", value: "18", change: "-5%", icon: AlertTriangle, color: "text-warning" },
  { title: "Active Departments", value: "8", change: "0%", icon: Users, color: "text-success" },
  { title: "Average Processing Time", value: "3.2min", change: "-15%", icon: Clock, color: "text-kmrl-blue" },
];

const recentDocuments = [
  {
    title: "Safety Circular - Rolling Stock Maintenance",
    department: "Engineering",
    language: "English",
    priority: "High",
    time: "5 min ago",
    status: "processed"
  },
  {
    title: "വേതന വിതരണ നയം - Salary Distribution Policy", 
    department: "HR",
    language: "Bilingual",
    priority: "Medium",
    time: "12 min ago",
    status: "processing"
  },
  {
    title: "Vendor Invoice - Signaling Equipment",
    department: "Finance",
    language: "English",
    priority: "Low",
    time: "18 min ago",
    status: "routed"
  },
  {
    title: "Environmental Impact Assessment",
    department: "Regulatory",
    language: "English", 
    priority: "High",
    time: "25 min ago",
    status: "processed"
  }
];

const complianceItems = [
  { title: "Commissioner Safety Review", due: "2 Days", status: "pending" },
  { title: "Monthly Financial Report", due: "5 Days", status: "in-progress" },
  { title: "Environmental Clearance", due: "10 Days", status: "completed" },
];

export const Dashboard = () => {
  return (
    <div className="flex-1 p-6 space-y-6 bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Good Morning, Station Controller</h2>
            <p className="text-primary-foreground/80 mb-4">
              സുപ്രഭാതം! Your daily intelligence briefing is ready.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Kochi Metro - Central Station
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">24°C</div>
            <div className="text-sm text-primary-foreground/80">Kochi Weather</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-primary transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-success' : stat.change.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Document Processing
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground">{doc.title}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge variant="secondary" className="text-xs">{doc.department}</Badge>
                    <Badge variant="outline" className="text-xs">{doc.language}</Badge>
                    <span className="text-xs text-muted-foreground">{doc.time}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={doc.priority === 'High' ? 'destructive' : doc.priority === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                    {doc.priority}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${
                    doc.status === 'processed' ? 'bg-success' : 
                    doc.status === 'processing' ? 'bg-warning animate-pulse' : 'bg-primary'
                  }`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Tracking */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Compliance Tracking
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  {item.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : item.status === 'in-progress' ? (
                    <Clock className="h-5 w-5 text-warning" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">Due in {item.due}</p>
                  </div>
                </div>
                <Badge variant={
                  item.status === 'completed' ? 'default' : 
                  item.status === 'in-progress' ? 'secondary' : 'destructive'
                } className="text-xs">
                  {item.status === 'completed' ? 'Complete' : 
                   item.status === 'in-progress' ? 'In Progress' : 'Pending'}
                </Badge>
              </div>
            ))}
            
            <Button variant="hero" className="w-full mt-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Schedule Compliance Review
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};