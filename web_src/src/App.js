import React, { useEffect } from "react";
import { apiPath, routerPath } from "webPath";
import { RestServer } from "common/js/Rest";
import axios from "axios";
import Router from "Router";
import { useLocation, useNavigate } from "react-router";
import { ConfirmContextProvider } from "context/ContextProvider";
import { AlertContextProvider } from "context/ContextProvider";
import ConfirmModal from "common/js/commonNoti/ConfirmModal";
import AlertModal from "common/js/commonNoti/AlertModal";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    codesAtom,
    countryBankAtom,
    ipInfoAtom,
    resultCodeAtom,
} from "recoils/atoms";

function App() {
    const [ipInfo, setIpInfo] = useRecoilState(ipInfoAtom);
    const navigate = useNavigate();
    const location = useLocation();

    const setResultCode = useSetRecoilState(resultCodeAtom);
    const setCodes = useSetRecoilState(codesAtom);
    const setCountryBank = useSetRecoilState(countryBankAtom);

    useEffect(() => {
        if (ipInfo === "") {
            getIpInfo();
        } else {
            getResultCode();
            getCodes();
            getCountryBank();
            setInterval(getResultCode, 3600000);
            setInterval(getCodes, 3600000);
        }
    }, []);

    // IP
    const getIpInfo = async (callback) => {
        let ip;

        await axios
            .get("https://geolocation-db.com/json/")
            .then((res) => {
                ip = res.data.IPv4;
                setIpInfo(ip);
                sessionStorage.setItem("ipInfo", ip);

                getResultCode();
                getCodes();
                getCountryBank();
                setInterval(getResultCode, 3600000);
                setInterval(getCodes, 3600000);
            })
            .catch((error) => {
                ip = "";
                setIpInfo(ip);
                sessionStorage.setItem("ipInfo", ip);
            });

        return ip;
    };

    // result code
    const getResultCode = () => {
        RestServer("get", apiPath.api_mng_result, {})
            .then((response) => {
                // console.log("result_code", response);

                setResultCode(response.data.result_info);
            })
            .catch((error) => {
                // 오류발생시 실행
                console.log(decodeURI(error));
            });
    };

    // codes
    const getCodes = () => {
        RestServer("post", apiPath.api_mng_codes, {
            code_types: [],
            exclude_code_types: [
                "INTER_PHONE_TYPE",
                "BANK_TYPE",
                "LANGUAGE_TYPE",
            ],
        })
            .then((response) => {
                // console.log("codes", response);

                setCodes(response.data.result_info);
            })
            .catch((error) => {
                // 오류발생시 실행
                console.log(decodeURI(error));
            });
    };

    // codes
    const getCountryBank = () => {
        RestServer("post", apiPath.api_mng_codes, {
            code_types: ["INTER_PHONE_TYPE", "BANK_TYPE", "LANGUAGE_TYPE"],
            exclude_code_types: [],
        })
            .then((response) => {
                // console.log("codesCountryBank", response);

                setCountryBank(response.data.result_info);
            })
            .catch((error) => {
                // 오류발생시 실행
                console.log(decodeURI(error));
            });
    };

    return (
        <>
            <div className="wrapper">
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
