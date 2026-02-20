import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_RESET,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_FAIL
} from "../constants/userConstants"

const initialState = {
  loading: false,
  profile: null,
  error: null,
  updateLoading: false,
  updateSuccess: false,
  updateError: null
}

export const userProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return { ...state, loading: true, error: null }
    case USER_PROFILE_SUCCESS:
      return { ...state, loading: false, profile: action.payload, error: null }
    case USER_PROFILE_FAIL:
      return { ...state, loading: false, error: action.payload }
    case USER_PROFILE_UPDATE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateSuccess: false,
        updateError: null
      }
    case USER_PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        profile: action.payload,
        updateSuccess: true,
        updateError: null
      }
    case USER_PROFILE_UPDATE_FAIL:
      return { ...state, updateLoading: false, updateError: action.payload }
    case USER_PROFILE_RESET:
      return initialState
    default:
      return state
  }
}
