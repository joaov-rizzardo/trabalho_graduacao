import { BACKEND_PORT, BACKEND_URL } from "@env";
import axios from "axios";

export const backendApi = axios.create({
    baseURL: `${BACKEND_URL}:${BACKEND_PORT}`
})