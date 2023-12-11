import * as React from "react";
import { Route, Routes } from "react-router-dom";

import { routerPath } from "webPath";

import NotFoundPage from "NotFoundPage";
import { Suspense } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import Main from "components/main/Main";
import LoginMain from "components/login/LoginMain";
import HealthCheck from "components/HealthCheck";

const Router = () => {
    // 레이지 로딩 추가
    // const Main = React.lazy(() => import("components/main/Main"));
    // const LoginMain = React.lazy(() => import("components/login/LoginMain"));

    return (
        <>
            <Suspense
                fallback={
                    <Backdrop
                        sx={{
                            color: "#fff",
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={true}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }
            >
                <Routes>
                    {/* /link를 입력하면 LinkPage 오픈 */}

                    {/* 메인 */}
                    <Route path={routerPath.main_url} element={<Main />} />

                    {/* 로그인 */}
                    <Route
                        path={routerPath.login_url}
                        element={<LoginMain />}
                    />

                    {/* 상태체크 */}
                    <Route path="/health" element={<HealthCheck />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default Router;
