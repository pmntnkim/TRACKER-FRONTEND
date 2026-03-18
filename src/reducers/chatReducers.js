import {
  CHAT_SEND_MESSAGE_REQUEST,
  CHAT_SEND_MESSAGE_SUCCESS,
  CHAT_SEND_MESSAGE_FAIL,
  CHAT_RESET
} from "../constants/chatConstants"

const initialState = {
  loading: false,
  messages: [
    {
      id: 1,
      role: "assistant",
      content:
        "Hey! I'm your AI fitness coach. Ask me anything about training, nutrition, recovery, or your workout program. Let's crush your goals together! 💪",
      timestamp: new Date().toISOString()
    }
  ],
  error: null
}

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_SEND_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        messages: [
          ...state.messages,
          {
            id: Date.now(),
            role: "user",
            content: action.payload,
            timestamp: new Date().toISOString()
          }
        ]
      }
    case CHAT_SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: [
          ...state.messages,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: action.payload.reply || action.payload.message || action.payload.content,
            timestamp: new Date().toISOString()
          }
        ],
        error: null
      }
    case CHAT_SEND_MESSAGE_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CHAT_RESET:
      return initialState
    default:
      return state
  }
}
