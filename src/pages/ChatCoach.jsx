import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Bot, User, Loader2, Lock, Sparkles, Crown } from "lucide-react"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../actions/authActions"
import PremiumDialog from "../components/PremiumDialog"
import useChatCoach from "../hooks/useChatCoach"

const formatMessageTime = timestamp => {
  if (!timestamp) {
    return ""
  }

  const value = new Date(timestamp)
  if (Number.isNaN(value.getTime())) {
    return ""
  }

  return value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}

const normalizeAssistantContent = content => {
  if (!content) {
    return ""
  }

  return String(content)
    .replace(/\r\n?/g, "\n")
    .replace(/\s+\*\s+\*\*/g, "\n\n- **")
    .replace(/\s+(\d+\.\s+\*\*)/g, "\n\n$1")
    .replace(/\s+\*Remember:\*/gi, "\n\n**Remember:**")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

const renderInlineFormatting = (text, keyPrefix) => {
  const segments = String(text).split(/(\*\*[^*]+\*\*)/g)

  return segments.map((segment, index) => {
    const key = `${keyPrefix}-${index}`
    const boldMatch = segment.match(/^\*\*([^*]+)\*\*$/)

    if (boldMatch) {
      return <strong key={key}>{boldMatch[1]}</strong>
    }

    return <React.Fragment key={key}>{segment}</React.Fragment>
  })
}

const renderAssistantMessage = content => {
  const normalized = normalizeAssistantContent(content)
  const lines = normalized.split("\n").map(line => line.trim()).filter(Boolean)

  return (
    <div className="space-y-2 text-sm leading-relaxed text-foreground/95">
      {lines.map((line, index) => {
        const bulletMatch = line.match(/^-\s+(.*)$/)
        const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/)

        if (bulletMatch) {
          return (
            <div key={`assistant-line-${index}`} className="flex items-start gap-2">
              <span className="mt-1 text-primary">•</span>
              <p>{renderInlineFormatting(bulletMatch[1], `assistant-bullet-${index}`)}</p>
            </div>
          )
        }

        if (numberedMatch) {
          return (
            <div key={`assistant-line-${index}`} className="flex items-start gap-2">
              <span className="mt-0.5 min-w-5 text-primary font-semibold">{numberedMatch[1]}.</span>
              <p>{renderInlineFormatting(numberedMatch[2], `assistant-numbered-${index}`)}</p>
            </div>
          )
        }

        return (
          <p key={`assistant-line-${index}`}>
            {renderInlineFormatting(line, `assistant-paragraph-${index}`)}
          </p>
        )
      })}
    </div>
  )
}

const ChatCoach = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.authLogin)
  const token = userInfo?.token || localStorage.getItem("angrit_token")

  const [input, setInput] = useState("")
  const [showPremiumDialog, setShowPremiumDialog] = useState(false)
  const messagesEndRef = useRef(null)

  const handleUnauthorized = useCallback(() => {
    dispatch(logout())
    navigate("/login", { replace: true })
  }, [dispatch, navigate])

  const {
    loading,
    sending,
    error,
    paywallMessage,
    messages,
    isPremium,
    remainingFreeMessages,
    isUnlimited,
    isBlocked,
    loadHistory,
    sendMessage,
  } = useChatCoach({ token, onUnauthorized: handleUnauthorized })

  const isInputDisabled = loading || sending || isBlocked

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!input.trim() || isInputDisabled) {
      return
    }

    const result = await sendMessage(input.trim())
    if (result?.ok) {
      setInput("")
    }
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
                {loading ? "Syncing your chat history..." : "Your personal fitness advisor"}
              </p>
            </div>
            <div className="ml-auto">
              {isPremium ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-primary/30 bg-primary/10 text-primary">
                  <Crown className="w-3 h-3" />
                  Premium
                </span>
              ) : typeof remainingFreeMessages === "number" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-border bg-secondary text-secondary-foreground">
                  {remainingFreeMessages} free left
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-border bg-secondary text-secondary-foreground">
                  Unlimited
                </span>
              )}
            </div>
          </div>
        </div>

        {error && !paywallMessage && (
          <div className="mb-4 p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-sm text-destructive flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadHistory}
              disabled={loading || sending}
              className="text-xs font-semibold underline underline-offset-2 disabled:opacity-60"
            >
              Retry
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {!loading && messages.length === 0 && (
            <div className="h-full min-h-[220px] flex items-center justify-center text-center text-sm text-muted-foreground">
              Start the conversation by asking your coach a fitness question.
            </div>
          )}

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
                } ${message.pending ? "opacity-70" : ""}`}
              >
                {message.role === "assistant" ? (
                  renderAssistantMessage(message.content)
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                )}
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                    {formatMessageTime(message.timestamp)}
                </p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {(loading || sending) && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {loading ? "Loading conversation..." : "Thinking..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Premium Lock */}
        {(isBlocked || paywallMessage) && (
          <div className="mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Chat access limited</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {paywallMessage ||
                    "You have reached your free limit. Upgrade to Premium for unlimited AI coaching."}
                </p>
                <button
                  onClick={() => setShowPremiumDialog(true)}
                  className="angrit-btn-primary text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Go Premium
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
              isBlocked
                ? "Upgrade to continue chatting..."
                : loading
                ? "Loading chat history..."
                : "Ask me anything about fitness..."
            }
            disabled={isInputDisabled}
            className="angrit-input flex-1 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isInputDisabled}
            className="angrit-btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

        {!isPremium && !isUnlimited && typeof remainingFreeMessages === "number" && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            {remainingFreeMessages} free messages remaining
          </p>
        )}

        <PremiumDialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog} />
      </main>
    </div>
  )
}

export default ChatCoach