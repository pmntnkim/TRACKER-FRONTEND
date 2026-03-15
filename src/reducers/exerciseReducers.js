import {
  EXERCISE_LIST_REQUEST,
  EXERCISE_LIST_SUCCESS,
  EXERCISE_LIST_FAIL,
  EXERCISE_DETAILS_REQUEST,
  EXERCISE_DETAILS_SUCCESS,
  EXERCISE_DETAILS_FAIL,
  EXERCISE_DETAILS_RESET,
  EXERCISE_SAVE_REQUEST,
  EXERCISE_SAVE_SUCCESS,
  EXERCISE_SAVE_FAIL,
  EXERCISE_SAVE_RESET,
  EXERCISE_DELETE_REQUEST,
  EXERCISE_DELETE_SUCCESS,
  EXERCISE_DELETE_FAIL,
  EXERCISE_DELETE_RESET
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
    case EXERCISE_DETAILS_RESET:
      return detailsInitialState
    default:
      return state
  }
}

const saveInitialState = {
  loading: false,
  success: false,
  exercise: null,
  error: null
}

export const exerciseSaveReducer = (state = saveInitialState, action) => {
  switch (action.type) {
    case EXERCISE_SAVE_REQUEST:
      return { ...state, loading: true, success: false, error: null }
    case EXERCISE_SAVE_SUCCESS:
      return {
        loading: false,
        success: true,
        exercise: action.payload,
        error: null
      }
    case EXERCISE_SAVE_FAIL:
      return { loading: false, success: false, exercise: null, error: action.payload }
    case EXERCISE_SAVE_RESET:
      return saveInitialState
    default:
      return state
  }
}

const deleteInitialState = {
  loading: false,
  success: false,
  error: null
}

export const exerciseDeleteReducer = (state = deleteInitialState, action) => {
  switch (action.type) {
    case EXERCISE_DELETE_REQUEST:
      return { ...state, loading: true, success: false, error: null }
    case EXERCISE_DELETE_SUCCESS:
      return { loading: false, success: true, error: null }
    case EXERCISE_DELETE_FAIL:
      return { loading: false, success: false, error: action.payload }
    case EXERCISE_DELETE_RESET:
      return deleteInitialState
    default:
      return state
  }
}
