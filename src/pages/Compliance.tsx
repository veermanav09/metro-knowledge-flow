import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Compliance = () => {
  const complianceRef = useScrollReveal(0.1);

  const complianceItems = [
    {
      id: 1,
      title: "Safety Inspection Report Q1 2024",
      status: "completed",
      dueDate: "2024-03-31",
      department: "Safety",
      priority: "high"
    },
    {
      id: 2,
      title: "Environmental Impact Assessment",
      status: "pending",
      dueDate: "2024-04-15",
      department: "Environmental",
      priority: "medium"
    },
    {
      id: 3,
      title: "Fire Safety Compliance Audit",
      status: "overdue",
      dueDate: "2024-03-20",
      department: "Safety",
      priority: "high"
    },
    {
      id: 4,
      title: "Station Accessibility Review",
      status: "in_progress",
      dueDate: "2024-04-30",
      department: "Operations",
      priority: "medium"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/20 text-success border-success/30">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Overdue</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary/20 text-primary border-primary/30">In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'high' ? (
      <AlertTriangle className="h-4 w-4 text-destructive" />
    ) : (
      <Clock className="h-4 w-4 text-warning" />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={complianceRef.ref}
          className={`flex-1 p-6 scroll-reveal ${complianceRef.isVisible ? 'revealed' : ''}`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Shield className="h-8 w-8 mr-3 text-primary" />
                  Compliance Tracking
                </h1>
                <p className="text-muted-foreground mt-2">
                  Monitor regulatory compliance and audit requirements
                </p>
              </div>
              <Button className="animate-click animate-hover-lift">
                <CheckCircle className="h-4 w-4 mr-2" />
                New Compliance Item
              </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold text-foreground">24</p>
                    </div>
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-success">18</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-warning">4</p>
                    </div>
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overdue</p>
                      <p className="text-2xl font-bold text-destructive">2</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Progress */}
            <Card className="shadow-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-success" />
                  Overall Compliance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Safety Compliance</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Environmental Compliance</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Operational Compliance</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Items List */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle>Recent Compliance Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-hover-lift">
                      <div className="flex items-start space-x-4">
                        {getPriorityIcon(item.priority)}
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                            <span>{item.department}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(item.status)}
                        <Button variant="outline" size="sm" className="animate-click">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;