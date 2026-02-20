import {
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    USER_PROFILE_UPDATE_REQUEST,
    USER_PROFILE_UPDATE_SUCCESS,
    USER_PROFILE_UPDATE_FAIL,
} from "../constants/userConstants";
import axios from "axios";

export const getUserProfile = () => async (dispatch) => {
    try {
        dispatch({ type: USER_PROFILE_REQUEST });
        const { data } = await axios.get('https://127.0.0.1:8000/api/users/profile/');
        dispatch({ type: USER_PROFILE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_PROFILE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const updateUserProfile = (user) => async (dispatch) => {
    try {
        dispatch({ type: USER_PROFILE_UPDATE_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.put(
            'https://127.0.0.1:8000/api/users/profile/',
            user,
            config
        );
        dispatch({ type: USER_PROFILE_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_PROFILE_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};