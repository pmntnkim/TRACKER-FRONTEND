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
    EXERCISE_UPDATE_REQUEST,
    EXERCISE_UPDATE_SUCCESS,
    EXERCISE_UPDATE_FAIL,
    EXERCISE_DELETE_REQUEST,
    EXERCISE_DELETE_SUCCESS,
    EXERCISE_DELETE_FAIL,
} from "../constants/exerciseConstants";
import { apiClient, getApiErrorMessage, getAuthConfig } from "../lib/api";

const getExerciseFilters = (filters = {}) => {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined)
    );
};

const getAccessToken = (getState) => {
    return getState().authLogin.userInfo?.token;
};

export const listExercises = (filters = {}) => async (dispatch) => {
    try {
        dispatch({ type: EXERCISE_LIST_REQUEST });

        const { data } = await apiClient.get("/exercises/", {
            params: getExerciseFilters(filters),
        });
        dispatch({ type: EXERCISE_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: EXERCISE_LIST_FAIL,
            payload: getApiErrorMessage(error),
        });
    }
};

export const getExerciseDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_DETAILS_REQUEST });

        const token = getAccessToken(getState);

        const { data } = await apiClient.get(
            `/exercises/${id}/`,
            getAuthConfig(token)
        );
        dispatch({ type: EXERCISE_DETAILS_SUCCESS, payload: data });
        return data;
    } catch (error) {
        const message = getApiErrorMessage(error);
        dispatch({
            type: EXERCISE_DETAILS_FAIL,
            payload: message,
        });
        throw new Error(message);
    }
};

export const createExercise = (exerciseData) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_CREATE_REQUEST });

        const token = getAccessToken(getState);
        const config = getAuthConfig(token, { "Content-Type": "application/json" });

        const { data } = await apiClient.post("/exercises/", exerciseData, config);
        dispatch({ type: EXERCISE_CREATE_SUCCESS, payload: data });
        return data;
    } catch (error) {
        const message = getApiErrorMessage(error);
        dispatch({
            type: EXERCISE_CREATE_FAIL,
            payload: message,
        });
        throw new Error(message);
    }
};

export const updateExercise = (id, exerciseData) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_UPDATE_REQUEST });

        const token = getAccessToken(getState);
        const config = getAuthConfig(token, { "Content-Type": "application/json" });

        const { data } = await apiClient.put(`/exercises/${id}/`, exerciseData, config);
        dispatch({ type: EXERCISE_UPDATE_SUCCESS, payload: data });
        return data;
    } catch (error) {
        const message = getApiErrorMessage(error);
        dispatch({
            type: EXERCISE_UPDATE_FAIL,
            payload: message,
        });
        throw new Error(message);
    }
};

export const deleteExercise = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_DELETE_REQUEST });

        const token = getAccessToken(getState);
        const config = getAuthConfig(token);

        await apiClient.delete(`/exercises/${id}/`, config);
        dispatch({ type: EXERCISE_DELETE_SUCCESS, payload: id });
        return id;
    } catch (error) {
        const message = getApiErrorMessage(error);
        dispatch({
            type: EXERCISE_DELETE_FAIL,
            payload: message,
        });
        throw new Error(message);
    }
};