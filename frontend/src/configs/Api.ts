import { BACKEND_PORT, BACKEND_URL } from "@env";
import axios from "axios";

export const apiURL = `${BACKEND_URL}:${BACKEND_PORT}`

console.log(apiURL)
console.log(BACKEND_URL)

export const backendApi = axios.create({
    baseURL: apiURL
})