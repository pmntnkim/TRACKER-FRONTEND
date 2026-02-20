import {
  PROGRAM_GENERATE_REQUEST,
  PROGRAM_GENERATE_SUCCESS,
  PROGRAM_GENERATE_FAIL,
  PROGRAM_RESET
} from "../constants/programConstants"

const initialState = {
  loading: false,
  program: [],
  error: null
}

export const programReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROGRAM_GENERATE_REQUEST:
      return { ...state, loading: true, error: null }
    case PROGRAM_GENERATE_SUCCESS:
      return { loading: false, program: action.payload, error: null }
    case PROGRAM_GENERATE_FAIL:
      return { loading: false, program: [], error: action.payload }
    case PROGRAM_RESET:
      return initialState
    default:
      return state
  }
}
