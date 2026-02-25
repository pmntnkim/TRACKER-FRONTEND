import {
    EXERCISE_LIST_REQUEST,
    EXERCISE_LIST_SUCCESS,
    EXERCISE_LIST_FAIL,
    EXERCISE_DETAILS_REQUEST,
    EXERCISE_DETAILS_SUCCESS,
    EXERCISE_DETAILS_FAIL,
} from "../constants/exerciseConstants";
import axios from "axios";

const getErrorMessage = (error) => {
    return (
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message
    );
};

export const listExercises = () => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_LIST_REQUEST });

        const {
            authLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        const { data } = await axios.get("http://127.0.0.1:8000/api/exercises/", config);
        dispatch({ type: EXERCISE_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: EXERCISE_LIST_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const getExerciseDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_DETAILS_REQUEST });

        const {
            authLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        const { data } = await axios.get(`http://127.0.0.1:8000/api/exercises/${id}/`, config);
        dispatch({ type: EXERCISE_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: EXERCISE_DETAILS_FAIL,
            payload: getErrorMessage(error),
        });
    }
};