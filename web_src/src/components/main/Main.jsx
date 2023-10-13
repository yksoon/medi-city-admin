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
import KmediLocalMemberMng from "components/kMedi/userManage/localManage/KmediLocalMemberMng";
import KmediCreatorMemberMng from "components/kMedi/userManage/creatorManage/KmediCreatorMemberMng";
import KmediTermsMng from "components/kMedi/homepageManage/termsManage/KmediTermsMng";
import KmediNoticeMng from "components/kMedi/boardManage/noticeManage/KmediNoticeMng";
import KmediBannerMng from "components/kMedi/homepageManage/bannerManage/KmediBannerMng";
import KmediPointMng from "components/kMedi/pointManage/KmediPointMng";
import KmediPaymentMng from "components/kMedi/paymentManage/KmediPaymentMng";
import KmediContentsMng from "components/kMedi/contentsManage/KmediContentsMng";
import KmediCalcMng from "components/kMedi/clacManage/KmediCalcMng";
import KmediCategoryMng from "components/kMedi/categoryManage/KmediCategoryMng";
import KmediOneToOneMng from "components/kMedi/boardManage/oneToOneManage/KmediOneToOneMng";
import KmediMedicalQnaMng from "components/kMedi/boardManage/medicalQnaManage/KmediMedicalQnaMng";

const Main = () => {
    const navigate = useNavigate();
    const err = CommonErrModule();
    const isSpinner = useRecoilValue(isSpinnerAtom);

    const [isRefresh, setIsRefresh] = useState(false);

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
        setIsRefresh(!isRefresh);

        setPage(page);
    };

    // 렌더링 페이지
    const renderPage = (page) => {
        switch (page) {
            // 대시보드
            case "dashboard":
                return <DashBoardMain isRefresh={isRefresh} />;

            // 회원리스트
            case "userList":
                return <UserList isRefresh={isRefresh} />;

            // 호텔리스트
            case "hotelList":
                return <HotelListMain isRefresh={isRefresh} />;

            // 객실관리
            case "roomMng":
                return <RoomManage isRefresh={isRefresh} />;

            // K-MEDI - 회원관리 - 현지회원
            case "kmediLocalMemberMng":
                return <KmediLocalMemberMng isRefresh={isRefresh} />;

            // K-MEDI - 회원관리 - 한국크리에이터
            case "kmediCreatorMemberMng":
                return <KmediCreatorMemberMng isRefresh={isRefresh} />;

            // K-MEDI - 홈페이지관리 - 약관관리
            case "kmediTermsMng":
                return <KmediTermsMng isRefresh={isRefresh} />;

            // K-MEDI - 홈페이지관리 - 배너관리
            case "kmediBannerMng":
                return <KmediBannerMng isRefresh={isRefresh} />;

            // K-MEDI - 컨텐츠관리
            case "kmediContentsMng":
                return <KmediContentsMng isRefresh={isRefresh} />;

            // K-MEDI - 카테고리
            case "kmediCategoryMng":
                return <KmediCategoryMng isRefresh={isRefresh} />;

            // K-MEDI - 결제관리
            case "kmediPaymentMng":
                return <KmediPaymentMng isRefresh={isRefresh} />;

            // K-MEDI - 정산관리
            case "kmediCalcMng":
                return <KmediCalcMng isRefresh={isRefresh} />;

            // K-MEDI - 포인트관리
            case "kmediPointMng":
                return <KmediPointMng isRefresh={isRefresh} />;

            // K-MEDI - 게시판관리 - 공지사항
            case "kmediNoticeMng":
                return <KmediNoticeMng isRefresh={isRefresh} />;

            // K-MEDI - 게시판관리 - 1:1 문의
            case "kmediOneToOneMng":
                return <KmediOneToOneMng isRefresh={isRefresh} />;

            // K-MEDI - 게시판관리 - 의료 QNA
            case "kmediMedicalQnaMng":
                return <KmediMedicalQnaMng isRefresh={isRefresh} />;

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
