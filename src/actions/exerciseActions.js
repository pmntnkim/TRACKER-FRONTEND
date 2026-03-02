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
    EXERCISE_DELETE_FAIL
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

// create a new exercise (supports image file or URL)
export const createExercise = (exerciseData) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_CREATE_REQUEST });

        const {
            authLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        // build a payload object containing only the expected fields
        let payload;
        if (exerciseData.sampleImageFile) {
            const form = new FormData();
            form.append("name", exerciseData.name);
            form.append("description", exerciseData.description || "");
            form.append("sample_image", exerciseData.sampleImageFile);
            if (exerciseData.video_url) form.append("video_url", exerciseData.video_url);
            if (exerciseData.category) form.append("category", exerciseData.category);
            if (exerciseData.difficulty) form.append("difficulty", exerciseData.difficulty);
            if (exerciseData.muscle_group) form.append("muscle_group", exerciseData.muscle_group);
            payload = form;
            config.headers["Content-Type"] = "multipart/form-data";
        } else {
            // non-file request, stick to primitive values
            payload = {
                name: exerciseData.name,
                description: exerciseData.description || "",
                sample_image: exerciseData.sample_image || "",
                video_url: exerciseData.video_url || "",
                category: exerciseData.category || "",
                difficulty: exerciseData.difficulty || "",
                muscle_group: exerciseData.muscle_group || "",
            };
        }

        const { data } = await axios.post("http://127.0.0.1:8000/api/exercises/", payload, config);
        dispatch({ type: EXERCISE_CREATE_SUCCESS, payload: data });
    } catch (error) {
        // log full error body for debugging
        console.error("createExercise error:", error.response?.data || error);
        dispatch({
            type: EXERCISE_CREATE_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

// update existing exercise
export const updateExercise = (exerciseId, exerciseData) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_UPDATE_REQUEST });

        const {
            authLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        let payload;
        if (exerciseData.sampleImageFile) {
            const form = new FormData();
            form.append("name", exerciseData.name);
            form.append("description", exerciseData.description || "");
            form.append("sample_image", exerciseData.sampleImageFile);
            if (exerciseData.video_url) form.append("video_url", exerciseData.video_url);
            if (exerciseData.category) form.append("category", exerciseData.category);
            if (exerciseData.difficulty) form.append("difficulty", exerciseData.difficulty);
            if (exerciseData.muscle_group) form.append("muscle_group", exerciseData.muscle_group);
            payload = form;
            config.headers["Content-Type"] = "multipart/form-data";
        } else {
            payload = {
                name: exerciseData.name,
                description: exerciseData.description || "",
                sample_image: exerciseData.sample_image || "",
                video_url: exerciseData.video_url || "",
                category: exerciseData.category || "",
                difficulty: exerciseData.difficulty || "",
                muscle_group: exerciseData.muscle_group || "",
            };
        }

        const { data } = await axios.put(
            `http://127.0.0.1:8000/api/exercises/${exerciseId}/`,
            payload,
            config
        );
        dispatch({ type: EXERCISE_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        console.error("updateExercise error:", error.response?.data || error);
        dispatch({
            type: EXERCISE_UPDATE_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

// delete exercise by id
export const deleteExercise = (exerciseId) => async (dispatch, getState) => {
    try {
        dispatch({ type: EXERCISE_DELETE_REQUEST });

        const {
            authLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        await axios.delete(`http://127.0.0.1:8000/api/exercises/${exerciseId}/`, config);
        dispatch({ type: EXERCISE_DELETE_SUCCESS });
    } catch (error) {
        console.error("deleteExercise error:", error.response?.data || error);
        dispatch({
            type: EXERCISE_DELETE_FAIL,
            payload: getErrorMessage(error),
        });
    }
};