import { CommonConsole } from "common/js/Common";
import { RestServer } from "common/js/Rest";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { set_alert, set_spinner } from "redux/actions/commonAction";
import { set_user_info } from "redux/actions/userInfoAction";
import { apiPath, routerPath } from "webPath";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

import { navItems } from "./navItems";
import $ from "jquery";

const SideNav = (props) => {
    let userInfo;
    const switchPage = props.switchPage;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    (() => {
        userInfo = props.userInfo;
    })();

    const navList = navItems;

    useEffect(() => {
        $(".depth1").first().addClass("on");
    }, []);

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
        const url = apiPath.api_signout;
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
                        <p>
                            {userInfo && userInfo.mod_user_name_ko} (
                            {userInfo && userInfo.user_id})
                        </p>
                        <div>
                            <Link onClick={signOut} className="font-12">
                                로그아웃
                            </Link>{" "}
                            <Link to={routerPath.main_url} className="font-12">
                                HOMEPAGE
                            </Link>
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
                                                                        onClick={
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
        </>
    );
};

export default SideNav;
