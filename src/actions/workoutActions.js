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
  DASHBOARD_STATS_FAIL,
} from "../constants/workoutConstants"
import axios from "axios"

export const listWorkoutLogs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: WORKOUT_LOG_LIST_REQUEST })
    const { userLogin: { userInfo } } = getState()
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    const { data } = await axios.get('https://127.0.0.1:8000/api/workouts/logs/', config)
    dispatch({ type: WORKOUT_LOG_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: WORKOUT_LOG_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    })
  }
}

export const createWorkoutLog = (logData) => async (dispatch, getState) => {
    try {
        dispatch({ type: WORKOUT_LOG_CREATE_REQUEST })
        const { userLogin: { userInfo } } = getState()
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        const { data } = await axios.post('https://127.0.0.1:8000/api/workouts/logs/', logData, config)
        dispatch({ type: WORKOUT_LOG_CREATE_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: WORKOUT_LOG_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        })
    }
}

export const deleteWorkoutLog = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: WORKOUT_LOG_DELETE_REQUEST })
        const { userLogin: { userInfo } } = getState()
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        await axios.delete(`https://127.0.0.1:8000/api/workouts/logs/${id}/`, config)
        dispatch({ type: WORKOUT_LOG_DELETE_SUCCESS })
    } catch (error) {
        dispatch({
            type: WORKOUT_LOG_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        })
    }
}

export const getDashboardStats = () => async (dispatch, getState) => {
    try {
        dispatch({ type: DASHBOARD_STATS_REQUEST })
        const { userLogin: { userInfo } } = getState()
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        const { data } = await axios.get('https://127.0.0.1:8000/api/workouts/dashboard-stats/', config)
        dispatch({ type: DASHBOARD_STATS_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: DASHBOARD_STATS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        })
    }
}

