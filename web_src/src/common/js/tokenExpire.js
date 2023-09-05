import { RestServer } from "./Rest";
import { apiPath, routerPath } from "webPath";
import { CommonConsole, CommonNotify } from "./Common";

const tokenExpire = (
    // dispatch,
    setIsSpinner,
    alert,
    resetUserInfo,
    resetUserToken
) => {
    // dispatch(
    //     set_spinner({
    //         isLoading: true,
    //     })
    // );
    setIsSpinner(true);

    // dispatch(
    //     set_alert({
    //         isAlertOpen: true,
    //         alertTitle: "비정상적인 접근입니다.",
    //     })
    // );

    // CommonNotify({
    //     type: "alert",
    //     hook: alert,
    //     message: "잠시후 다시 시도해주세요",
    // });

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
                // dispatch(set_user_info(null));
                // dispatch(init_user_info(null));

                resetUserInfo();

                resetUserToken();

                // dispatch(
                //     set_spinner({
                //         isLoading: false,
                //     })
                // );
                setIsSpinner(false);

                window.location.replace(routerPath.login_url);
            }
        })
        .catch(function (error) {
            // 오류발생시 실행
            CommonConsole("log", error);
            CommonConsole("decLog", error);
            // CommonConsole("alertMsg", error);

            resetUserInfo();

            resetUserToken();

            // Spinner
            // dispatch(
            //     set_spinner({
            //         isLoading: false,
            //     })
            // );
            setIsSpinner(false);

            CommonNotify({
                type: "alert",
                hook: alert,
                message: error.response.headers.result_message_ko,
                callback: () => goToSignIn(),
            });

            // dispatch(set_user_info(null));
            // dispatch(init_user_info(null));
            const goToSignIn = () => {
                window.location.replace(routerPath.login_url);
            };
        });
};

export default tokenExpire;
