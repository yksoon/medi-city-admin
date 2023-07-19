import DashBoardMain from "components/dashboard/DashBoardMain";
import SideNav from "components/nav/SideNav";
import UserList from "components/user/userList/UserList";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { routerPath } from "webPath";

const Main = () => {
    const navigate = useNavigate();
    let userInfo = useSelector((state) => state.userInfo.userInfo);

    const [openPage, setOpenPage] = useState("dashboard");

    // (() => {
    //     if (!userInfo) {
    //         navigate(routerPath.login_url);
    //     }
    // })();

    useEffect(() => {
        if (!userInfo) {
            navigate(routerPath.login_url);
        }
    }, []);

    const switchPage = (page) => {
        setOpenPage(page);
    };

    const renderPage = (openPage) => {
        switch (openPage) {
            case "dashboard":
                return <DashBoardMain />;

            case "userList":
                return <UserList />;

            default:
                return <DashBoardMain />;
        }
    };
    return (
        <>
            {userInfo && (
                <SideNav userInfo={userInfo} switchPage={switchPage} />
            )}

            {renderPage(openPage)}
        </>
    );
};

export default Main;
