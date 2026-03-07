import {
    PROGRESS_ANALYTICS_REQUEST,
    PROGRESS_ANALYTICS_SUCCESS,
    PROGRESS_ANALYTICS_FAIL
} from '../constants/progressConstants';
import axios from 'axios';

export const getProgressAnalytics = () => async (dispatch, getState) => {
    dispatch({ type: PROGRESS_ANALYTICS_REQUEST });

    try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/progress/analytics');
        dispatch({ type: PROGRESS_ANALYTICS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: PROGRESS_ANALYTICS_FAIL, payload: error.message });
    }
};
