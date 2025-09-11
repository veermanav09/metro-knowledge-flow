import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, FileText, Users, Clock, Download } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Analytics = () => {
  const analyticsRef = useScrollReveal(0.1);

  const departmentStats = [
    { name: "Operations", documents: 156, processed: 142, pending: 14 },
    { name: "Safety", documents: 89, processed: 85, pending: 4 },
    { name: "Technical", documents: 73, processed: 68, pending: 5 },
    { name: "Administration", documents: 45, processed: 43, pending: 2 },
  ];

  const processingTrends = [
    { period: "Jan 2024", total: 234, processed: 198, accuracy: 94.2 },
    { period: "Feb 2024", total: 267, processed: 245, accuracy: 95.1 },
    { period: "Mar 2024", total: 189, processed: 178, accuracy: 96.3 },
    { period: "Apr 2024", total: 298, processed: 287, accuracy: 97.1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={analyticsRef.ref}
          className={`flex-1 p-6 scroll-reveal ${analyticsRef.isVisible ? 'revealed' : ''}`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <BarChart3 className="h-8 w-8 mr-3 text-primary" />
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive insights and performance metrics
                </p>
              </div>
              <Button className="animate-click animate-hover-lift">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Documents</p>
                      <p className="text-2xl font-bold text-foreground">1,247</p>
                      <p className="text-xs text-success flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% vs last month
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Processing Rate</p>
                      <p className="text-2xl font-bold text-success">97.8%</p>
                      <p className="text-xs text-success flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.1% improvement
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-warning">248</p>
                      <p className="text-xs text-success flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5% this week
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                      <p className="text-2xl font-bold text-primary">2.3min</p>
                      <p className="text-xs text-success flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        15% faster
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance */}
            <Card className="shadow-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {departmentStats.map((dept) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{dept.name}</span>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{dept.processed}/{dept.documents} processed</span>
                          <Badge variant="outline">{dept.pending} pending</Badge>
                        </div>
                      </div>
                      <Progress value={(dept.processed / dept.documents) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Trends */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Processing Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processingTrends.map((period) => (
                    <div key={period.period} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-hover-lift">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 text-sm font-medium">{period.period}</div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">{period.total}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-success">{period.processed}</div>
                            <div className="text-xs text-muted-foreground">Processed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{period.accuracy}%</div>
                            <div className="text-xs text-muted-foreground">Accuracy</div>
                          </div>
                        </div>
                      </div>
                      <div className="w-32">
                        <Progress value={(period.processed / period.total) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card animate-hover-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Document Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Safety Reports</span>
                      <span className="font-medium">342</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Technical Manuals</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Compliance Docs</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Training Materials</span>
                      <span className="font-medium">67</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card animate-hover-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Language Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>English</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Malayalam</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-success h-2 rounded-full w-1/4"></div>
                        </div>
                        <span className="font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card animate-hover-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>API Uptime</span>
                      <Badge className="bg-success/20 text-success border-success/30">99.9%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Storage Used</span>
                      <Badge variant="outline">67GB / 100GB</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active Sessions</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">124</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;