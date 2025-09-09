import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface UploadedFile {
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: any;
}

export const DocumentUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [source, setSource] = useState<string>('upload');
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      file,
      status: 'uploading' as const,
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
    
    // Process each file
    newFiles.forEach((fileItem, index) => {
      processFile(fileItem, files.length + index);
    });
  }, [files.length]);

  const processFile = async (fileItem: UploadedFile, index: number) => {
    try {
      // Update status to processing
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'processing', progress: 50 } : f
      ));

      // Upload to Supabase Storage
      const fileExt = fileItem.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`uploads/${fileName}`, fileItem.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(`uploads/${fileName}`);

      // Create document record
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([{
          title: fileItem.file.name,
          content: 'Processing...', // Will be updated by AI processing
          original_language: 'english', // Will be detected
          document_type: 'other', // Will be classified
          department: 'operations', // Will be routed
          priority: 'medium', // Will be determined
          status: 'processing',
          source: source,
          file_url: publicUrl,
          created_by: 'current-user-id' // Replace with actual user ID
        }])
        .select()
        .single();

      if (docError) throw docError;

      // Simulate AI processing
      setTimeout(() => {
        setFiles(prev => prev.map((f, i) => 
          i === index ? { 
            ...f, 
            status: 'completed', 
            progress: 100, 
            result: docData 
          } : f
        ));

        toast({
          title: "Document Processed",
          description: `${fileItem.file.name} has been successfully processed and routed.`,
        });
      }, 2000);

    } catch (error) {
      console.error('Error processing file:', error);
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'error', progress: 0 } : f
      ));

      toast({
        title: "Processing Error",
        description: `Failed to process ${fileItem.file.name}`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2 text-primary" />
            Document Ingestion Hub
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Document Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">Direct Upload</SelectItem>
                  <SelectItem value="email">Email Attachment</SelectItem>
                  <SelectItem value="sharepoint">SharePoint</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp PDF</SelectItem>
                  <SelectItem value="maximo">Maximo Export</SelectItem>
                  <SelectItem value="scan">Scanned Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-upload">Select Files</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-ocean rounded-lg">
              <div className="text-2xl font-bold text-primary">247</div>
              <div className="text-sm text-muted-foreground">Documents Today</div>
            </div>
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">98.5%</div>
              <div className="text-sm text-muted-foreground">Processing Accuracy</div>
            </div>
            <div className="p-4 bg-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-warning">3.2min</div>
              <div className="text-sm text-muted-foreground">Avg Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((fileItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{fileItem.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                    {getStatusIcon(fileItem.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};