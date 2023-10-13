import axios from "axios";

let ip;
let token;

// application/json
const Instance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

Instance.interceptors.request.use(
    (config) => {
        // ip = store.getState().ipInfo.ipInfo;
        // token = store.getState().userInfo.userToken;

        // config.headers["Medicity-Src"] = ip ? ip : "";
        // config.headers["Medicity-Token"] = token ? token : "";
        // return config;

        setInterceptors(config);
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// multipart/form-data
const Instance_multi = axios.create({
    headers: {
        "Content-Type": "multipart/form-data",
        // "Content-Type": "multipart/mixed",
    },
    timeout: 5000,
});

Instance_multi.interceptors.request.use(
    (config) => {
        // ip = store.getState().ipInfo.ipInfo;
        // token = store.getState().userInfo.userToken;

        // config.headers["Medicity-Src"] = ip ? ip : "";
        // config.headers["Medicity-Token"] = token ? token : "";
        // return config;

        setInterceptors(config);
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

const setInterceptors = (config) => {
    // ip = store.getState().ipInfo.ipInfo;
    // token = store.getState().userInfo.userToken;

    // ip =
    //     JSON.parse(sessionStorage.getItem("recoilSession")).ipInfo !== null
    //         ? JSON.parse(sessionStorage.getItem("recoilSession")).ipInfo
    //         : sessionStorage.getItem("ipInfo");
    const recoilSession = JSON.parse(sessionStorage.getItem("recoilSession"));

    ip =
        recoilSession === null
            ? sessionStorage.getItem("ipInfo")
            : recoilSession.ipInfo;
    token = recoilSession === null ? "" : recoilSession.userToken;

    config.headers["Medipeople-Src"] = ip ? ip : "";
    config.headers["Medipeople-Token"] = token ? token : "";

    return config;
};

export { Instance, Instance_multi };
