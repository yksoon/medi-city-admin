import {
    CommonConsole,
    CommonErrModule,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPath, routerPath } from "webPath";

import $ from "jquery";
// import RegUserModal from "components/user/userList/RegUserModal";
import useAlert from "hook/useAlert";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import {
    isSpinnerAtom,
    pageAtom,
    userInfoAtom,
    userTokenAtom,
} from "recoils/atoms";
import { successCode } from "common/js/resultCode";

const SideNav = (props) => {
    const resetUserInfoAdmin = useResetRecoilState(userInfoAtom);
    const resetUserTokenAdmin = useResetRecoilState(userTokenAtom);

    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modUserData, setModUserData] = useState(null);
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);
    const navigate = useNavigate();

    let userInfo;
    const switchPage = props.switchPage;

    // const dispatch = useDispatch();

    (() => {
        userInfo = props.userInfo;
    })();

    const navList = props.menuList;

    // let page = useSelector((state) => state.page.page);
    const page = useRecoilValue(pageAtom);

    // console.log($(`#${page}`).parents());

    useEffect(() => {
        // 새로고침 하더라도 현재 메뉴 활성화
        if (page) {
            $(".sub_2depth").hide();
            $(".sub_3depth").hide();

            $(".depth1").removeClass("on");
            $(".depth2").removeClass("on");

            $(`#${page}`).parents("li").children(".depth1").addClass("on");
            $(`#${page}`).parents("li").children(".depth2").addClass("on");
            $(`#${page}`).parents("li").children(".sub_2depth").slideToggle();
            $(`#${page}`).parents("li").children(".sub_3depth").slideToggle();
        }
    }, [navList]);

    // 모달창 닫기
    const handleModalClose = () => {
        setModUserData(null);
        setIsOpen(false);
    };

    // 회원 정보 수정
    const modUser = (user_idx) => {
        setIsSpinner(false);

        let userIdx = String(user_idx);

        // account/v1/user/info/{user_idx}
        // GET
        const url = apiPath.api_user_info + `/${userIdx}`;
        const data = {};

        // 파라미터
        const restParams = {
            method: "get",
            url: url,
            data: data,
            err: err,
            callback: (res) => responsLogic(res),
        };
        CommonRest(restParams);

        const responsLogic = (res) => {
            let result_code = res.headers.result_code;
            let result_info = res.data.result_info;

            // 성공
            if (result_code === successCode.success) {
                setIsSpinner(false);

                setModUserData(result_info);

                setModalTitle("회원수정");
                setIsOpen(true);
            }
            // 에러
            else {
                CommonConsole("log", res);

                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                });
            }
        };
    };

    // 로그아웃
    const signOut = () => {
        setIsSpinner(true);

        // signout
        // url : /v1/signout
        // method : POST
        const url = apiPath.api_auth_signout;
        let data = {};

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
            const result_code = res.headers.result_code;

            if (result_code === successCode.success) {
                // localStorage.removeItem("userInfo");
                // dispatch(init_user_info_admin(null));

                resetUserInfoAdmin();
                resetUserTokenAdmin();

                setIsSpinner(false);

                navigate(routerPath.login_url);
            }
        };
    };

    const depth1click = (e) => {
        $(".sub_2depth").hide();
        $(".sub_3depth").hide();

        $(".depth1").removeClass("on");

        if (e.target.nextElementSibling.style.display === "none") {
            e.target.classList.add("on");

            $(e.target).siblings(".sub_2depth").slideToggle();
        } else {
            $(e.target).siblings(".sub_2depth").slideUp();
        }
    };

    const depth2click = (e) => {
        if (e.target.nextElementSibling.style.display === "none") {
            $(e.target).siblings(".sub_3depth").slideToggle();
        } else {
            $(e.target).siblings(".sub_3depth").slideUp();
        }
    };

    return (
        <>
            <header>
                <div className="gnb">
                    <div className="adm_profile">
                        <Link onClick={(e) => modUser(userInfo.user_idx)}>
                            <p>
                                <span>{userInfo && userInfo.user_name_ko}</span>
                                <span>({userInfo && userInfo.user_id})</span>
                            </p>
                        </Link>

                        <div>
                            <Link onClick={signOut} className="font-12">
                                로그아웃
                            </Link>{" "}
                            {/* TODO 나중에 할거야 */}
                            {/* <Link to={routerPath.main_url} className="font-12">
                                HOMEPAGE
                            </Link> */}
                        </div>
                    </div>
                    <ul className="sub_gnb">
                        <li id="all_gnb">전체 메뉴 보기</li>
                        {navList.map((item1, idx1) => (
                            <li key={`depth1_${idx1}`}>
                                <Link
                                    className="depth1"
                                    onClick={(e) => {
                                        depth1click(e);
                                        item1.page !== "" &&
                                            switchPage(item1.page);
                                    }}
                                    id={item1.page ? item1.page : ""}
                                >
                                    {item1.title}
                                </Link>
                                <ul className="sub_2depth">
                                    {item1.child &&
                                        item1.child.map((item2, idx2) => (
                                            <li key={`depth2_${idx2}`}>
                                                <Link
                                                    onClick={(e) => {
                                                        depth2click(e);
                                                        item2.page !== "" &&
                                                            switchPage(
                                                                item2.page
                                                            );
                                                    }}
                                                    id={
                                                        item2.page
                                                            ? item2.page
                                                            : ""
                                                    }
                                                >
                                                    {item2.title}{" "}
                                                    {item2.child.length !==
                                                        0 && (
                                                        <>
                                                            <img
                                                                src="img/common/arrow_drop.png"
                                                                alt=""
                                                            />
                                                            <div></div>
                                                        </>
                                                    )}
                                                </Link>
                                                <ul className="sub_3depth">
                                                    {item2.child &&
                                                        item2.child.map(
                                                            (item3, idx3) => (
                                                                <li
                                                                    key={`depth2_${idx3}`}
                                                                >
                                                                    <Link
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            item3.page !==
                                                                                "" &&
                                                                            switchPage(
                                                                                item3.page
                                                                            )
                                                                        }
                                                                        id={
                                                                            item3.page
                                                                                ? item3.page
                                                                                : ""
                                                                        }
                                                                    >
                                                                        {
                                                                            item3.title
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>
            {/* <RegUserModal
                isOpen={isOpen}
                title={modalTitle}
                handleModalClose={handleModalClose}
                modUserData={modUserData}
            /> */}
        </>
    );
};

export default SideNav;
