import { RestServer } from "common/js/Rest";
import { CommonConsole } from "src/common/js/Common";
import { apiPath } from "webPath";

const tokenRefresh = async (callback) => {
    // let retVal;
    const url = apiPath.api_auth_refresh;
    const data = {};

    await RestServer("post", url, data)
        .then((response) => {
            let retVal = true;
            callback(retVal);
        })
        .catch((error) => {
            CommonConsole("log", error);
            CommonConsole("decLog", error);

            let retVal = false;
            callback(retVal);
        });
};

const tokenRefreshCallback = (func) => {
    // 콜백 함수 정의
    const tokenRefreshCallback = (retVal) => {
        console.log(retVal);

        if (retVal) {
            func();
        }
    };

    // tokenRefresh 함수 호출 및 콜백 함수 전달
    tokenRefresh(tokenRefreshCallback);
};

export default tokenRefreshCallback;
