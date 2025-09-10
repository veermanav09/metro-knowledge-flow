import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Clock, CheckCircle, AlertTriangle, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Document = Database['public']['Tables']['documents']['Row'];
import { useToast } from '@/components/ui/use-toast';

export const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (departmentFilter !== 'all') {
        query = query.eq('department', departmentFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.content && doc.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (doc.summary && doc.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'processed':
      case 'routed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'uploaded':
        return <FileText className="h-4 w-4 text-primary" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: Document['status']) => {
    switch (status) {
      case 'processing':
        return 'secondary';
      case 'processed':
      case 'routed':
        return 'default';
      case 'uploaded':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: Document['priority']) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading documents...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Knowledge Base Archive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="routed">Routed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadDocuments}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>

          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(doc.status)}
                      <h3 className="font-medium text-foreground">{doc.title}</h3>
                    </div>
                    
                    {doc.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {doc.summary}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(doc.status)} className="text-xs">
                        {doc.status}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(doc.priority)} className="text-xs">
                        {doc.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.department}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {doc.original_language}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.source}
                      </Badge>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span>Created: {formatDate(doc.created_at)}</span>
                      <span>Type: {doc.document_type}</span>
                    </div>

                    {doc.key_points && doc.key_points.length > 0 && (
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">Key Points: </span>
                        <span className="text-muted-foreground">
                          {doc.key_points.slice(0, 2).join(', ')}
                          {doc.key_points.length > 2 && ` +${doc.key_points.length - 2} more`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {doc.file_url && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};