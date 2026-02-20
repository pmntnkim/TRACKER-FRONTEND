import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL
} from "../constants/authConstants"

const initialState = {
  loading: false,
  userInfo: localStorage.getItem("angrit_token")
    ? { token: localStorage.getItem("angrit_token") }
    : null,
  error: null
}

export const authLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
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
    default:
      return state
  }
}
