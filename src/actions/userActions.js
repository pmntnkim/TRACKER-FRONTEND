import {
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    USER_PROFILE_UPDATE_REQUEST,
    USER_PROFILE_UPDATE_SUCCESS,
    USER_PROFILE_UPDATE_FAIL,
} from "../constants/userConstants";
import { markProfileCompleted } from "./authActions";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const getErrorMessage = (error) => {
    return (
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message
    );
};

export const getUserProfile = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_PROFILE_REQUEST });
        const {
            authLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        const { data } = await axios.get(`${BASE_URL}/api/users/profile/`, config);
        dispatch({ type: USER_PROFILE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_PROFILE_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_PROFILE_UPDATE_REQUEST });
        const {
            authLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };
        const { data } = await axios.put(
            `${BASE_URL}/api/users/profile/`,
            user,
            config
        );
        dispatch({ type: USER_PROFILE_UPDATE_SUCCESS, payload: data });
        dispatch(markProfileCompleted());
    } catch (error) {
        dispatch({
            type: USER_PROFILE_UPDATE_FAIL,
            payload: getErrorMessage(error),
        });
    }
};