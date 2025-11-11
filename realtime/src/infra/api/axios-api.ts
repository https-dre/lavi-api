import axios from "axios";

const axiosApi = axios.create({
  baseURL: Bun.env.API_ADDR,
  timeout: 1000,
  headers: { "x-service": "realtime-service" },
});

export { axiosApi };
