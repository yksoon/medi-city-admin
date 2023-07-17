import { Route, Routes } from "react-router";
import { useEffect } from "react";

import { apiPath, routerPath } from "webPath";

import Main from "components/main/Main";

function App() {
    return (
        <div className="wrap">
            <Routes>
                {/* /link를 입력하면 LinkPage 오픈 */}
                <Route path={routerPath.main_url} element={<Main />} />
            </Routes>
        </div>
    );
}

export default App;
