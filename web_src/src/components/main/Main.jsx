import useAlert from "hook/useAlert";
import { CommonConsole, CommonErrorCatch } from "common/js/Common";
import { RestServer } from "common/js/Rest";
import DashBoardMain from "components/dashboard/DashBoardMain";
import HotelListMain from "components/hotel/hotelList/HotelListMain";
import SideNav from "components/nav/SideNav";
import UserList from "components/user/userList/UserList";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { set_spinner } from "redux/actions/commonAction";
import { set_page } from "redux/actions/pageActios";
import { apiPath, routerPath } from "webPath";

const Main = () => {
    const navigate = useNavigate();
    let userInfo = useSelector((state) => state.userInfo.userInfo);
    let userToken = useSelector((state) => state.userInfo.userToken);
    let page = useSelector((state) => state.page.page);
    const dispatch = useDispatch();
    const { alert } = useAlert();

    const [menuList, setMenuList] = useState([]);

    // (() => {
    //     if (!userInfo) {
    //         navigate(routerPath.login_url);
    //     }
    // })();

    useEffect(() => {
        if (!userToken) {
            navigate(routerPath.login_url);
        } else {
            requestMenu();
        }
    }, []);

    const requestMenu = () => {
        // 메뉴 리스트 호출
        // /v1/menus
        // GET
        const url = apiPath.api_mng_menus;
        const data = {};
        RestServer("get", url, data)
            .then((response) => {
                const res = response;
                const resultCode = res.headers.resultCode;
                let resData = [];

                if (resultCode === "0000") {
                    resData = res.data.resultInfo;

                    createMenuList(resData);
                }
            })
            .catch((error) => {
                CommonErrorCatch(error, dispatch, alert);
            });
    };

    /*
    const createMenuList = (menuData) => {
        let menuArr = [];
        let depth1 = [];
        let depth2 = [];
        let depth3 = [];

        let menuDataLength = menuData.length;

        for (let i = 0; i < menuDataLength; i++) {
            let menuOnce = {};

            // depth1
            if (menuData[i].menu_depth === 0) {
                menuOnce["title"] = menuData[i].menu_name_ko;
                menuOnce["page"] = menuData[i].menu_path
                    ? menuData[i].menu_path
                    : "";
                menuOnce["child"] = [];
                menuOnce["menu_code"] = menuData[i].menu_code;

                depth1.push(menuOnce);
            }
            // depth2
            else if (menuData[i].menu_depth === 1) {
                menuOnce["title"] = menuData[i].menu_name_ko;
                menuOnce["page"] = menuData[i].menu_path
                    ? menuData[i].menu_path
                    : "";
                menuOnce["child"] = [];
                menuOnce["menu_code"] = menuData[i].menu_code;

                depth2.push(menuOnce);
            }
            // depth3
            else if (menuData[i].menu_depth === 2) {
                menuOnce["title"] = menuData[i].menu_name_ko;
                menuOnce["page"] = menuData[i].menu_path
                    ? menuData[i].menu_path
                    : "";
                menuOnce["child"] = [];
                menuOnce["menu_code"] = menuData[i].menu_code;

                depth3.push(menuOnce);
            } else {
                return;
            }
        }

        let depth3length = depth3.length;
        let depth2length = depth2.length;
        let depth1length = depth1.length;

        for (let i = 0; i < depth3length; i++) {
            for (let j = 0; j < depth2length; j++) {
                if (
                    depth3[i].menu_code.length === 4 &&
                    depth2[j].menu_code.length === 4
                ) {
                    if (
                        depth3[i].menu_code.slice(0, 2) ===
                        depth2[j].menu_code.slice(0, 2)
                    ) {
                        depth2[j].child.push(depth3[i]);
                    }
                } else if (
                    depth3[i].menu_code.length === 5 &&
                    depth2[j].menu_code.length === 5
                ) {
                    if (
                        depth3[i].menu_code.slice(0, 3) ===
                        depth2[j].menu_code.slice(0, 3)
                    ) {
                        depth2[j].child.push(depth3[i]);
                    }
                }
            }
        }

        for (let i = 0; i < depth2length; i++) {
            for (let j = 0; j < depth1length; j++) {
                if (
                    depth2[i].menu_code.length === 4 &&
                    depth1[j].menu_code.length === 4
                ) {
                    if (
                        depth2[i].menu_code.slice(0, 1) ===
                        depth1[j].menu_code.slice(0, 1)
                    ) {
                        depth1[j].child.push(depth2[i]);
                    }
                } else if (
                    depth2[i].menu_code.length === 5 &&
                    depth1[j].menu_code.length === 5
                ) {
                    if (
                        depth2[i].menu_code.slice(0, 2) ===
                        depth1[j].menu_code.slice(0, 2)
                    ) {
                        depth1[j].child.push(depth2[i]);
                    }
                }
            }
        }

        menuArr = depth1;
        setMenuList(menuArr);

        dispatch(
            set_spinner({
                isLoading: false,
            })
        );
    };
    */

    const createMenuList = (menuData) => {
        let menuArr = [];
        let depth1 = [];
        let depth2 = [];
        let depth3 = [];

        // console.log(menuData);

        menuData.map((item) => {
            let menuOnce = {};

            menuOnce["title"] = item.menuNameKo;
            menuOnce["page"] = item.menuPath ? item.menuPath : "";
            menuOnce["child"] = [];
            menuOnce["menuCode"] = Number(item.menuCode);

            if (item.menuDepth === 0) {
                depth1.push(menuOnce);
            } else if (item.menuDepth === 1) {
                depth2.push(menuOnce);
            } else {
                depth3.push(menuOnce);
            }
            return item;
        });

        depth2.map((item2) => {
            depth3.map((item3) => {
                if (
                    item3.menuCode > item2.menuCode &&
                    item3.menuCode < item2.menuCode + 100
                ) {
                    depth2
                        .find((e) => e.menuCode === item2.menuCode)
                        .child.push(item3);
                }

                return item3;
            });

            return item2;
        });

        depth1.map((item1) => {
            depth2.map((item2) => {
                if (
                    item2.menuCode > item1.menuCode &&
                    item2.menuCode < item1.menuCode + 1000
                ) {
                    depth1
                        .find((e) => e.menuCode === item1.menuCode)
                        .child.push(item2);
                }

                return item2;
            });

            return item1;
        });

        menuArr = depth1;
        setMenuList(menuArr);

        dispatch(
            set_spinner({
                isLoading: false,
            })
        );
    };

    const switchPage = (page) => {
        dispatch(set_page(page));
    };

    // 렌더링 페이지
    const renderPage = (page) => {
        switch (page) {
            case "dashboard":
                return <DashBoardMain />;

            case "userList":
                return <UserList />;

            case "hotelList":
                return <HotelListMain />;

            default:
                return <DashBoardMain />;
        }
    };
    return (
        <>
            {userInfo && (
                <SideNav
                    userInfo={userInfo}
                    switchPage={switchPage}
                    menuList={menuList}
                />
            )}

            {renderPage(page)}
        </>
    );
};

export default Main;
