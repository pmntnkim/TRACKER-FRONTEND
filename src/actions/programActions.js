import {
    PROGRAM_GENERATE_REQUEST,
    PROGRAM_GENERATE_SUCCESS,
    PROGRAM_GENERATE_FAIL,
    PROGRAM_RESET
} from '../constants/programConstants';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const generateProgram = (requirements) => async (dispatch, getState) => {
    try {
        dispatch({ type: PROGRAM_GENERATE_REQUEST });
        const {
            authLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/programs/generate/`,
            { requirements },
            config
        );
        dispatch({ type: PROGRAM_GENERATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PROGRAM_GENERATE_FAIL,
            payload:
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message,
        });
    }
};

export const resetProgram = () => async (dispatch) => {
    dispatch({ type: PROGRAM_RESET });
};