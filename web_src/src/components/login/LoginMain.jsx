import useAlert from "hook/useAlert";
import {
    CommonErrModule,
    CommonNotify,
    CommonRest,
    CommonSpinner2,
} from "common/js/Common";
import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPath, routerPath } from "webPath";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
    isSpinnerAtom,
    pageAtom,
    userInfoAtom,
    userTokenAtom,
} from "recoils/atoms";

const LoginMain = () => {
    // const userToken = useSelector((state) => state.userInfo.userToken);
    const navigate = useNavigate();

    const { alert } = useAlert();
    const err = CommonErrModule();

    const [isSpinner, setIsSpinner] = useRecoilState(isSpinnerAtom);
    const setUserInfo = useSetRecoilState(userInfoAtom);
    const setPage = useSetRecoilState(pageAtom);
    // const setUserToken = useSetRecoilState(userTokenAtom);
    const [userToken, setUserToken] = useRecoilState(userTokenAtom);

    const resetUserInfo = useResetRecoilState(userInfoAtom);
    const resetUserToken = useResetRecoilState(userTokenAtom);

    const inputID = useRef(null);
    const inputPW = useRef(null);

    useEffect(() => {
        if (userToken) {
            navigate(routerPath.main_url);
        } else {
            setPage("dashboard");
            resetUserInfo();
            resetUserToken();
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

        // dispatch(
        //     set_spinner({
        //         isLoading: true,
        //     })
        // );

        login();
    };

    const login = () => {
        setIsSpinner(true);

        // auth/v1/signin
        // POST
        const url = apiPath.api_auth_login;
        const data = {
            signup_type: "000",
            user_id: inputID.current.value,
            user_pwd: inputPW.current.value,
            admin_yn: "Y",
        };

        // 파라미터
        const restParams = {
            method: "post",
            url: url,
            data: data,
            err: err,
            callback: (res) => responsLogic(res),
        };

        CommonRest(restParams);

        const responsLogic = (res) => {
            let result_code = res.headers.result_code;

            if (result_code === "0000") {
                let user_info = res.data.result_info;

                // 블랙리스트
                let deleteKey = [
                    "md_licenses_number",
                    // "signin_policy",
                    // "signin_policy_cd",
                    "user_pwd",
                    "user_role",
                    "user_salt",
                ];

                for (let i = 0; i < deleteKey.length; i++) {
                    delete user_info[deleteKey[i]];
                }

                setUserInfo(user_info);
                setUserToken(user_info.token);

                // sessionStorage.setItem("userInfo", JSON.stringify(user_info));
                // dispatch(set_user_info(JSON.stringify(user_info)));

                // dispatch(set_user_token(JSON.stringify(user_info)));
                // setUserToken(user_info.token);

                setIsSpinner(false);

                navigate(routerPath.main_url);
            } else {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                });
            }
        };
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
                            defaultValue="ksyong3@naver.com"
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
                            defaultValue="123qwe123!@#"
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

            {isSpinner && <CommonSpinner2 />}

            {/* <div className="login_wrap"></div> */}
        </>
    );
};

export default LoginMain;
