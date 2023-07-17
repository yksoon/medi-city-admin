import { RestServer } from "common/js/Rest";
import React, { useState } from "react";
import { apiPath } from "webPath";

const Main = () => {
    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [adminYn, setAdminYn] = useState("Y");
    const [loginSuccess, setLoginSuccess] = useState(false);

    const inputHandler = (ref, e) => {
        switch (ref) {
            case "user_id":
                setUserId(e.currentTarget.value);
                break;

            case "user_pw":
                setUserPw(e.currentTarget.value);
                break;

            default:
                break;
        }
    };

    const sendSignin = () => {
        // console.log(userId, userPw);
        let url = apiPath.api_login;
        let data = {
            signup_type: "000",
            user_id: userId,
            user_pwd: userPw,
            admin_yn: adminYn,
        };

        RestServer("post", url, data)
            .then((response) => {
                console.log(response);
                setLoginSuccess(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <>
            {loginSuccess ? (
                <div>로그인 성공</div>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="아이디"
                        onChange={(e) => inputHandler("user_id", e)}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        onChange={(e) => inputHandler("user_pw", e)}
                    />
                    <button onClick={sendSignin}>로그인</button>
                </div>
            )}
        </>
    );
};

export default Main;
