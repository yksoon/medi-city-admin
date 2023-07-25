import { CommonConsole } from "common/js/Common";
import { RestServer } from "common/js/Rest";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { set_alert, set_spinner } from "redux/actions/commonAction";
import { set_user_info } from "redux/actions/userInfoAction";
import { apiPath, routerPath } from "webPath";

import $ from "jquery";
import RegUserModal from "components/user/userList/RegUserModal";
import { set_page } from "redux/actions/pageActios";

const SideNav = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modUserData, setModUserData] = useState(null);

    let userInfo;
    const switchPage = props.switchPage;

    const dispatch = useDispatch();

    (() => {
        userInfo = props.userInfo;
    })();

    const navList = props.menuList;

    useEffect(() => {
        $(".depth1").first().addClass("on");
    }, []);

    // 모달창 닫기
    const handleModalClose = () => {
        setModUserData(null);
        setIsOpen(false);
    };

    // 회원 정보 수정
    const modUser = (user_idx) => {
        dispatch(
            set_spinner({
                isLoading: true,
            })
        );

        let userIdx = String(user_idx);

        // account/v1/user/info/{user_idx}
        // GET
        const url = apiPath.api_user_info + `/${userIdx}`;
        const data = {};

        RestServer("get", url, data)
            .then((response) => {
                let res = response;
                let result_code = res.headers.result_code;
                let result_info = res.data.result_info;

                // 성공
                if (result_code === "0000") {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    setModUserData(result_info);

                    setModalTitle("회원수정");
                    setIsOpen(true);
                }
                // 에러
                else {
                    CommonConsole("log", response);

                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: response.headers.result_message_ko,
                            alertContent: "",
                        })
                    );
                }
            })
            .catch((error) => {
                // 오류발생시 실행
                CommonConsole("log", error);

                // 서버 배포중이거나 지연
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
                }
                // 에러
                else {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle:
                                error.response.headers.result_message_ko,
                            alertContent: "",
                        })
                    );
                }
            });
    };

    // 로그아웃
    const signOut = () => {
        dispatch(
            set_spinner({
                isLoading: true,
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

                    dispatch(
                        set_page({
                            page: "dashboard",
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

                dispatch(
                    set_page({
                        page: "dashboard",
                    })
                );
                dispatch(set_user_info(null));

                window.location.replace(routerPath.login_url);
            });
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
                                                >
                                                    {item2.title}{" "}
                                                    {item2.child.length !==
                                                        0 && (
                                                        <img
                                                            src="img/common/arrow_drop.png"
                                                            alt=""
                                                        />
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
            <RegUserModal
                isOpen={isOpen}
                title={modalTitle}
                handleModalClose={handleModalClose}
                modUserData={modUserData}
            />
        </>
    );
};

export default SideNav;
