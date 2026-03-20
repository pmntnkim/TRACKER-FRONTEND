import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";
const CHAT_API_BASE_URL = `${BASE_URL}/api/chat`

/**
 * @typedef {Object} ChatMessage
 * @property {number|string} id
 * @property {"user"|"assistant"} role
 * @property {string} content
 * @property {string} timestamp
 */

/**
 * @typedef {Object} ChatHistoryResponse
 * @property {number|null} conversationId
 * @property {ChatMessage[]} messages
 * @property {boolean} isPremium
 * @property {number|null} remainingFreeMessages
 */

/**
 * @typedef {Object} SendMessageRequest
 * @property {string} message
 * @property {number} [conversation_id]
 */

/**
 * @typedef {Object} SendMessageResponse
 * @property {number|null} conversationId
 * @property {ChatMessage|null} assistantMessage
 * @property {boolean} isPremium
 * @property {number|null} remainingFreeMessages
 */

const buildHeaders = token => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
})

const toNumberOrNull = value => {
  if (value === null || value === undefined) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const toRole = role => {
  if (role === "user" || role === "assistant") {
    return role
  }

  const normalized = String(role || "").toLowerCase()
  if (normalized === "ai" || normalized === "bot" || normalized === "coach") {
    return "assistant"
  }

  return "user"
}

const normalizeMessage = (rawMessage, index, fallbackRole = "assistant") => {
  const roleSource =
    rawMessage?.role || rawMessage?.sender || rawMessage?.message_type || fallbackRole
  const contentSource =
    rawMessage?.content || rawMessage?.message || rawMessage?.text || rawMessage?.reply || ""
  const timestamp =
    rawMessage?.timestamp || rawMessage?.created_at || rawMessage?.createdAt || new Date().toISOString()

  return {
    id: rawMessage?.id || `${Date.now()}-${index}`,
    role: toRole(roleSource),
    content: String(contentSource || ""),
    timestamp,
  }
}

const extractConversationId = payload => {
  return (
    toNumberOrNull(payload?.conversation_id) ||
    toNumberOrNull(payload?.conversationId) ||
    toNumberOrNull(payload?.active_conversation?.id) ||
    toNumberOrNull(payload?.activeConversation?.id)
  )
}

const extractPremiumFlag = payload => {
  return Boolean(
    payload?.is_premium ??
      payload?.isPremium ??
      payload?.active_conversation?.is_premium ??
      payload?.activeConversation?.isPremium
  )
}

const extractRemainingFreeMessages = payload => {
  const raw =
    payload?.remaining_free_messages ??
    payload?.remainingFreeMessages ??
    payload?.active_conversation?.remaining_free_messages ??
    payload?.activeConversation?.remainingFreeMessages

  return raw === null ? null : toNumberOrNull(raw)
}

const extractMessages = payload => {
  const list =
    (Array.isArray(payload?.messages) && payload.messages) ||
    (Array.isArray(payload?.active_conversation?.messages) && payload.active_conversation.messages) ||
    (Array.isArray(payload?.activeConversation?.messages) && payload.activeConversation.messages) ||
    []

  return list.map((message, index) => normalizeMessage(message, index))
}

const extractAssistantMessage = payload => {
  if (payload?.assistant_message || payload?.assistantMessage) {
    return normalizeMessage(payload.assistant_message || payload.assistantMessage, 0, "assistant")
  }

  const text = payload?.reply || payload?.response || payload?.content || payload?.message
  if (!text) {
    return null
  }

  return normalizeMessage({ content: text, role: "assistant" }, 0, "assistant")
}

export const toChatApiError = error => {
  const status = error?.response?.status || null
  const data = error?.response?.data || null
  const message =
    data?.detail ||
    data?.message ||
    data?.error ||
    (Array.isArray(data?.non_field_errors) ? data.non_field_errors.join(" ") : null) ||
    error?.message ||
    "Request failed"

  const normalizedError = new Error(String(message))
  normalizedError.status = status
  normalizedError.data = data
  return normalizedError
}

export const isInvalidConversationIdError = error => {
  if (error?.status !== 400) {
    return false
  }

  const backendPayload = JSON.stringify(error?.data || {})
  const combinedText = `${error?.message || ""} ${backendPayload}`
  return /conversation[_\s-]?id|invalid conversation/i.test(combinedText)
}

/**
 * @param {string} token
 * @returns {Promise<ChatHistoryResponse>}
 */
export const fetchChatHistory = async token => {
  try {
    const { data } = await axios.get(`${CHAT_API_BASE_URL}/history/`, buildHeaders(token))

    return {
      conversationId: extractConversationId(data),
      messages: extractMessages(data),
      isPremium: extractPremiumFlag(data),
      remainingFreeMessages: extractRemainingFreeMessages(data),
    }
  } catch (error) {
    throw toChatApiError(error)
  }
}

/**
 * @param {string} token
 * @param {SendMessageRequest} payload
 * @returns {Promise<SendMessageResponse>}
 */
export const sendChatMessage = async (token, payload) => {
  try {
    const requestBody = {
      message: payload.message,
      ...(typeof payload.conversation_id === "number"
        ? { conversation_id: payload.conversation_id }
        : {}),
    }

    const { data } = await axios.post(
      `${CHAT_API_BASE_URL}/send-message/`,
      requestBody,
      buildHeaders(token)
    )

    return {
      conversationId: extractConversationId(data),
      assistantMessage: extractAssistantMessage(data),
      isPremium: extractPremiumFlag(data),
      remainingFreeMessages: extractRemainingFreeMessages(data),
    }
  } catch (error) {
    throw toChatApiError(error)
  }
}
