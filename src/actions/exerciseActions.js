import {
    EXERCISE_LIST_REQUEST,
    EXERCISE_LIST_SUCCESS,
    EXERCISE_LIST_FAIL,
    EXERCISE_DETAILS_REQUEST,
    EXERCISE_DETAILS_SUCCESS,
    EXERCISE_DETAILS_FAIL,
} from "../constants/exerciseConstants";
import axios from "axios";

export const listExercises = () => async (dispatch) => {
    try {
        dispatch({ type: EXERCISE_LIST_REQUEST });
        const { data } = await axios.get('https://127.0.0.1:8000/api/exercises');
        dispatch({ type: EXERCISE_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: EXERCISE_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const getExerciseDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: EXERCISE_DETAILS_REQUEST });
        const { data } = await axios.get(`https://127.0.0.1:8000/api/exercises/${id}`);
        dispatch({ type: EXERCISE_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: EXERCISE_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};