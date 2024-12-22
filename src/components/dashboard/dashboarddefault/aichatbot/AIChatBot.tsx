import { FC, FormEvent, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, X } from "lucide-react";
import HeaderAvatar from "../../layout/header/HeaderAvatar";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatbot: FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI assistant. How can I help you today with invoices, products, customers, or team management?",
    },
  ]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    try {
      const response = await fetch(
        `http://localhost:1010/assistant?q=${encodeURIComponent(input)}`
      );
      if (response.ok) {
        const data = await response.json();
        const botResponse: Message = {
          id: messages.length + 2,
          type: "bot",
          content: data.data || "I'm sorry, I didn't understand that.",
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    } catch (error) {
      const errorResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: "Sorry, there was an error connecting to the assistant.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="border-0 w-full h-full flex flex-col shadow-lg">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/90"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-grow px-4 py-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  } rounded-2xl p-3`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.type === "user" && <HeaderAvatar />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-4 bg-background border-t"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow rounded-full"
          />
          <Button type="submit" size="icon" className="shrink-0 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIChatbot;
