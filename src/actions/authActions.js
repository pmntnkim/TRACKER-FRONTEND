import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_RESET,
    USER_PROFILE_COMPLETED,
    USER_FORGOT_PASSWORD_REQUEST,
    USER_FORGOT_PASSWORD_SUCCESS,
    USER_FORGOT_PASSWORD_FAIL,
    USER_FORGOT_PASSWORD_RESET,
    USER_RESET_PASSWORD_REQUEST,
    USER_RESET_PASSWORD_SUCCESS,
    USER_RESET_PASSWORD_FAIL,
} from "../constants/authConstants";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const getErrorMessage = (error) => {
    return (
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message
    );
};

export const login = (identifier, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/users/login/`,
            { username: identifier, password },
            config
        );
        const token = data?.token || data?.access;
        if (!token) {
            throw new Error("Authentication failed: token missing from response.");
        }

        const payload = { ...data, token };
        dispatch({ type: USER_LOGIN_SUCCESS, payload });
        localStorage.setItem("angrit_token", token);
        localStorage.setItem("angrit_user_info", JSON.stringify(payload));
    } catch (error) {
        localStorage.removeItem("angrit_token");
        localStorage.removeItem("angrit_user_info");
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const register = (username, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/auth/register/`,
            { username, email, password },
            config
        );
        localStorage.removeItem("angrit_token");
        localStorage.removeItem("angrit_user_info");
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const resetRegisterState = () => (dispatch) => {
    dispatch({ type: USER_REGISTER_RESET });
};

export const logout = () => async (dispatch) => {
    localStorage.removeItem("angrit_token");
    localStorage.removeItem("angrit_user_info");
    dispatch({ type: USER_LOGOUT });
};

export const markProfileCompleted = () => (dispatch, getState) => {
    dispatch({ type: USER_PROFILE_COMPLETED });
    const {
        authLogin: { userInfo },
    } = getState();
    if (userInfo) {
        localStorage.setItem("angrit_user_info", JSON.stringify(userInfo));
        localStorage.setItem("angrit_token", userInfo.token);
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/users/forgot-password/`,
            { email },
            config
        );
        dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_FORGOT_PASSWORD_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const resetPassword = (token, password, confirmPassword) => async (dispatch) => {
    try {
        dispatch({ type: USER_RESET_PASSWORD_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/users/reset-password/`,
            { token, password, confirmPassword },
            config
        );
        dispatch({ type: USER_RESET_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_RESET_PASSWORD_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const resetForgotPasswordState = () => (dispatch) => {
    dispatch({ type: USER_FORGOT_PASSWORD_RESET });
};