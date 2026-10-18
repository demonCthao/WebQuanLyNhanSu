import axios from "axios";
import axiosRetry from "axios-retry";

/**
 * =========================
 * AXIOS INSTANCE
 * =========================
 */
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 20000,
});

/**
 * =========================
 * RETRY CONFIG
 * =========================
 */
axiosRetry(api, {
    retries: 2,
    retryCondition: (error) => {
        const status = error.response?.status;

        // chỉ retry các lỗi network / timeout / server
        if (!status) return true;

        return [408, 413, 429, 500, 502, 503, 504].includes(status);
    },
    retryDelay: (retryCount) => {
        return retryCount * 500;
    },
});

/**
 * =========================
 * REQUEST INTERCEPTOR
 * =========================
 */
api.interceptors.request.use(
    (config) => {
        const jwt = localStorage.getItem("jwt");

        if (jwt) {
            try {
                const token = JSON.parse(jwt)?.access_token;

                if (token) {
                    config.headers = config.headers ?? {};
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("JWT parse error", e);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * =========================
 * RESPONSE INTERCEPTOR
 * =========================
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const status = error.response?.status;

        /**
         * =========================
         * 401 HANDLING
         * =========================
         */
        if (status === 401) {
            if (!window.location.pathname.includes("/login")) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        /**
         * =========================
         * NORMALIZE ERROR MESSAGE
         * =========================
         */
        const responseData = error.response?.data;

        if (responseData?.message) {
            error.message = responseData.message;
        }

        return Promise.reject(error);
    }
);