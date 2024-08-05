import axios from "axios";

import settings from "../../config/settings";

const { appVersion } = settings;

const api = axios.create({
  baseURL: settings.baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-app-version": appVersion
  },
  timeout: settings.apiRequestMaxTimeout
});

export default api;
