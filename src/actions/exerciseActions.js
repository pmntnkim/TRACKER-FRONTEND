import {
    EXERCISE_DELETE_FAIL,
    EXERCISE_DELETE_REQUEST,
    EXERCISE_DELETE_SUCCESS,
    EXERCISE_DETAILS_FAIL,
    EXERCISE_DETAILS_REQUEST,
    EXERCISE_DETAILS_SUCCESS,
    EXERCISE_LIST_FAIL,
    EXERCISE_LIST_REQUEST,
    EXERCISE_LIST_SUCCESS,
    EXERCISE_SAVE_FAIL,
    EXERCISE_SAVE_REQUEST,
    EXERCISE_SAVE_SUCCESS
} from "../constants/exerciseConstants"
import axios from "axios"

const EXERCISE_API_URL = "http://127.0.0.1:8000/api/exercises/"

const getErrorMessage = error => {
    if (typeof error.response?.data?.detail === "string") {
        return error.response.data.detail
    }

    if (error.response?.data && typeof error.response.data === "object") {
        const firstFieldError = Object.values(error.response.data).find(value =>
            Array.isArray(value) ? value.length > 0 : Boolean(value)
        )

        if (Array.isArray(firstFieldError)) {
            return firstFieldError[0]
        }

        if (typeof firstFieldError === "string") {
            return firstFieldError
        }
    }

    return error.response?.data?.message || error.message
}

const buildConfig = (getState, includeJson = false) => {
    const {
        authLogin: { userInfo }
    } = getState()

    const headers = {}
    if (includeJson) {
        headers["Content-Type"] = "application/json"
    }

    if (userInfo?.token) {
        headers.Authorization = `Bearer ${userInfo.token}`
    }

    return { headers }
}

export const listExercises = (filters = {}) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_LIST_REQUEST })

        const params = new URLSearchParams()
        if (filters.q?.trim()) {
            params.set("q", filters.q.trim())
        }
        if (filters.category && filters.category !== "all") {
            params.set("category", filters.category)
        }
        if (filters.difficultyLevel && filters.difficultyLevel !== "all") {
            params.set("difficulty_level", filters.difficultyLevel)
        }

        const queryString = params.toString()
        const config = buildConfig(getState)
        const url = queryString ? `${EXERCISE_API_URL}?${queryString}` : EXERCISE_API_URL

        const { data } = await axios.get(url, config)
        dispatch({ type: EXERCISE_LIST_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: EXERCISE_LIST_FAIL,
            payload: getErrorMessage(error)
        })
    }
}

export const getExerciseDetails = id => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_DETAILS_REQUEST })

        const config = buildConfig(getState)
        const { data } = await axios.get(`${EXERCISE_API_URL}${id}/`, config)
        dispatch({ type: EXERCISE_DETAILS_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: EXERCISE_DETAILS_FAIL,
            payload: getErrorMessage(error)
        })
    }
}

export const saveExercise = exercise => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_SAVE_REQUEST })

        const config = buildConfig(getState, true)
        const payload = { ...exercise }

        const { data } = payload.id
            ? await axios.put(`${EXERCISE_API_URL}${payload.id}/`, payload, config)
            : await axios.post(EXERCISE_API_URL, payload, config)

        dispatch({ type: EXERCISE_SAVE_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: EXERCISE_SAVE_FAIL,
            payload: getErrorMessage(error)
        })
    }
}

export const deleteExercise = id => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_DELETE_REQUEST })

        const config = buildConfig(getState)
        await axios.delete(`${EXERCISE_API_URL}${id}/`, config)

        dispatch({ type: EXERCISE_DELETE_SUCCESS })
    } catch (error) {
        dispatch({
            type: EXERCISE_DELETE_FAIL,
            payload: getErrorMessage(error)
        })
    }
}