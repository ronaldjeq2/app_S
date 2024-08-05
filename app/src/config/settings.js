import VersionCheck from "react-native-version-check";

const currentVersion = VersionCheck.getCurrentVersion();

const settings = {
    appVersion: currentVersion,
    baseUrl: "https://app.senati.edu.pe/api/v2",
    oneSignalKey: "4bc1f2a1-bf89-4206-9bf0-05af7bac93a5",
    apiRequestMaxTimeout: 5000,
    oneSignalSyncTagsTimeLapse: 7200, // seconds two hours
    logoutScreenDelay: 1500,
    persistor: null,
};

if (process.env.NODE_ENV === "development") {
    settings.baseUrl = "http://192.168.3.166:3001";
}

export default settings;
