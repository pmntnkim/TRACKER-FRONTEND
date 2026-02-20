import {
    CHAT_SEND_MESSAGE_REQUEST,
    CHAT_SEND_MESSAGE_SUCCESS,
    CHAT_SEND_MESSAGE_FAIL,
    CHAT_RESET,
} from "../constants/chatConstants";
import axios from "axios";

export const sendMessage = (message) => async (dispatch) => {
    try {
        dispatch({ type: CHAT_SEND_MESSAGE_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            'https://127.0.0.1:8000/api/chat/send-message/',
            { message },
            config
        );
        dispatch({ type: CHAT_SEND_MESSAGE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CHAT_SEND_MESSAGE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const resetChat = () => async (dispatch) => {
    dispatch({ type: CHAT_RESET });
};