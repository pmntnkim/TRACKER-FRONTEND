import {
  EXERCISE_LIST_REQUEST,
  EXERCISE_LIST_SUCCESS,
  EXERCISE_LIST_FAIL,
  EXERCISE_DETAILS_REQUEST,
  EXERCISE_DETAILS_SUCCESS,
  EXERCISE_DETAILS_FAIL
} from "../constants/exerciseConstants"

const listInitialState = {
  loading: false,
  exercises: [],
  error: null
}

const detailsInitialState = {
  loading: false,
  exercise: null,
  error: null
}

export const exerciseListReducer = (state = listInitialState, action) => {
  switch (action.type) {
    case EXERCISE_LIST_REQUEST:
      return { ...state, loading: true, error: null }
    case EXERCISE_LIST_SUCCESS:
      return { loading: false, exercises: action.payload, error: null }
    case EXERCISE_LIST_FAIL:
      return { loading: false, exercises: [], error: action.payload }
    default:
      return state
  }
}

export const exerciseDetailsReducer = (state = detailsInitialState, action) => {
  switch (action.type) {
    case EXERCISE_DETAILS_REQUEST:
      return { ...state, loading: true, error: null }
    case EXERCISE_DETAILS_SUCCESS:
      return { loading: false, exercise: action.payload, error: null }
    case EXERCISE_DETAILS_FAIL:
      return { loading: false, exercise: null, error: action.payload }
    default:
      return state
  }
}
