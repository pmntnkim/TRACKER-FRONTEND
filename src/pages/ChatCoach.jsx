import React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Lock, Sparkles } from "lucide-react"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { sendMessage, resetChat } from "../actions/chatActions"

const ChatCoach = () => {
  const dispatch = useDispatch()
  const { loading: isLoading, messages, messageCount } = useSelector(
    state => state.chat
  )

  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  const maxFreeMessages = 5
  const isPremiumLocked = messageCount >= maxFreeMessages

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!input.trim() || isPremiumLocked || isLoading) return
    dispatch(sendMessage(input.trim()))
    setInput("")
  }

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
          {messages.map(message => (
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
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
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
                <button
                  onClick={() => dispatch(resetChat())}
                  className="angrit-btn-primary text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Reset Chat (Demo)
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
            onChange={e => setInput(e.target.value)}
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

        {!isPremiumLocked && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            {maxFreeMessages - messageCount} free messages remaining
          </p>
        )}
      </main>
    </div>
  )
}

export default ChatCoach