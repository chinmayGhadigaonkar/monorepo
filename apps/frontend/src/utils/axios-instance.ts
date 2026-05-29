import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.BETTER_AUTH_URL,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 403) {
                console.error("Unauthorized! Redirecting to login...");
                window.location.href = "/signin";
            }
        } else if (error.request) {
            console.error("Request Error", error.request);
        } else {
            console.error("Axios Config Error", error);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
