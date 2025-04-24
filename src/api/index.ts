import axios from "axios";

const instance = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000/api/v1",
  withCredentials: false,
});

export default instance;
