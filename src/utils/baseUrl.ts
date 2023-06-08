import axios, { AxiosInstance } from "axios";
const api: AxiosInstance = axios.create({
  baseURL: `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/`,
  headers: {
    "Content-type": "application/json",
    withCredentials: false,
  },
});

export default api;
