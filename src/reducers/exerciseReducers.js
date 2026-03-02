import {
  EXERCISE_LIST_REQUEST,
  EXERCISE_LIST_SUCCESS,
  EXERCISE_LIST_FAIL,
  EXERCISE_DETAILS_REQUEST,
  EXERCISE_DETAILS_SUCCESS,
  EXERCISE_DETAILS_FAIL,
  EXERCISE_CREATE_REQUEST,
  EXERCISE_CREATE_SUCCESS,
  EXERCISE_CREATE_FAIL,
  EXERCISE_CREATE_RESET,
  EXERCISE_UPDATE_REQUEST,
  EXERCISE_UPDATE_SUCCESS,
  EXERCISE_UPDATE_FAIL,
  EXERCISE_UPDATE_RESET,
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
    default:
      return state
  }
}

const createInitialState = {
  loading: false,
  success: false,
  exercise: null,
  error: null,
}

export const exerciseCreateReducer = (state = createInitialState, action) => {
  switch (action.type) {
    case EXERCISE_CREATE_REQUEST:
      return { ...state, loading: true, success: false, error: null }
    case EXERCISE_CREATE_SUCCESS:
      return { loading: false, success: true, exercise: action.payload, error: null }
    case EXERCISE_CREATE_FAIL:
      return { loading: false, success: false, exercise: null, error: action.payload }
    case EXERCISE_CREATE_RESET:
      return { ...createInitialState }
    default:
      return state
  }
}

// update reducer
const updateInitialState = {
  loading: false,
  success: false,
  exercise: null,
  error: null,
}

export const exerciseUpdateReducer = (state = updateInitialState, action) => {
  switch (action.type) {
    case EXERCISE_UPDATE_REQUEST:
      return { ...state, loading: true, success: false, error: null }
    case EXERCISE_UPDATE_SUCCESS:
      return { loading: false, success: true, exercise: action.payload, error: null }
    case EXERCISE_UPDATE_FAIL:
      return { loading: false, success: false, exercise: null, error: action.payload }
    case EXERCISE_UPDATE_RESET:
      return { ...updateInitialState }
    default:
      return state
  }
}

// delete reducer
const deleteInitialState = {
  loading: false,
  success: false,
  error: null,
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
      return { ...deleteInitialState }
    default:
      return state
  }
}
