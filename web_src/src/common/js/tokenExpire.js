import { RestServer } from "./Rest";
import { init_user_info, set_user_info } from "redux/actions/userInfoAction";
import { set_alert, set_spinner } from "redux/actions/commonAction";
import { apiPath, routerPath } from "webPath";
import { CommonConsole } from "./Common";
import { useSelector } from "react-redux";
import store from "redux/store/store";

const tokenExpire = (dispatch) => {
    dispatch(
        set_spinner({
            isLoading: true,
        })
    );

    // dispatch(
    //     set_alert({
    //         isAlertOpen: true,
    //         alertTitle: "비정상적인 접근입니다.",
    //     })
    // );

    dispatch(
        set_alert({
            isAlertOpen: true,
            alertTitle: "잠시후 다시 시도해주세요",
        })
    );

    // let userInfo = store.getState().userInfo.userInfo;

    // // signout
    // // url : /v1/signout
    // // method : POST
    // const url = apiPath.api_auth_signout;
    // let data = {};

    // RestServer("post", url, data)
    //     .then(function (response) {
    //         // response
    //         let result_code = response.headers.result_code;

    //         if (result_code === "0000") {
    //             // localStorage.removeItem("userInfo");
    //             // dispatch(set_user_info(null));
    //             dispatch(init_user_info);

    //             dispatch(
    //                 set_spinner({
    //                     isLoading: false,
    //                 })
    //             );

    //             window.location.replace(routerPath.login_url);
    //         }
    //     })
    //     .catch(function (error) {
    //         // 오류발생시 실행
    //         CommonConsole("log", error);
    //         CommonConsole("decLog", error);
    //         // CommonConsole("alertMsg", error);

    //         // Spinner
    //         dispatch(
    //             set_spinner({
    //                 isLoading: false,
    //             })
    //         );

    //         dispatch(
    //             set_alert({
    //                 isAlertOpen: true,
    //                 title: error.response.headers.result_message_ko,
    //             })
    //         );

    //         // dispatch(set_user_info(null));
    //         dispatch(init_user_info);
    //     });
};

export default tokenExpire;
