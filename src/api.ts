import axios from "axios";

// https://github.com/axios/axios
export const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 2000,
});
