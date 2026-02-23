import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_FORGOT_PASSWORD_REQUEST,
    USER_FORGOT_PASSWORD_SUCCESS,
    USER_FORGOT_PASSWORD_FAIL,
    USER_FORGOT_PASSWORD_RESET,
    USER_RESET_PASSWORD_REQUEST,
    USER_RESET_PASSWORD_SUCCESS,
    USER_RESET_PASSWORD_FAIL,
} from "../constants/authConstants";
import axios from "axios";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            'https://127.0.0.1:8000/api/users/login/',
            { email, password },
            config
        );
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            'https://127.0.0.1:8000/api/users/register/',
            { name, email, password },
            config
        );
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const logout = () => async (dispatch) => {
    dispatch({ type: USER_LOGOUT });
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
            'https://127.0.0.1:8000/api/users/forgot-password/',
            { email },
            config
        );
        dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_FORGOT_PASSWORD_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
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
            'https://127.0.0.1:8000/api/users/reset-password/',
            { token, password, confirmPassword },
            config
        );
        dispatch({ type: USER_RESET_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_RESET_PASSWORD_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const resetForgotPasswordState = () => (dispatch) => {
    dispatch({ type: USER_FORGOT_PASSWORD_RESET });
};