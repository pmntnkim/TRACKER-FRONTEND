import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_PROFILE_COMPLETED,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_FORGOT_PASSWORD_RESET,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
} from "../constants/authConstants"

const storedUserInfo = (() => {
  try {
    const raw = localStorage.getItem("angrit_user_info")
    if (raw) return JSON.parse(raw)
  } catch (error) {
    localStorage.removeItem("angrit_user_info")
  }

  const token = localStorage.getItem("angrit_token")
  return token ? { token } : null
})()

const initialState = {
  loading: false,
  userInfo: storedUserInfo,
  error: null
}

export const authLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true, userInfo: null, error: null }
    case USER_REGISTER_REQUEST:
      return { ...state, loading: true, error: null }
    case USER_LOGIN_SUCCESS:
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload, error: null }
    case USER_LOGIN_FAIL:
    case USER_REGISTER_FAIL:
      return { loading: false, userInfo: null, error: action.payload }
    case USER_LOGOUT:
      return { loading: false, userInfo: null, error: null }
    case USER_PROFILE_COMPLETED:
      return {
        ...state,
        userInfo: state.userInfo
          ? {
              ...state.userInfo,
              needs_profile: false
            }
          : state.userInfo
      }
    default:
      return state
  }
}

const forgotPasswordInitialState = {
  loading: false,
  success: false,
  message: "",
  error: null
}

export const forgotPasswordReducer = (state = forgotPasswordInitialState, action) => {
  switch (action.type) {
    case USER_FORGOT_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, success: false }
    case USER_FORGOT_PASSWORD_SUCCESS:
      return { loading: false, success: true, message: action.payload.message || "Check your email for instructions", error: null }
    case USER_FORGOT_PASSWORD_FAIL:
      return { loading: false, success: false, message: "", error: action.payload }
    case USER_FORGOT_PASSWORD_RESET:
      return forgotPasswordInitialState
    default:
      return state
  }
}

const resetPasswordInitialState = {
  loading: false,
  success: false,
  message: "",
  error: null
}

export const resetPasswordReducer = (state = resetPasswordInitialState, action) => {
  switch (action.type) {
    case USER_RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, success: false }
    case USER_RESET_PASSWORD_SUCCESS:
      return { loading: false, success: true, message: action.payload.message || "Password reset successful", error: null }
    case USER_RESET_PASSWORD_FAIL:
      return { loading: false, success: false, message: "", error: action.payload }
    case USER_FORGOT_PASSWORD_RESET:
      return resetPasswordInitialState
    default:
      return state
  }
}
