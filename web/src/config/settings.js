const settings = {
  baseUrl: "https://app.senati.edu.pe/api/v2",
  apiRequestMaxTimeout: 5000,
  logoutScreenDelay: 1500,
  appVersion: "web"
};

if (process.env.NODE_ENV === "development") {
  settings.baseUrl = "/api";
}

export default settings;
