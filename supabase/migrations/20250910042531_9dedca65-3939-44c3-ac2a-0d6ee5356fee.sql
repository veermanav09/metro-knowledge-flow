-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  department TEXT,
  role TEXT CHECK (role IN ('station_controller', 'manager', 'engineer', 'admin', 'executive')) DEFAULT 'engineer',
  language_preference TEXT CHECK (language_preference IN ('english', 'malayalam', 'both')) DEFAULT 'english',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  original_language TEXT CHECK (original_language IN ('english', 'malayalam', 'bilingual')) DEFAULT 'english',
  translated_content TEXT,
  document_type TEXT CHECK (document_type IN ('policy', 'circular', 'invoice', 'report', 'regulation', 'other')) DEFAULT 'other',
  department TEXT CHECK (department IN ('hr', 'engineering', 'finance', 'regulatory', 'safety', 'operations', 'procurement')) DEFAULT 'engineering',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('uploaded', 'processing', 'processed', 'routed', 'archived')) DEFAULT 'uploaded',
  source TEXT CHECK (source IN ('email', 'sharepoint', 'whatsapp', 'maximo', 'scan', 'upload')) DEFAULT 'upload',
  file_url TEXT,
  summary TEXT,
  key_points TEXT[],
  compliance_items TEXT[],
  deadlines TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create document routes table
CREATE TABLE public.document_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  priority INTEGER DEFAULT 1,
  reason TEXT,
  routed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'acknowledged', 'completed')) DEFAULT 'pending'
);

-- Create compliance items table
CREATE TABLE public.compliance_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')) DEFAULT 'pending',
  assigned_department TEXT,
  assigned_user UUID REFERENCES auth.users(id),
  document_id UUID REFERENCES public.documents(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for documents
CREATE POLICY "Users can view all documents" 
ON public.documents FOR SELECT 
USING (true);

CREATE POLICY "Users can create documents" 
ON public.documents FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update documents they created" 
ON public.documents FOR UPDATE 
USING (auth.uid() = created_by);

-- Create RLS policies for document routes
CREATE POLICY "Users can view all document routes" 
ON public.document_routes FOR SELECT 
USING (true);

CREATE POLICY "Users can create document routes" 
ON public.document_routes FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update document routes" 
ON public.document_routes FOR UPDATE 
USING (true);

-- Create RLS policies for compliance items
CREATE POLICY "Users can view all compliance items" 
ON public.compliance_items FOR SELECT 
USING (true);

CREATE POLICY "Users can create compliance items" 
ON public.compliance_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update compliance items" 
ON public.compliance_items FOR UPDATE 
USING (true);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies for documents
CREATE POLICY "Users can view documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'documents');

CREATE POLICY "Users can upload documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their documents" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their documents" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_items_updated_at
  BEFORE UPDATE ON public.compliance_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, department)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'department', 'engineering')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();