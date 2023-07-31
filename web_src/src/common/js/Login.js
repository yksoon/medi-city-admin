import { routerPath } from "webPath";
import { RestServer } from "./Rest";
import { set_user_info } from "redux/actions/userInfoAction";
import { CommonConsole } from "./Common";
import { set_alert, set_spinner } from "redux/actions/commonAction";

export default function Login(url, data, resultCode, dispatch) {
    RestServer("post", url, data)
        .then(function (response) {
            // response
            let userInfo;

            let resultCode = response.headers.resultCode;

            if (resultCode === "0000") {
                userInfo = response.data.resultInfo;

                let deleteKey = [
                    "md_licenses_number",
                    "signin_policy",
                    "signin_policy_cd",
                    "user_idx",
                    "user_pwd",
                    "user_role",
                    "user_role_cd",
                    "user_salt",
                ];

                for (let i = 0; i < deleteKey.length; i++) {
                    delete userInfo[deleteKey[i]];
                }

                dispatch(set_user_info(JSON.stringify(userInfo)));

                dispatch(
                    set_spinner({
                        isLoading: false,
                    })
                );

                window.location.replace(routerPath.main_url);
            } else if (resultCode === "1003") {
                CommonConsole("log", response);

                CommonConsole("decLog", response);
                // CommonConsole("alertMsg", response);

                dispatch(
                    set_alert({
                        isAlertOpen: true,
                        alertTitle: response.headers.resultMessageKo
                            ? response.headers.resultMessageKo
                            : "",
                        alertContent: "",
                    })
                );

                dispatch(
                    set_spinner({
                        isLoading: false,
                    })
                );
            }
        })
        .catch(function (error) {
            // 오류발생시 실행
            CommonConsole("decLog", error);
            // CommonConsole("alertMsg", error);

            dispatch(
                set_alert({
                    isAlertOpen: true,
                    alertTitle: error.response.headers.resultMessageKo
                        ? error.response.headers.resultMessageKo
                        : "",
                    alertContent: "",
                })
            );

            dispatch(
                set_spinner({
                    isLoading: false,
                })
            );
        });
}
