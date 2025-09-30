import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Languages, ArrowRight, RefreshCw, Copy, Download } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Translation = () => {
  const translationRef = useScrollReveal(0.1);
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const { toast } = useToast();

  const recentTranslations = [
    {
      id: 1,
      original: "Emergency evacuation procedures must be followed immediately.",
      translated: "അടിയന്തര ഒഴിപ്പിക്കൽ നടപടികൾ ഉടനടി പാലിക്കണം.",
      from: "English",
      to: "Malayalam",
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      original: "പ്ലാറ്റ്‌ഫോം നമ്പർ 2 ൽ ട്രെയിൻ എത്തുന്നു",
      translated: "Train arriving at Platform Number 2",
      from: "Malayalam",
      to: "English",
      timestamp: "2024-01-15T09:15:00Z"
    },
    {
      id: 3,
      original: "Safety inspection completed successfully.",
      translated: "സുരക്ഷാ പരിശോധന വിജയകരമായി പൂർത്തിയായി.",
      from: "English",
      to: "Malayalam",
      timestamp: "2024-01-15T08:45:00Z"
    }
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    
    try {
      const targetLanguage = sourceLanguage === "english" ? "malayalam" : "english";
      
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text: sourceText,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setTranslatedText(data.translatedText);
      
      toast({
        title: "Translation completed",
        description: "Text has been successfully translated.",
      });
    } catch (error: any) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: error.message || "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(sourceLanguage === "english" ? "malayalam" : "english");
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied successfully.",
    });
  };

  const downloadTranslation = () => {
    if (!translatedText) return;
    
    const blob = new Blob([`Original: ${sourceText}\n\nTranslation: ${translatedText}`], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Translation file has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div 
          ref={translationRef.ref}
          className={`flex-1 p-6 scroll-reveal ${translationRef.isVisible ? 'revealed' : ''}`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Languages className="h-8 w-8 mr-3 text-primary" />
                  Translation Hub
                </h1>
                <p className="text-muted-foreground mt-2">
                  Real-time English ⇄ Malayalam translation for KMRL operations
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge className="bg-success/20 text-success border-success/30">
                  English
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  മലയാളം
                </Badge>
              </div>
            </div>

            {/* Translation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Translations</p>
                      <p className="text-2xl font-bold text-foreground">1,247</p>
                    </div>
                    <Languages className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today</p>
                      <p className="text-2xl font-bold text-success">42</p>
                    </div>
                    <RefreshCw className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                      <p className="text-2xl font-bold text-warning">97.8%</p>
                    </div>
                    <Languages className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card animate-hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold text-primary">1.2s</p>
                    </div>
                    <RefreshCw className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Translation Interface */}
            <Card className="shadow-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Languages className="h-5 w-5 mr-2" />
                    Live Translation
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapLanguages}
                    className="animate-click"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <Badge variant="outline">
                         {sourceLanguage === "english" ? "English" : "മലയാളം"}
                       </Badge>
                       <div className="flex items-center gap-3 text-xs text-muted-foreground">
                         <span>
                           {sourceText.length.toLocaleString()} chars
                         </span>
                         <span>•</span>
                         <span>
                           {sourceText.trim().split(/\s+/).filter(w => w.length > 0).length.toLocaleString()} words
                         </span>
                       </div>
                     </div>
                     <Textarea
                       placeholder={sourceLanguage === "english" 
                         ? "Enter English text to translate...\n\nSupports long documents, structured text, and bullet points." 
                         : "വിവർത്തനം ചെയ്യാൻ മലയാളം ടെക്സ്റ്റ് നൽകുക...\n\nനീണ്ട രേഖകൾ, ഘടനാപരമായ വാചകം എന്നിവ പിന്തുണയ്ക്കുന്നു."
                       }
                       value={sourceText}
                       onChange={(e) => setSourceText(e.target.value)}
                       className="min-h-[400px] resize-y font-mono text-sm"
                     />
                   </div>
                   
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <Badge className="bg-primary/20 text-primary border-primary/30">
                         {sourceLanguage === "english" ? "മലയാളം" : "English"}
                       </Badge>
                       <div className="flex items-center gap-3 text-xs text-muted-foreground">
                         {translatedText && (
                           <>
                             <span>
                               {translatedText.length.toLocaleString()} chars
                             </span>
                             <span>•</span>
                             <span>
                               {translatedText.trim().split(/\s+/).filter(w => w.length > 0).length.toLocaleString()} words
                             </span>
                           </>
                         )}
                       </div>
                     </div>
                     <div className="relative">
                       <Textarea
                         placeholder="Translation will appear here..."
                         value={translatedText}
                         readOnly
                         className="min-h-[400px] resize-y bg-muted/30 font-mono text-sm"
                       />
                       {translatedText && (
                         <div className="absolute top-2 right-2 flex space-x-1">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="h-8 w-8 p-0"
                             onClick={() => copyToClipboard(translatedText)}
                           >
                             <Copy className="h-3 w-3" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="h-8 w-8 p-0"
                             onClick={downloadTranslation}
                           >
                             <Download className="h-3 w-3" />
                           </Button>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
                
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleTranslate}
                    disabled={!sourceText.trim() || isTranslating}
                    className="animate-click animate-hover-lift"
                  >
                    {isTranslating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Languages className="h-4 w-4 mr-2" />
                        Translate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Translations */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle>Recent Translations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTranslations.map((translation) => (
                    <div key={translation.id} className="p-4 bg-muted/30 rounded-lg animate-hover-lift">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {translation.from} → {translation.to}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(translation.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="animate-click"
                            onClick={() => copyToClipboard(translation.translated)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-background rounded border">
                            <p className="text-sm">{translation.original}</p>
                          </div>
                          <div className="p-3 bg-primary/5 rounded border border-primary/20">
                            <p className="text-sm">{translation.translated}</p>
                          </div>
                        </div>
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

export default Translation;