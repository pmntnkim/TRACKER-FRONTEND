import {
    CHAT_SEND_MESSAGE_REQUEST,
    CHAT_SEND_MESSAGE_SUCCESS,
    CHAT_SEND_MESSAGE_FAIL,
    CHAT_RESET,
} from "../constants/chatConstants";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const sendMessage = (message) => async (dispatch) => {
    try {
        dispatch({ type: CHAT_SEND_MESSAGE_REQUEST, payload: message });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/chat/send-message/`,
            { message },
            config
        );
        dispatch({ type: CHAT_SEND_MESSAGE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CHAT_SEND_MESSAGE_FAIL,
            payload:
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message,
        });
    }
};

export const resetChat = () => async (dispatch) => {
    dispatch({ type: CHAT_RESET });
};