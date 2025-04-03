	import axios, { } from 'axios';
	import queryString from 'query-string';
	import { JWT_LOCAL_STORAGE_KEY } from "../constants/data.ts";

	const axiosClient = axios.create({
		baseURL: "http://localhost:8082",
		headers: {
			"Content-Type": "application/json",
		},
		paramsSerializer: (params) => queryString.stringify(params),
	});

	axiosClient.interceptors.request.use(async (config) => {

		const accessToken = window.localStorage.getItem(JWT_LOCAL_STORAGE_KEY);

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	});

	axiosClient.interceptors.response.use((response) => {
		console.log("Full Response:", response);
		return  response;
	}, (error) => {
		console.log("Axios Error:", error);
		return Promise.reject(error);
	});
	


	export default axiosClient;