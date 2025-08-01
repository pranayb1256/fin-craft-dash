import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout/Layout";
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  TrendingUp, 
  PiggyBank,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: number;
  content: string;
  type: "user" | "assistant";
  timestamp: Date;
  suggestions?: string[];
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI financial assistant. I can help you with budgeting, investment advice, spending analysis, and financial planning. What would you like to know?",
      type: "assistant",
      timestamp: new Date(),
      suggestions: [
        "Analyze my spending patterns",
        "Suggest budget improvements", 
        "Investment recommendations",
        "Debt payoff strategies"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    {
      icon: TrendingUp,
      title: "Spending Analysis",
      description: "Get insights into your spending habits",
      prompt: "Can you analyze my spending patterns and provide insights?"
    },
    {
      icon: PiggyBank,
      title: "Savings Tips",
      description: "Get personalized savings recommendations",
      prompt: "What are some ways I can save more money based on my current financial situation?"
    },
    {
      icon: Lightbulb,
      title: "Investment Advice",
      description: "Learn about investment opportunities",
      prompt: "Can you suggest some investment strategies suitable for my risk profile?"
    },
    {
      icon: AlertTriangle,
      title: "Budget Review",
      description: "Review and optimize your budget",
      prompt: "Please review my current budget and suggest improvements"
    }
  ];

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("spending") || lowerMessage.includes("analyze")) {
      return "Based on your transaction history, I can see you spend most on Food & Dining ($520/month) and Transportation ($320/month). Here are some insights:\n\n• Your food spending is 65% of your budget - consider meal planning to reduce costs\n• Transportation costs are well within budget\n• You have good saving habits with consistent monthly contributions\n\nWould you like specific recommendations for any category?";
    }
    
    if (lowerMessage.includes("save") || lowerMessage.includes("savings")) {
      return "Here are personalized savings strategies for you:\n\n• **Automate savings**: Set up automatic transfers of $200 after each paycheck\n• **50/30/20 rule**: Allocate 50% to needs, 30% to wants, 20% to savings\n• **Cut subscription audit**: Review and cancel unused subscriptions (potential $50/month savings)\n• **Cook more at home**: Reducing dining out by 30% could save $150/month\n\nImplementing these could increase your savings by $400/month!";
    }
    
    if (lowerMessage.includes("invest") || lowerMessage.includes("investment")) {
      return "Based on your financial profile, here are investment recommendations:\n\n• **Emergency fund first**: Ensure 3-6 months of expenses before investing\n• **Index funds**: Start with low-cost index funds (S&P 500) for diversification\n• **Dollar-cost averaging**: Invest $300-500 monthly consistently\n• **Tax-advantaged accounts**: Maximize 401(k) and IRA contributions\n\nYour current savings rate suggests you could comfortably invest $400/month. Start small and gradually increase!";
    }
    
    if (lowerMessage.includes("budget") || lowerMessage.includes("review")) {
      return "Your budget analysis shows:\n\n**Strengths:**\n• Good income-to-expense ratio\n• Consistent savings contributions\n• Transportation costs under control\n\n**Areas for improvement:**\n• Food budget exceeded by $120 (30%)\n• Entertainment spending at 93% of budget\n• No allocation for unexpected expenses\n\n**Recommendations:**\n• Increase food budget to $600 or implement cost-cutting strategies\n• Add a 'miscellaneous' category for unexpected expenses\n• Consider increasing your emergency fund target";
    }
    
    return "I understand you're looking for financial guidance. As your AI assistant, I can help with budgeting, saving strategies, investment planning, and spending analysis. Could you be more specific about what aspect of your finances you'd like to focus on?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      type: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: messages.length + 2,
        content: generateResponse(inputMessage),
        type: "assistant",
        timestamp: new Date(),
        suggestions: [
          "Tell me more about this",
          "What are the next steps?",
          "Show me an example",
          "How can I implement this?"
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">AI Financial Assistant</h1>
          <p className="text-muted-foreground">
            Get personalized financial advice and insights powered by AI
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-card transition-all duration-300 group"
              onClick={() => handleQuickAction(action.prompt)}
            >
              <CardContent className="p-4 text-center">
                <div className="bg-gradient-primary p-3 rounded-lg w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <action.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              FinSight AI Assistant
            </CardTitle>
            <CardDescription>
              Ask me anything about your finances, budgeting, or investment strategies
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      message.type === "user" 
                        ? "bg-primary" 
                        : "bg-gradient-primary"
                    }`}>
                      {message.type === "user" ? (
                        <User className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[80%] ${
                      message.type === "user" ? "text-right" : ""
                    }`}>
                      <div className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      
                      {message.suggestions && message.type === "assistant" && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.suggestions.map((suggestion, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-gradient-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me about your finances..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-primary shadow-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  <span>Powered by AI • Responses may vary</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Assistant;