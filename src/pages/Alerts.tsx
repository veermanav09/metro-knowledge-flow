import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bell, Clock, CheckCircle, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Alerts = () => {
  const alertsRef = useScrollReveal(0.1);

  const alerts = [
    {
      id: 1,
      title: "System Maintenance Scheduled",
      message: "Planned maintenance window for train control systems on Platform 3",
      type: "info",
      timestamp: "2024-01-15T10:30:00Z",
      department: "Technical",
      isRead: false,
      priority: "medium"
    },
    {
      id: 2,
      title: "Safety Protocol Violation Detected",
      message: "Unauthorized personnel detected in restricted area near Track 2",
      type: "warning",
      timestamp: "2024-01-15T09:15:00Z",
      department: "Security",
      isRead: false,
      priority: "high"
    },
    {
      id: 3,
      title: "Document Processing Complete",
      message: "Monthly safety report has been processed and is ready for review",
      type: "success",
      timestamp: "2024-01-15T08:45:00Z",
      department: "Safety",
      isRead: true,
      priority: "low"
    },
    {
      id: 4,
      title: "Emergency Drill Scheduled",
      message: "Station-wide emergency evacuation drill scheduled for next Tuesday",
      type: "info",
      timestamp: "2024-01-15T07:20:00Z",
      department: "Safety",
      isRead: false,
      priority: "medium"
    },
    {
      id: 5,
      title: "Critical System Alert",
      message: "Backup power system malfunction detected in Control Room",
      type: "error",
      timestamp: "2024-01-15T06:10:00Z",
      department: "Technical",
      isRead: false,
      priority: "critical"
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge className="bg-success/20 text-success border-success/30">Success</Badge>;
      case 'warning':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Warning</Badge>;
      case 'error':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Error</Badge>;
      default:
        return <Badge className="bg-primary/20 text-primary border-primary/30">Info</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>;
      case 'high':
        return <Badge className="bg-warning/90 text-warning-foreground">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={alertsRef.ref}
          className={`flex-1 p-6 scroll-reveal ${alertsRef.isVisible ? 'revealed' : ''}`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <AlertCircle className="h-8 w-8 mr-3 text-primary" />
                  System Alerts
                </h1>
                <p className="text-muted-foreground mt-2">
                  Monitor system notifications and priority alerts
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="animate-click animate-hover-lift">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button className="animate-click animate-hover-lift">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </div>

            {/* Alert Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Alerts</p>
                      <p className="text-2xl font-bold text-foreground">47</p>
                    </div>
                    <Bell className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unread</p>
                      <p className="text-2xl font-bold text-warning">12</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical</p>
                      <p className="text-2xl font-bold text-destructive">3</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today</p>
                      <p className="text-2xl font-bold text-primary">8</p>
                    </div>
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts List */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`flex items-start justify-between p-4 rounded-lg border animate-hover-lift ${
                        !alert.isRead ? 'bg-muted/50 border-primary/20' : 'bg-muted/20 border-border'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className={`font-medium ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {alert.title}
                            </h4>
                            {!alert.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{formatTimestamp(alert.timestamp)}</span>
                            <span>{alert.department}</span>
                            {getAlertBadge(alert.type)}
                            {getPriorityBadge(alert.priority)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="animate-click">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="animate-click">
                          <X className="h-4 w-4" />
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

export default Alerts;