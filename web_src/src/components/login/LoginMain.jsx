import { CommonConsole } from "common/js/Common";
import { RestServer } from "common/js/Rest";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { set_alert, set_spinner } from "redux/actions/commonAction";
import { set_user_info } from "redux/actions/userInfoAction";
import { apiPath, routerPath } from "webPath";

const LoginMain = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const inputID = useRef(null);
    const inputPW = useRef(null);

    useEffect(() => {
        dispatch(set_user_info(null));

        inputID.current.focus();
    }, []);

    const clickLogin = () => {
        if (!inputID.current.value) {
            dispatch(
                set_alert({
                    isAlertOpen: true,
                    alertTitle: "아이디를 입력해주세요",
                    alertContent: "",
                })
            );
            inputID.current.focus();
            return false;
        }
        if (!inputPW.current.value) {
            dispatch(
                set_alert({
                    isAlertOpen: true,
                    alertTitle: "비밀번호를 입력해주세요",
                    alertContent: "",
                })
            );
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
        let url = apiPath.api_login;
        let data = {
            signup_type: "000",
            user_id: inputID.current.value,
            user_pwd: inputPW.current.value,
            admin_yn: "Y",
        };

        RestServer("post", url, data)
            .then((response) => {
                let res = response;
                let result_code = res.headers.result_code;

                if (result_code === "0000") {
                    let user_info = response.data.result_info;

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
                        delete user_info[deleteKey[i]];
                    }

                    dispatch(set_user_info(JSON.stringify(user_info)));

                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: "로그인 성공",
                            alertContent: "",
                        })
                    );

                    navigate(routerPath.main_url);
                } else {
                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: "로그인 실패",
                            alertContent: "",
                        })
                    );
                }

                CommonConsole("log", response);
            })
            .catch((error) => {
                // 오류발생시 실행
                CommonConsole("log", error);

                if (
                    error.response.status === 500 ||
                    error.response.status === 503
                ) {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: "잠시 후 다시 시도해주세요",
                            alertContent: "",
                        })
                    );
                } else {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: "로그인 실패",
                            alertContent: "",
                        })
                    );
                }
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
                        />
                    </div>
                    <div className="flex login_btn">
                        <div>
                            <input type="checkbox" id="id_remember" />{" "}
                            <label htmlFor="id_remember">아이디 저장</label>
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
