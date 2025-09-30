import { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Train, Sparkles, Zap, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UploadedFile {
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: any;
  detectedLanguage?: string;
  selectedDepartment?: string;
}

export const DocumentUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [source, setSource] = useState<string>('upload');
  const [department, setDepartment] = useState<string>('operations');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    processFiles(selectedFiles);
  }, []);

  const processFiles = useCallback((selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
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
        i === index ? { ...f, status: 'processing', progress: 25, selectedDepartment: department } : f
      ));

      // Create documents bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
      
      if (!documentsBucket) {
        const { error: bucketError } = await supabase.storage.createBucket('documents', {
          public: true,
          allowedMimeTypes: ['application/pdf', 'image/*', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (bucketError) {
          console.warn('Bucket creation warning:', bucketError);
        }
      }

      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload to Supabase Storage with user folder structure
      const fileExt = fileItem.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${user.id}/${fileName}`, fileItem.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(`${user.id}/${fileName}`);

      // Detect language only for text-based files
      let detectedLanguage = 'english';
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, progress: 40 } : f
      ));

      // Check file type for language detection
      const originalFileName = fileItem.file.name.toLowerCase();
      const isTextFile = originalFileName.endsWith('.txt');
      const isDocFile = originalFileName.endsWith('.doc') || originalFileName.endsWith('.docx');
      const isImageFile = originalFileName.endsWith('.png') || originalFileName.endsWith('.jpg') || 
                          originalFileName.endsWith('.jpeg') || originalFileName.endsWith('.webp');
      
      // For text files, read directly
      if (isTextFile) {
        try {
          const fileContent = await fileItem.file.text();
          const sampleText = fileContent.substring(0, 2000);
          
          const { data: langData, error: langError } = await supabase.functions.invoke('detect-language', {
            body: { text: sampleText }
          });

          if (!langError && langData?.language) {
            detectedLanguage = langData.language;
            console.log('Detected language from text file:', detectedLanguage);
          }
        } catch (langDetectError) {
          console.log('Language detection failed:', langDetectError);
        }
      }
      // For images, use vision AI to detect language
      else if (isImageFile) {
        try {
          const formData = new FormData();
          formData.append('image', fileItem.file);
          
          const { data: langData, error: langError } = await supabase.functions.invoke('detect-image-language', {
            body: formData
          });

          if (!langError && langData?.language) {
            detectedLanguage = langData.language;
            console.log('Detected language from image:', detectedLanguage);
          } else {
            console.log('Image language detection error:', langError);
          }
        } catch (langDetectError) {
          console.log('Image language detection failed:', langDetectError);
          // Fallback to filename check
          if (originalFileName.includes('mal') || originalFileName.includes('malayalam') || 
              originalFileName.includes('മലയാളം') || /[\u0D00-\u0D7F]/.test(originalFileName)) {
            detectedLanguage = 'malayalam';
            console.log('Detected Malayalam from filename:', originalFileName);
          }
        }
      }
      // For PDFs, check filename for Malayalam indicators
      else if (originalFileName.endsWith('.pdf')) {
        if (originalFileName.includes('mal') || originalFileName.includes('malayalam') || 
            originalFileName.includes('മലയാളം') || /[\u0D00-\u0D7F]/.test(originalFileName)) {
          detectedLanguage = 'malayalam';
          console.log('Detected Malayalam from PDF filename:', originalFileName);
        }
      }
      // For doc/docx files, attempt basic text extraction
      else if (isDocFile) {
        try {
          const fileContent = await fileItem.file.text();
          // Check for Malayalam Unicode characters in the content
          if (/[\u0D00-\u0D7F]/.test(fileContent.substring(0, 5000))) {
            detectedLanguage = 'malayalam';
            console.log('Detected Malayalam characters in document');
          } else {
            // Try AI detection on a sample
            const cleanText = fileContent.replace(/[^\x20-\x7E\u0D00-\u0D7F]/g, ' ').substring(0, 2000);
            if (cleanText.trim().length > 50) {
              const { data: langData, error: langError } = await supabase.functions.invoke('detect-language', {
                body: { text: cleanText }
              });
              
              if (!langError && langData?.language) {
                detectedLanguage = langData.language;
                console.log('Detected language from document content:', detectedLanguage);
              }
            }
          }
        } catch (langDetectError) {
          console.log('Document language detection skipped:', langDetectError);
        }
      }
      else {
        console.log('Language detection skipped for file type:', originalFileName);
      }
      
      // For text files, read directly
      if (isTextFile) {
        try {
          const fileContent = await fileItem.file.text();
          const sampleText = fileContent.substring(0, 2000);
          
          const { data: langData, error: langError } = await supabase.functions.invoke('detect-language', {
            body: { text: sampleText }
          });

          if (!langError && langData?.language) {
            detectedLanguage = langData.language;
            console.log('Detected language from text file:', detectedLanguage);
          }
        } catch (langDetectError) {
          console.log('Language detection failed:', langDetectError);
        }
      } 
      // For PDFs and images, check filename for Malayalam indicators
      else if (fileName.includes('mal') || fileName.includes('malayalam') || 
               fileName.includes('മലയാളം') || /[\u0D00-\u0D7F]/.test(fileName)) {
        detectedLanguage = 'malayalam';
        console.log('Detected Malayalam from filename:', fileName);
      }
      // For doc/docx files, attempt basic text extraction (limited without full parsing)
      else if (isDocFile) {
        try {
          const fileContent = await fileItem.file.text();
          // Check for Malayalam Unicode characters in the content
          if (/[\u0D00-\u0D7F]/.test(fileContent.substring(0, 5000))) {
            detectedLanguage = 'malayalam';
            console.log('Detected Malayalam characters in document');
          } else {
            // Try AI detection on a sample
            const cleanText = fileContent.replace(/[^\x20-\x7E\u0D00-\u0D7F]/g, ' ').substring(0, 2000);
            if (cleanText.trim().length > 50) {
              const { data: langData, error: langError } = await supabase.functions.invoke('detect-language', {
                body: { text: cleanText }
              });
              
              if (!langError && langData?.language) {
                detectedLanguage = langData.language;
                console.log('Detected language from document content:', detectedLanguage);
              }
            }
          }
        } catch (langDetectError) {
          console.log('Document language detection skipped:', langDetectError);
        }
      }
      else {
        console.log('Language detection skipped for file type:', fileName);
      }

      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, progress: 60, detectedLanguage } : f
      ));

      // Create document record with detected language and selected department
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([{
          title: fileItem.file.name,
          content: 'Processing...',
          original_language: detectedLanguage,
          document_type: 'other',
          department: department,
          priority: 'medium',
          status: 'processing',
          source: source,
          file_url: publicUrl,
          created_by: user.id
        }])
        .select()
        .single();

      if (docError) throw docError;

      // Simulate AI processing with progress updates
      let currentProgress = 70;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress >= 95) {
          clearInterval(progressInterval);
          currentProgress = 100;
          
          setFiles(prev => prev.map((f, i) => 
            i === index ? { 
              ...f, 
              status: 'completed', 
              progress: 100, 
              result: docData 
            } : f
          ));

          toast({
            title: "Document Processed Successfully",
            description: `${fileItem.file.name} has been successfully processed and routed.`,
          });
          
          // Check if all files are done
          setFiles(prev => {
            const allCompleted = prev.every(f => f.status === 'completed' || f.status === 'error');
            if (allCompleted) {
              setIsUploading(false);
            }
            return prev;
          });
        } else {
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, progress: Math.min(currentProgress, 95) } : f
          ));
        }
      }, 200);

      // Cleanup after 3 seconds max
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 3000);

    } catch (error) {
      console.error('Error processing file:', error);
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'error', progress: 0 } : f
      ));

      toast({
        title: "Processing Error",
        description: `Failed to process ${fileItem.file.name}. Please try again.`,
        variant: "destructive",
      });
      
      setIsUploading(false);
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

  const TrainProgress = ({ progress }: { progress: number }) => (
    <div className="relative w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
      <div 
        className="bg-gradient-primary h-full transition-all duration-700 relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        <div className="absolute right-0 top-0 h-full w-8 flex items-center justify-center">
          <Train className="h-4 w-4 text-primary-foreground animate-train drop-shadow-lg" />
        </div>
        {progress > 10 && (
          <div className="absolute left-2 top-0 h-full flex items-center">
            <Sparkles className="h-3 w-3 text-primary-foreground animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-card animate-hover-lift border-2 transition-all duration-300 hover:shadow-glow">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center text-lg">
            <div className="relative">
              <Upload className="h-6 w-6 mr-3 text-primary" />
              {isUploading && (
                <div className="absolute -top-1 -right-1">
                  <Zap className="h-3 w-3 text-warning animate-pulse" />
                </div>
              )}
            </div>
            Document Ingestion Hub
            <div className="ml-auto flex items-center space-x-2">
              <Rocket className="h-4 w-4 text-muted-foreground animate-bounce" />
              <span className="text-sm text-muted-foreground font-normal">AI-Powered</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag and Drop Zone */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-primary bg-primary/5 shadow-glow' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full transition-all duration-300 ${
                dragOver ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-muted'
              }`}>
                <Upload className={`h-8 w-8 transition-transform duration-300 ${
                  dragOver ? 'scale-110' : ''
                }`} />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {dragOver ? 'Drop files here!' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click below to browse files
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports PDF, DOC, DOCX, TXT, PNG, JPG (max 10MB each)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="department" className="flex items-center">
                <Train className="h-4 w-4 mr-2 text-primary" />
                Target Department
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="animate-click hover:shadow-elegant transition-all duration-200">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">🚇 Operations</SelectItem>
                  <SelectItem value="safety">🛡️ Safety</SelectItem>
                  <SelectItem value="technical">🔧 Technical</SelectItem>
                  <SelectItem value="administration">📋 Administration</SelectItem>
                  <SelectItem value="engineering">⚙️ Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="source" className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                Document Source
              </Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="animate-click hover:shadow-elegant transition-all duration-200">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">📁 Direct Upload</SelectItem>
                  <SelectItem value="email">📧 Email Attachment</SelectItem>
                  <SelectItem value="sharepoint">📊 SharePoint</SelectItem>
                  <SelectItem value="whatsapp">💬 WhatsApp PDF</SelectItem>
                  <SelectItem value="maximo">⚙️ Maximo Export</SelectItem>
                  <SelectItem value="scan">📷 Scanned Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-upload" className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                Browse Files
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="cursor-pointer animate-click hover:shadow-elegant transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="group p-6 bg-gradient-ocean rounded-xl animate-hover-lift hover:scale-105 transition-all duration-300 border border-primary/20 hover:shadow-glow">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-primary mr-2" />
                <div className="text-3xl font-bold text-primary animate-pulse">247</div>
              </div>
              <div className="text-sm text-muted-foreground font-medium">Documents Today</div>
              <div className="text-xs text-primary/60 mt-1">+12% from yesterday</div>
            </div>
            <div className="group p-6 bg-gradient-to-br from-success/5 to-success/15 rounded-xl animate-hover-lift hover:scale-105 transition-all duration-300 border border-success/20 hover:shadow-elegant">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-success mr-2" />
                <div className="text-3xl font-bold text-success">98.5%</div>
              </div>
              <div className="text-sm text-muted-foreground font-medium">Processing Accuracy</div>
              <div className="text-xs text-success/60 mt-1">Industry leading</div>
            </div>
            <div className="group p-6 bg-gradient-to-br from-warning/5 to-warning/15 rounded-xl animate-hover-lift hover:scale-105 transition-all duration-300 border border-warning/20 hover:shadow-elegant">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-warning mr-2" />
                <div className="text-3xl font-bold text-warning">3.2min</div>
              </div>
              <div className="text-sm text-muted-foreground font-medium">Avg Processing Time</div>
              <div className="text-xs text-warning/60 mt-1">Lightning fast</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card className="shadow-card animate-slide-up border-2 border-primary/10 bg-gradient-subtle">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Train className="h-5 w-5 mr-2 text-primary animate-pulse" />
                Processing Queue
                <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                  {files.length} files
                </span>
              </div>
              {isUploading && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Processing...
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {files.map((fileItem, index) => (
                <div 
                  key={index} 
                  className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-500 animate-fade-in border ${
                    fileItem.status === 'completed' 
                      ? 'bg-success/5 border-success/20 shadow-sm' 
                      : fileItem.status === 'error'
                      ? 'bg-destructive/5 border-destructive/20'
                      : 'bg-muted/40 border-border/30 hover:bg-muted/60'
                  }`}
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg transition-colors duration-300 ${
                      fileItem.status === 'completed' ? 'bg-success/10' : 'bg-primary/10'
                    }`}>
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {fileItem.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center flex-wrap gap-2">
                        <span>{(fileItem.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        {fileItem.detectedLanguage && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                            {fileItem.detectedLanguage === 'malayalam' ? 'മലയാളം' : 'English'}
                          </span>
                        )}
                        {fileItem.selectedDepartment && (
                          <span className="px-2 py-0.5 bg-muted rounded">
                            {fileItem.selectedDepartment}
                          </span>
                        )}
                        {fileItem.status === 'completed' && (
                          <span className="ml-2 text-success font-medium">Complete</span>
                        )}
                        {fileItem.status === 'error' && (
                          <span className="ml-2 text-destructive font-medium">Failed</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32">
                      <TrainProgress progress={fileItem.progress} />
                    </div>
                    <div className="text-xs text-muted-foreground font-mono min-w-[40px] text-right">
                      {Math.round(fileItem.progress)}%
                    </div>
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {getStatusIcon(fileItem.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {files.some(f => f.status === 'completed') && (
              <div className="mt-4 p-3 bg-success/5 border border-success/20 rounded-lg animate-fade-in">
                <div className="flex items-center text-success text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Successfully processed {files.filter(f => f.status === 'completed').length} documents
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};