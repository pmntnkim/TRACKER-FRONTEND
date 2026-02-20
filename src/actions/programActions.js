import {
    PROGRAM_GENERATE_REQUEST,
    PROGRAM_GENERATE_SUCCESS,
    PROGRAM_GENERATE_FAIL,
    PROGRAM_RESET
} from '../constants/programConstants';
import axios from 'axios';

export const generateProgram = (requirements) => async (dispatch) => {
    try {
        dispatch({ type: PROGRAM_GENERATE_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            'https://127.0.0.1:8000/api/programs/generate/',
            { requirements },
            config
        );
        dispatch({ type: PROGRAM_GENERATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PROGRAM_GENERATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const resetProgram = () => async (dispatch) => {
    dispatch({ type: PROGRAM_RESET });
};