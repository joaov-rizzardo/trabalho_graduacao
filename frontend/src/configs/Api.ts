import { BACKEND_PORT, BACKEND_URL } from "@env";
import axios from "axios";

const apiURL = `${BACKEND_URL}:${BACKEND_PORT}`

export const backendApi = axios.create({
    baseURL: apiURL
})