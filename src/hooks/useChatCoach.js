import { useCallback, useEffect, useMemo, useReducer, useRef } from "react"
import {
  fetchChatHistory,
  sendChatMessage,
  isInvalidConversationIdError,
} from "../services/chatApi"

const initialState = {
  loading: true,
  sending: false,
  error: "",
  paywallMessage: "",
  conversationId: null,
  messages: [],
  isPremium: false,
  remainingFreeMessages: null,
}

const actionTypes = {
  LOAD_START: "LOAD_START",
  LOAD_SUCCESS: "LOAD_SUCCESS",
  LOAD_ERROR: "LOAD_ERROR",
  SEND_START: "SEND_START",
  SEND_SUCCESS: "SEND_SUCCESS",
  SEND_ERROR: "SEND_ERROR",
  RESET_CONVERSATION: "RESET_CONVERSATION",
}

const chatReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOAD_START:
      return {
        ...state,
        loading: true,
        error: "",
        paywallMessage: "",
      }

    case actionTypes.LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        sending: false,
        error: "",
        paywallMessage: "",
        conversationId: action.payload.conversationId,
        messages: action.payload.messages,
        isPremium: action.payload.isPremium,
        remainingFreeMessages: action.payload.remainingFreeMessages,
      }

    case actionTypes.LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }

    case actionTypes.SEND_START:
      return {
        ...state,
        sending: true,
        error: "",
        paywallMessage: "",
        messages: [...state.messages, action.payload.userMessage],
      }

    case actionTypes.SEND_SUCCESS: {
      const updatedMessages = state.messages.map(message =>
        message.id === action.payload.tempId
          ? { ...message, pending: false }
          : message
      )

      if (action.payload.assistantMessage) {
        updatedMessages.push(action.payload.assistantMessage)
      }

      return {
        ...state,
        sending: false,
        error: "",
        paywallMessage: "",
        messages: updatedMessages,
        conversationId: action.payload.conversationId,
        isPremium: action.payload.isPremium,
        remainingFreeMessages: action.payload.remainingFreeMessages,
      }
    }

    case actionTypes.SEND_ERROR:
      return {
        ...state,
        sending: false,
        error: action.payload.error,
        paywallMessage: action.payload.paywallMessage,
        messages: state.messages.filter(message => message.id !== action.payload.tempId),
      }

    case actionTypes.RESET_CONVERSATION:
      return {
        ...state,
        conversationId: null,
      }

    default:
      return state
  }
}

const createUserMessage = content => ({
  id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role: "user",
  content,
  timestamp: new Date().toISOString(),
  pending: true,
})

const createAssistantFallbackMessage = () => ({
  id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role: "assistant",
  content: "I could not generate a response this time. Please try again.",
  timestamp: new Date().toISOString(),
})

const getErrorMessage = error => error?.message || "Something went wrong. Please try again."

const useChatCoach = ({ token, onUnauthorized }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const unauthorizedHandlerRef = useRef(onUnauthorized)

  useEffect(() => {
    unauthorizedHandlerRef.current = onUnauthorized
  }, [onUnauthorized])

  const isUnlimited = state.isPremium || state.remainingFreeMessages === null
  const isBlocked =
    !isUnlimited &&
    typeof state.remainingFreeMessages === "number" &&
    state.remainingFreeMessages <= 0

  const loadHistory = useCallback(async () => {
    if (!token) {
      if (unauthorizedHandlerRef.current) {
        unauthorizedHandlerRef.current(new Error("Missing token"))
      }

      dispatch({
        type: actionTypes.LOAD_ERROR,
        payload: { error: "Please log in to continue." },
      })
      return
    }

    dispatch({ type: actionTypes.LOAD_START })

    try {
      const history = await fetchChatHistory(token)
      dispatch({
        type: actionTypes.LOAD_SUCCESS,
        payload: history,
      })
    } catch (error) {
      if (error.status === 401 && unauthorizedHandlerRef.current) {
        unauthorizedHandlerRef.current(error)
      }

      dispatch({
        type: actionTypes.LOAD_ERROR,
        payload: { error: getErrorMessage(error) },
      })
    }
  }, [token])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const sendMessage = useCallback(
    async rawMessage => {
      const message = rawMessage.trim()
      if (!message || state.loading || state.sending || isBlocked || !token) {
        return { ok: false }
      }

      const userMessage = createUserMessage(message)
      dispatch({ type: actionTypes.SEND_START, payload: { userMessage } })

      let retriedAfterConversationReset = false
      let currentConversationId = state.conversationId

      while (true) {
        try {
          const response = await sendChatMessage(token, {
            message,
            ...(typeof currentConversationId === "number"
              ? { conversation_id: currentConversationId }
              : {}),
          })

          dispatch({
            type: actionTypes.SEND_SUCCESS,
            payload: {
              tempId: userMessage.id,
              assistantMessage: response.assistantMessage || createAssistantFallbackMessage(),
              conversationId:
                typeof response.conversationId === "number"
                  ? response.conversationId
                  : currentConversationId,
              isPremium: response.isPremium,
              remainingFreeMessages: response.remainingFreeMessages,
            },
          })

          return { ok: true }
        } catch (error) {
          if (
            !retriedAfterConversationReset &&
            typeof currentConversationId === "number" &&
            isInvalidConversationIdError(error)
          ) {
            retriedAfterConversationReset = true
            currentConversationId = null
            dispatch({ type: actionTypes.RESET_CONVERSATION })
            continue
          }

          if (error.status === 401 && unauthorizedHandlerRef.current) {
            unauthorizedHandlerRef.current(error)
          }

          dispatch({
            type: actionTypes.SEND_ERROR,
            payload: {
              tempId: userMessage.id,
              error: getErrorMessage(error),
              paywallMessage: error.status === 403 ? getErrorMessage(error) : "",
            },
          })

          return { ok: false, error }
        }
      }
    },
    [isBlocked, state.conversationId, state.loading, state.sending, token]
  )

  return useMemo(
    () => ({
      ...state,
      isBlocked,
      isUnlimited,
      loadHistory,
      sendMessage,
    }),
    [isBlocked, isUnlimited, loadHistory, sendMessage, state]
  )
}

export default useChatCoach
