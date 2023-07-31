import React, { useEffect } from "react";
import { apiPath, routerPath } from "webPath";
import { RestServer } from "common/js/Rest";
import axios from "axios";
import Router from "Router";
import { useDispatch, useSelector } from "react-redux";
import { CommonSpinner } from "common/js/Common";
import {
    set_codes,
    set_result_code,
    set_country_bank,
} from "redux/actions/codesAction";
import { set_ip_info } from "redux/actions/ipInfoAction";
import { useLocation, useNavigate } from "react-router";
import { ConfirmContextProvider } from "context/ContextProvider";
import { AlertContextProvider } from "context/ContextProvider";
import ConfirmModal from "common/js/ConfirmModal";
import AlertModal from "common/js/AlertModal";

function App() {
    let ipInfo = useSelector((state) => state.ipInfo.ipInfo);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        // localStorage.clear();

        const ipCallback = (ip) => {
            if (ip) {
                dispatch(set_ip_info(ip));
            }
        };
        if (!ipInfo) {
            getIpInfo(ipCallback);
        }

        getResultCode();
        getCodes();
        getCountryBank();
        setInterval(getResultCode, 3600000);
        setInterval(getCodes, 3600000);

        // localStorage.clear();
    }, []);

    // Spinner
    let spinnerOption = useSelector((state) => state.common.spinner);

    // IP
    const getIpInfo = async (callback) => {
        let ip;

        await axios
            .get("https://geolocation-db.com/json/")
            .then((res) => {
                ip = res.data.IPv4;
                callback(ip);
                // dispatch(set_ip_info(ip));
            })
            .catch((error) => {
                ip = "";
                callback(ip);
                // dispatch(set_ip_info(ip));
            });
    };

    // result code
    const getResultCode = () => {
        RestServer("get", apiPath.api_mng_result, {})
            .then((response) => {
                console.log("result_code", response);

                dispatch(
                    set_result_code(JSON.stringify(response.data.resultInfo))
                );
            })
            .catch((error) => {
                // 오류발생시 실행
                console.log(decodeURI(error));
            });
    };

    // codes
    const getCodes = () => {
        RestServer("post", apiPath.api_mng_codes, {
            codeTypes: [],
            excludeCodeTypes: ["COUNTRY_TYPE", "BANK_TYPE"],
        })
            .then((response) => {
                console.log("codes", response);

                dispatch(set_codes(JSON.stringify(response.data.resultInfo)));
            })
            .catch((error) => {
                // 오류발생시 실행
                console.log(decodeURI(error));
            });
    };

    // codes
    const getCountryBank = () => {
        RestServer("post", apiPath.api_mng_codes, {
            codeTypes: ["COUNTRY_TYPE", "BANK_TYPE"],
            excludeCodeTypes: [],
        })
            .then((response) => {
                console.log("codesCountryBank", response);

                dispatch(
                    set_country_bank(JSON.stringify(response.data.resultInfo))
                );
            })
            .catch((error) => {
                // 오류발생시 실행
                console.log(decodeURI(error));
            });
    };

    return (
        <>
            <div className="wrap">
                <CommonSpinner option={spinnerOption} />

                <ConfirmContextProvider>
                    <AlertContextProvider>
                        <Router />
                        <AlertModal />
                        <ConfirmModal />
                    </AlertContextProvider>
                </ConfirmContextProvider>
            </div>
        </>
    );
}

export default App;
