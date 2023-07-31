import useAlert from "hook/useAlert";
import {
    CommonConsole,
    CommonErrorCatch,
    CommonNotify,
} from "common/js/Common";
import { RestServer } from "common/js/Rest";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { set_spinner } from "redux/actions/commonAction";
import { set_page } from "redux/actions/pageActios";
import {
    init_user_info,
    set_user_info,
    set_user_token,
} from "redux/actions/userInfoAction";
import { apiPath, routerPath } from "webPath";

const LoginMain = () => {
    const userToken = useSelector((state) => state.userInfo.userToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { alert } = useAlert();

    const inputID = useRef(null);
    const inputPW = useRef(null);

    useEffect(() => {
        if (userToken) {
            navigate(routerPath.main_url);
        } else {
            dispatch(set_page("dashboard"));
            dispatch(init_user_info);
            inputID.current.focus();
        }
    }, []);

    const clickLogin = () => {
        if (!inputID.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "아이디를 입력해주세요",
            });

            inputID.current.focus();
            return false;
        }
        if (!inputPW.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "비밀번호를 입력해주세요",
            });

            inputPW.current.focus();
            return false;
        }

        dispatch(
            set_spinner({
                isLoading: true,
            })
        );

        login();
    };

    const login = () => {
        // auth/v1/signin
        // POST
        let url = apiPath.api_auth_login;
        let data = {
            signupType: "000",
            userId: inputID.current.value,
            userPwd: inputPW.current.value,
            adminYn: "Y",
        };

        RestServer("post", url, data)
            .then((response) => {
                let res = response;
                let resultCode = res.headers.resultCode;

                if (resultCode === "0000") {
                    let userInfo = response.data.resultInfo;

                    let deleteKey = [
                        "mdLicensesNumber",
                        "signinPolicy",
                        "signinPolicyCd",
                        "userPwd",
                        "userRole",
                        "userSalt",
                    ];

                    for (let i = 0; i < deleteKey.length; i++) {
                        delete userInfo[deleteKey[i]];
                    }

                    dispatch(init_user_info);

                    // sessionStorage.setItem(
                    //     "userInfo",
                    //     JSON.stringify(userInfo)
                    // );
                    dispatch(set_user_info(JSON.stringify(userInfo)));

                    dispatch(set_user_token(JSON.stringify(userInfo)));

                    navigate(routerPath.main_url);
                } else {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.result_message_ko,
                    });
                }

                CommonConsole("log", response);
            })
            .catch((error) => {
                CommonErrorCatch(error, dispatch, alert);
            });
    };

    const handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            clickLogin(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };

    return (
        <>
            <div className="login_wrap">
                <div className="login">
                    <h1>
                        <img src="img/common/logo.png" alt="" />
                    </h1>
                    <p>로그인을 해주세요</p>
                    <div className="input_id">
                        <h5>아이디</h5>
                        <input
                            type="text"
                            className="input"
                            placeholder="ID"
                            ref={inputID}
                            onKeyDown={handleOnKeyPress} // Enter 입력 이벤트 함수
                            // defaultValue="ksyong3@naver.com"
                        />
                    </div>
                    <div>
                        <h5>비밀번호</h5>
                        <input
                            type="password"
                            className="input"
                            placeholder="PW"
                            ref={inputPW}
                            onKeyDown={handleOnKeyPress} // Enter 입력 이벤트 함수
                            // defaultValue="123qwe123!@#"
                        />
                    </div>
                    <div className="flex login_btn">
                        <div>
                            {/* <input type="checkbox" id="id_remember" />{" "}
                            <label htmlFor="id_remember">아이디 저장</label> */}
                        </div>
                        <div>
                            <Link className="subbtn on" onClick={clickLogin}>
                                로그인
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="login_wrap"></div> */}
        </>
    );
};

export default LoginMain;
