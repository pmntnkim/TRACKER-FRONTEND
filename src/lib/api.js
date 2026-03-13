import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const getFirstErrorMessage = (value) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export const getApiErrorMessage = (error) => {
  const errorData = error.response?.data;

  if (typeof errorData === "string") {
    return errorData;
  }

  if (errorData?.detail) {
    return getFirstErrorMessage(errorData.detail);
  }

  if (errorData?.message) {
    return errorData.message;
  }

  if (errorData && typeof errorData === "object") {
    const firstEntry = Object.entries(errorData)[0];

    if (firstEntry) {
      const [fieldName, fieldError] = firstEntry;
      const message = getFirstErrorMessage(fieldError);

      if (typeof message === "string") {
        return `${fieldName}: ${message}`;
      }
    }
  }

  return error.message || "Request failed.";
};

export const getAuthConfig = (token, extraHeaders = {}) => ({
  headers: {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});