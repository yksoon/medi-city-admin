import { useDispatch, useSelector } from "react-redux";
import { Instance } from "./Instance";
import store from "redux/store/store";

let ip;
let userInfo;

const RestServer = (method, url, data) => {
    // userInfo = useSelector((state) => state.userInfo.userInfo);

    // // const userInfo;
    // Instance.interceptors.request.use(
    //     (config) => {
    //         // userInfo = store.getState().userInfo.userInfo;
    //         ip = store.getState().ipInfo.ipInfo;

    //         console.log("token", userInfo ? userInfo.token : "");

    //         config.headers["Medicity-Src"] = ip ? ip : "";
    //         config.headers["Medicity-Token"] = userInfo ? userInfo.token : "";
    //         return config;
    //     },
    //     (err) => {
    //         return Promise.reject(err);
    //     }
    // );

    switch (method) {
        case "get":
            return Instance.get(url, data);

        case "post":
            return Instance.post(url, data);

        case "put":
            return Instance.put(url, data);

        case "delete":
            return Instance.delete(url, data);

        default:
            break;
    }
};

export { RestServer };
