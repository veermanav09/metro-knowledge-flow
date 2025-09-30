import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Mail, MapPin, Phone, Calendar, Settings, Camera, LogOut, Edit3, Save, X, Bell, Shield, Globe, FileText, BarChart3 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const profileRef = useScrollReveal(0.1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "operations",
    position: "",
    language: "english",
    timezone: "ist"
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    documentAlerts: true,
    weeklyReports: true,
    darkMode: false
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        navigate('/');
        return;
      }

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        return;
      }

      if (profile) {
        setFormData({
          fullName: profile.full_name || "",
          employeeId: `KMRL-${user.id.substring(0, 8)}`,
          email: profile.email || user.email || "",
          phone: "",
          department: profile.department || "operations",
          position: profile.role || "",
          language: profile.language_preference || "english",
          timezone: "ist"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      window.location.reload();
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          department: formData.department,
          role: formData.position,
          language_preference: formData.language,
        })
        .eq('user_id', userId);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserProfile();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSettings = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="animate-click animate-hover-lift"
                    variant="outline"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="animate-click animate-hover-lift"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                      className="animate-click animate-hover-lift"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
                <Button 
                  onClick={handleLogout}
                  variant="destructive"
                  className="animate-click animate-hover-lift"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Profile Header */}
            <Card className="shadow-card animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-bold">
                        {formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
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
                    <h2 className="text-2xl font-bold text-foreground">{formData.fullName || 'User'}</h2>
                    <p className="text-muted-foreground">{formData.position || 'Employee'}</p>
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
                        <Input 
                          id="fullName" 
                          value={formData.fullName}
                          onChange={(e) => updateFormData("fullName", e.target.value)}
                          disabled={!isEditing}
                          className={`mt-1 transition-all ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input 
                          id="employeeId" 
                          value={formData.employeeId}
                          onChange={(e) => updateFormData("employeeId", e.target.value)}
                          disabled={!isEditing}
                          className={`mt-1 transition-all ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          disabled={!isEditing}
                          className={`mt-1 transition-all ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          disabled={!isEditing}
                          className={`mt-1 transition-all ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select 
                          value={formData.department}
                          onValueChange={(value) => updateFormData("department", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={`mt-1 transition-all ${!isEditing ? 'bg-muted/50' : ''}`}>
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
                        <Input 
                          id="position" 
                          value={formData.position}
                          onChange={(e) => updateFormData("position", e.target.value)}
                          disabled={!isEditing}
                          className={`mt-1 transition-all ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select 
                          value={formData.language}
                          onValueChange={(value) => updateFormData("language", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={`mt-1 transition-all ${!isEditing ? 'bg-muted/50' : ''}`}>
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
                        <Select 
                          value={formData.timezone}
                          onValueChange={(value) => updateFormData("timezone", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={`mt-1 transition-all ${!isEditing ? 'bg-muted/50' : ''}`}>
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
                {/* Settings Card */}
                <Card className="shadow-card animate-hover-lift">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Preferences & Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Email Notifications</p>
                            <p className="text-xs text-muted-foreground">Receive email alerts</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.emailNotifications}
                          onCheckedChange={(value) => updateSettings("emailNotifications", value)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Push Notifications</p>
                            <p className="text-xs text-muted-foreground">Mobile push alerts</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.pushNotifications}
                          onCheckedChange={(value) => updateSettings("pushNotifications", value)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Document Alerts</p>
                            <p className="text-xs text-muted-foreground">New document notifications</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.documentAlerts}
                          onCheckedChange={(value) => updateSettings("documentAlerts", value)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Weekly Reports</p>
                            <p className="text-xs text-muted-foreground">Analytics summaries</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.weeklyReports}
                          onCheckedChange={(value) => updateSettings("weeklyReports", value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card animate-hover-lift">
                  <CardHeader>
                    <CardTitle className="text-lg">Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-ocean rounded-lg animate-hover-lift">
                      <span className="text-sm font-medium text-foreground">Documents Processed</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">247</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-sunset rounded-lg animate-hover-lift">
                      <span className="text-sm font-medium text-foreground">Reports Generated</span>
                      <Badge className="bg-success/20 text-success border-success/30">18</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-forest rounded-lg animate-hover-lift">
                      <span className="text-sm font-medium text-foreground">AI Queries</span>
                      <Badge className="bg-kmrl-blue/20 text-kmrl-blue border-kmrl-blue/30">156</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-twilight rounded-lg animate-hover-lift">
                      <span className="text-sm font-medium text-foreground">Translations</span>
                      <Badge className="bg-warning/20 text-warning border-warning/30">89</Badge>
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