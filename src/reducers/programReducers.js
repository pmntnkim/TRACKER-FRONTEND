import {
  PROGRAM_GENERATE_REQUEST,
  PROGRAM_GENERATE_SUCCESS,
  PROGRAM_GENERATE_FAIL,
  PROGRAM_RESET
} from "../constants/programConstants"

const initialState = {
  loading: false,
  program: [],
  generatedSplit: null,
  error: null
}

const getWeeksFromPayload = payload => {
  if (Array.isArray(payload)) {
    return payload
  }
  if (Array.isArray(payload?.weeks)) {
    return payload.weeks
  }
  return []
}

export const programReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROGRAM_GENERATE_REQUEST:
      return { ...state, loading: true, error: null }
    case PROGRAM_GENERATE_SUCCESS:
      return {
        loading: false,
        program: getWeeksFromPayload(action.payload),
        generatedSplit: action.payload?.split ?? null,
        error: null
      }
    case PROGRAM_GENERATE_FAIL:
      return { loading: false, program: [], generatedSplit: null, error: action.payload }
    case PROGRAM_RESET:
      return initialState
    default:
      return state
  }
}
