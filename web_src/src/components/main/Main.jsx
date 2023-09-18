import useAlert from "hook/useAlert";
import {
    CommonConsole,
    CommonErrModule,
    CommonErrorCatch,
    CommonRest,
    CommonSpinner,
    CommonSpinner2,
} from "common/js/Common";
import DashBoardMain from "components/dashboard/DashBoardMain";
import HotelListMain from "components/hotel/hotelList/HotelListMain";
import SideNav from "components/nav/SideNav";
import UserList from "components/user/userList/UserList";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiPath, routerPath } from "webPath";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    isSpinnerAtom,
    pageAtom,
    userInfoAtom,
    userTokenAtom,
} from "recoils/atoms";
import { successCode } from "common/js/resultCode";
import RoomManage from "components/hotel/roomManage/RoomManage";
import LocalMemberMng from "components/kMedi/userManage/localManage/LocalMemberMng";
import CreatorMemberMng from "components/kMedi/userManage/creatorManage/CreatorMemberMng";
import KmediTermsMng from "components/kMedi/homepageManage/termsManage/KmediTermsMng";

const Main = () => {
    const navigate = useNavigate();
    const err = CommonErrModule();
    const isSpinner = useRecoilValue(isSpinnerAtom);

    const userInfo = useRecoilValue(userInfoAtom);
    const userToken = useRecoilValue(userTokenAtom);

    const [page, setPage] = useRecoilState(pageAtom);
    // const [isSpinner, setIsSpinner] = useRecoilState(isSpinnerAtom);

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
            const result_code = res.headers.result_code;
            let resData = [];

            if (result_code === successCode.success) {
                resData = res.data.result_info;

                createMenuList(resData);
            }
        };
    };

    const createMenuList = (menuData) => {
        let menuArr = [];
        let depth1 = [];
        let depth2 = [];
        let depth3 = [];

        // console.log(menuData);

        menuData.map((item) => {
            let menuOnce = {};

            menuOnce["title"] = item.menu_name_ko;
            menuOnce["page"] = item.menu_path ? item.menu_path : "";
            menuOnce["child"] = [];
            menuOnce["menu_code"] = Number(item.menu_code);

            if (item.menu_depth === 0) {
                depth1.push(menuOnce);
            } else if (item.menu_depth === 1) {
                depth2.push(menuOnce);
            } else {
                depth3.push(menuOnce);
            }
            return item;
        });

        depth2.map((item2) => {
            depth3.map((item3) => {
                if (
                    item3.menu_code > item2.menu_code &&
                    item3.menu_code < item2.menu_code + 100
                ) {
                    depth2
                        .find((e) => e.menu_code === item2.menu_code)
                        .child.push(item3);
                }

                return item3;
            });

            return item2;
        });

        depth1.map((item1) => {
            depth2.map((item2) => {
                if (
                    item2.menu_code > item1.menu_code &&
                    item2.menu_code < item1.menu_code + 1000
                ) {
                    depth1
                        .find((e) => e.menu_code === item1.menu_code)
                        .child.push(item2);
                }

                return item2;
            });

            return item1;
        });

        menuArr = depth1;
        setMenuList(menuArr);

        // setIsSpinner(false);
    };

    const switchPage = (page) => {
        setPage(page);
    };

    // 렌더링 페이지
    const renderPage = (page) => {
        switch (page) {
            // 대시보드
            case "dashboard":
                return <DashBoardMain />;

            // 회원리스트
            case "userList":
                return <UserList />;

            // 호텔리스트
            case "hotelList":
                return <HotelListMain />;

            // 객실관리
            case "roomMng":
                return <RoomManage />;

            // K-MEDI - 회원관리 - 현지회원
            case "kmediLocalMemberMng":
                return <LocalMemberMng />;

            // K-MEDI - 회원관리 - 한국크리에이터
            case "kmediCreatorMemberMng":
                return <CreatorMemberMng />;

            // K-MEDI - 홈페이지관리 - 약관관리
            case "kmediTermsMng":
                return <KmediTermsMng />;

            default:
                return <DashBoardMain />;
        }
    };
    return (
        <>
            <div className="wrap">
                <div className="admin">
                    {userInfo && (
                        <SideNav
                            userInfo={userInfo}
                            switchPage={switchPage}
                            menuList={menuList}
                        />
                    )}
                    {renderPage(page)}
                </div>
            </div>
            {isSpinner && <CommonSpinner2 />}
        </>
    );
};

export default Main;
