import {
    PROGRESS_ANALYTICS_REQUEST,
    PROGRESS_ANALYTICS_SUCCESS,
    PROGRESS_ANALYTICS_FAIL
} from '../constants/progressConstants';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const getProgressAnalytics = () => async (dispatch, getState) => {
    dispatch({ type: PROGRESS_ANALYTICS_REQUEST });

    try {
        const { data } = await axios.get(`${BASE_URL}/api/progress/analytics`);
        dispatch({ type: PROGRESS_ANALYTICS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: PROGRESS_ANALYTICS_FAIL, payload: error.message });
    }
};
