import axios, { InternalAxiosRequestConfig } from "axios";

const fetch = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 1000,
  headers: {
    "Cache-Control": 'no-cache',
  }
});

fetch.interceptors.request.use(function (request: InternalAxiosRequestConfig<any>) {
  const token = localStorage.getItem('token')
  request.headers.set('Authorization', 'Bearer ' + token)
  return request
})

export default fetch;