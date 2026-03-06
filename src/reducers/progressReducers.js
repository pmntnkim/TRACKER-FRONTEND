import {
    PROGRESS_ANALYTICS_REQUEST,
    PROGRESS_ANALYTICS_SUCCESS,
    PROGRESS_ANALYTICS_FAIL
} from "../constants/progressConstants"

const initialState = {
    loading: false,
    analytics: null,
    error: null
}

export const progressAnalyticsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROGRESS_ANALYTICS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case PROGRESS_ANALYTICS_SUCCESS:
            return {
                ...state,
                loading: false,
                analytics: action.payload
            }
        case PROGRESS_ANALYTICS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}
