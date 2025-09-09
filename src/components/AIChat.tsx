import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: 'english' | 'malayalam' | 'bilingual';
  relatedDocs?: string[];
}

const sampleMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: 'സ്വാഗതം! Welcome to KMRL Intelligence Hub. I can help you find documents, understand policies, and get compliance information. How can I assist you today?',
    timestamp: new Date(Date.now() - 5000),
    language: 'bilingual'
  }
];

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const responses = [
        {
          content: 'I found 3 recent safety circulars related to rolling stock maintenance. The latest one was issued yesterday regarding brake system inspections. Would you like me to summarize the key points?',
          relatedDocs: ['Safety Circular SC-2024-001', 'Maintenance Manual MM-RS-2024', 'Brake Inspection Protocol']
        },
        {
          content: 'According to the latest HR policy update, refresher training for station controllers is mandatory every 6 months. The next session is scheduled for March 15, 2024. സുരക്ഷ പരിശീലനം അത്യാവശ്യമാണ്.',
          language: 'bilingual' as const,
          relatedDocs: ['HR Policy HP-2024-003', 'Training Schedule TS-2024-Q1']
        },
        {
          content: 'The compliance deadline for the Commissioner of Metro Rail Safety review is in 2 days. I\'ve identified 3 pending items that need attention before submission.',
          relatedDocs: ['Compliance Checklist CC-2024-001', 'Safety Review SR-2024-Q4']
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        language: randomResponse.language || 'english',
        relatedDocs: randomResponse.relatedDocs
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="shadow-card h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          KMRL AI Assistant
          <Badge variant="default" className="ml-2 text-xs bg-success text-success-foreground">Online</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about documents, policies, compliance, and more
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-foreground'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <Bot className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-primary-foreground shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {message.relatedDocs && message.relatedDocs.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-xs opacity-80">
                            <FileText className="h-3 w-3 mr-1" />
                            Related Documents:
                          </div>
                          {message.relatedDocs.map((doc, index) => (
                            <div key={index} className="text-xs opacity-80 hover:opacity-100 cursor-pointer">
                              • {doc}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-60">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.language && (
                          <Badge variant="outline" className="text-xs h-4">
                            <Languages className="h-2 w-2 mr-1" />
                            {message.language}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted/50 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Processing your request...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about documents, policies, compliance... (English/മലയാളം)"
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue('Show me recent safety circulars')}
              className="text-xs h-7"
            >
              Recent Safety Circulars
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue('What compliance items are due this week?')}
              className="text-xs h-7"
            >
              Compliance Due
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue('HR policies in Malayalam')}
              className="text-xs h-7"
            >
              HR നയങ്ങൾ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};