import * as React from "react";
import * as ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilizeDebugger from "recoilize";

import App from "./App";

import "common/css/default.css";
import "common/css/style.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const app = document.getElementById("app");

root.render(
    <BrowserRouter>
        <RecoilRoot>
            <RecoilizeDebugger root={app} />
            <App />
        </RecoilRoot>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
