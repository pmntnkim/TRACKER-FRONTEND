import {
  WORKOUT_LOG_LIST_REQUEST,
  WORKOUT_LOG_LIST_SUCCESS,
  WORKOUT_LOG_LIST_FAIL,
  WORKOUT_LOG_CREATE_REQUEST,
  WORKOUT_LOG_CREATE_SUCCESS,
  WORKOUT_LOG_CREATE_FAIL,
  WORKOUT_LOG_DELETE_REQUEST,
  WORKOUT_LOG_DELETE_SUCCESS,
  WORKOUT_LOG_DELETE_FAIL,
  DASHBOARD_STATS_REQUEST,
  DASHBOARD_STATS_SUCCESS,
  DASHBOARD_STATS_FAIL
} from "../constants/workoutConstants"

const logInitialState = {
  loading: false,
  workouts: [],
  error: null,
  createLoading: false,
  createSuccess: false,
  createError: null,
  deleteLoading: false,
  deleteError: null
}

const statsInitialState = {
  loading: false,
  stats: null,
  error: null
}

export const workoutLogReducer = (state = logInitialState, action) => {
  switch (action.type) {
    case WORKOUT_LOG_LIST_REQUEST:
      return { ...state, loading: true, error: null }
    case WORKOUT_LOG_LIST_SUCCESS:
      return { ...state, loading: false, workouts: action.payload, error: null }
    case WORKOUT_LOG_LIST_FAIL:
      return { ...state, loading: false, error: action.payload }
    case WORKOUT_LOG_CREATE_REQUEST:
      return {
        ...state,
        createLoading: true,
        createSuccess: false,
        createError: null
      }
    case WORKOUT_LOG_CREATE_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createSuccess: true,
        workouts: [action.payload, ...state.workouts],
        createError: null
      }
    case WORKOUT_LOG_CREATE_FAIL:
      return { ...state, createLoading: false, createError: action.payload }
    case WORKOUT_LOG_DELETE_REQUEST:
      return { ...state, deleteLoading: true, deleteError: null }
    case WORKOUT_LOG_DELETE_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        workouts: state.workouts.filter(w => w.id !== action.payload),
        deleteError: null
      }
    case WORKOUT_LOG_DELETE_FAIL:
      return { ...state, deleteLoading: false, deleteError: action.payload }
    default:
      return state
  }
}

export const dashboardStatsReducer = (state = statsInitialState, action) => {
  switch (action.type) {
    case DASHBOARD_STATS_REQUEST:
      return { ...state, loading: true, error: null }
    case DASHBOARD_STATS_SUCCESS:
      return { loading: false, stats: action.payload, error: null }
    case DASHBOARD_STATS_FAIL:
      return { loading: false, stats: null, error: action.payload }
    default:
      return state
  }
}
