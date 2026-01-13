import React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Lock, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";

const ChatCoach = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hey! I'm your AI fitness coach. Ask me anything about training, nutrition, recovery, or your workout program. Let's crush your goals together! 💪",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);

  const maxFreeMessages = 5;
  const isPremiumLocked = messageCount >= maxFreeMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    const responses = {
      default:
        "That's a great question! Based on your training goals, I'd recommend focusing on progressive overload. Start with a weight you can handle for 8-10 reps with good form, then gradually increase either weight, reps, or sets each week. Consistency is key! 🎯",
      nutrition:
        "For muscle building, aim for 1.6-2.2g of protein per kg of bodyweight. Space it across 4-5 meals throughout the day. Don't forget carbs for energy and fats for hormone production! A balanced approach works best. 🍗",
      recovery:
        "Recovery is where the magic happens! Aim for 7-9 hours of quality sleep, stay hydrated, and consider active recovery like light walking or stretching on rest days. Your muscles grow when you rest, not when you train! 😴",
      motivation:
        "Remember why you started! Every rep, every set, every workout is taking you closer to your goals. Progress isn't always linear, but consistency always wins. You've got this! 🔥",
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("eat") || lowerMessage.includes("nutrition") || lowerMessage.includes("diet") || lowerMessage.includes("protein")) {
      return responses.nutrition;
    }
    if (lowerMessage.includes("rest") || lowerMessage.includes("recover") || lowerMessage.includes("sleep")) {
      return responses.recovery;
    }
    if (lowerMessage.includes("motivation") || lowerMessage.includes("tired") || lowerMessage.includes("give up")) {
      return responses.motivation;
    }
    return responses.default;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isPremiumLocked) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setMessageCount((prev) => prev + 1);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse = {
      id: Date.now() + 1,
      role: "assistant",
      content: simulateAIResponse(userMessage.content),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col">
        {/* Header */}
        <div className="py-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">AI Coach</h1>
              <p className="text-sm text-muted-foreground">
                Your personal fitness advisor
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}

              <div
                className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-md"
                    : "bg-card border border-border rounded-tl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Premium Lock */}
        {isPremiumLocked && (
          <div className="mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Free limit reached</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You've used all {maxFreeMessages} free messages. Upgrade to
                  Premium for unlimited AI coaching.
                </p>
                <button className="angrit-btn-primary text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Unlock Premium
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isPremiumLocked
                ? "Upgrade to continue chatting..."
                : "Ask me anything about fitness..."
            }
            disabled={isPremiumLocked || isLoading}
            className="angrit-input flex-1 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isPremiumLocked || isLoading}
            className="angrit-btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Message Counter */}
        {!isPremiumLocked && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            {maxFreeMessages - messageCount} free messages remaining
          </p>
        )}
      </main>
    </div>
  );
};

export default ChatCoach;