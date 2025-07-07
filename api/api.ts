import axios from "axios";

const api = axios.create({
  baseURL: "https://api.exemple.com", // Remplace par ton backend plus tard
  timeout: 5000,
});

export default api;
