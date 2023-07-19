import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "redux/store/store";

let ip;
let userInfo;

// axios.get("https://geolocation-db.com/json/").then((res) => {
//     ip = res.data.IPv4;
//     localStorage.setItem("connIP", ip);
// });

//TMI 공식 문서에서 axios를 "인스턴스"라고 부른다.
//timeout과 같은 네트워크 요청도 처리할 수 있다.
// create메소드의 인자로 객체를 전달하고 이 객체 안에 설정값(config)를 설정할 수 있다.

const Instance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

// const userInfo;
Instance.interceptors.request.use(
    (config) => {
        userInfo = store.getState().userInfo.userInfo;
        ip = store.getState().ipInfo.ipInfo;

        config.headers["Medicity-Src"] = ip ? ip : "";
        config.headers["Medicity-Token"] = userInfo ? userInfo.token : "";
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export { Instance };
