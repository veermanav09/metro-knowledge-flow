import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Phone, Calendar, Settings, Camera } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Profile = () => {
  const profileRef = useScrollReveal(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={profileRef.ref}
          className={`flex-1 p-6 scroll-reveal ${profileRef.isVisible ? 'revealed' : ''}`}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <User className="h-8 w-8 mr-3 text-primary" />
                  User Profile
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your account settings and preferences
                </p>
              </div>
              <Button className="animate-click animate-hover-lift">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>

            {/* Profile Header */}
            <Card className="shadow-card animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-bold">
                        VM
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground">Veer Manav</h2>
                    <p className="text-muted-foreground">Station Controller</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
                      <Badge variant="outline">Operations Department</Badge>
                      <Badge variant="outline">Senior Level</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Member since</p>
                    <p className="font-medium">January 2024</p>
                    <p className="text-sm text-muted-foreground mt-2">Last login</p>
                    <p className="font-medium">Today, 09:30 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2">
                <Card className="shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value="Veer Manav" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input id="employeeId" value="KMRL-2024-001" className="mt-1" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value="veermanav.09@gmail.com" 
                          className="mt-1" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value="+91 98765 43210" className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select value="operations">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="safety">Safety</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="administration">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input id="position" value="Station Controller" className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select value="english">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="malayalam">മലയാളം</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value="ist">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full md:w-auto animate-click animate-hover-lift">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats & Activity */}
              <div className="space-y-6">
                <Card className="shadow-card animate-hover-lift">
                  <CardHeader>
                    <CardTitle className="text-lg">Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Documents Processed</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reports Generated</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">AI Queries</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Translations</span>
                      <span className="font-medium">89</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card animate-hover-lift">
                  <CardHeader>
                    <CardTitle className="text-lg">Access Permissions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Document Upload</span>
                      <Badge className="bg-success/20 text-success border-success/30">Full</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analytics View</span>
                      <Badge className="bg-success/20 text-success border-success/30">Full</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Management</span>
                      <Badge className="bg-warning/20 text-warning border-warning/30">Limited</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Config</span>
                      <Badge variant="outline">None</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card animate-hover-lift">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">Document uploaded</p>
                      <p className="text-muted-foreground text-xs">2 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">AI query processed</p>
                      <p className="text-muted-foreground text-xs">4 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Report generated</p>
                      <p className="text-muted-foreground text-xs">Yesterday</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;