import * as React from "react";
import { Route, Routes } from "react-router-dom";

import { routerPath } from "webPath";

import Main from "components/main/Main";
import NotFoundPage from "NotFoundPage";
import LoginMain from "components/login/LoginMain";

const Router = () => {
    return (
        <Routes>
            {/* /link를 입력하면 LinkPage 오픈 */}

            {/* 메인 */}
            <Route path={routerPath.main_url} element={<Main />} />

            {/* 로그인 */}
            <Route path={routerPath.login_url} element={<LoginMain />} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default Router;
