import { RestServer } from "./Rest";
import { set_user_info } from "redux/actions/userInfoAction";
import { set_alert, set_spinner } from "redux/actions/commonAction";
import { apiPath, routerPath } from "webPath";
import { CommonConsole } from "./Common";

const tokenExpire = (dispatch) => {
    dispatch(
        set_spinner({
            isLoading: true,
        })
    );

    dispatch(
        set_alert({
            isAlertOpen: true,
            title: "비정상적인 접근입니다.",
        })
    );

    // signout
    // url : /v1/signout
    // method : POST
    const url = apiPath.api_auth_signout;
    let data = {};

    RestServer("post", url, data)
        .then(function (response) {
            // response
            let result_code = response.headers.result_code;

            if (result_code === "0000") {
                // localStorage.removeItem("userInfo");
                dispatch(set_user_info(null));

                dispatch(
                    set_spinner({
                        isLoading: false,
                    })
                );

                window.location.replace(routerPath.login_url);
            }
        })
        .catch(function (error) {
            // 오류발생시 실행
            CommonConsole("log", error);
            CommonConsole("decLog", error);
            // CommonConsole("alertMsg", error);

            // Spinner
            dispatch(
                set_spinner({
                    isLoading: false,
                })
            );

            dispatch(
                set_alert({
                    isAlertOpen: true,
                    title: error.response.headers.result_message_ko,
                })
            );

            dispatch(set_user_info(null));
        });
};

export default tokenExpire;
