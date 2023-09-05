import { React, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CircularProgress, Dialog, Modal } from "@mui/material";
import { routerPath } from "webPath";
import tokenExpire from "./tokenExpire";
import HotelDetailModalMain from "components/hotel/hotelList/hotelDetailModal/HotelDetailModalMain";
import { RestServer } from "./Rest";
import useAlert from "hook/useAlert";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { isSpinnerAtom, userInfoAtom, userTokenAtom } from "recoils/atoms";
import { errorCode } from "./resultCode";
import RegUserModal from "components/user/userList/modal/RegUserModal";
import HotelPreview from "components/hotel/hotelList/hotelDetailModal/HotelPreview";

// Alert (props)
// isOpen = state 상태값
// title = 제목
// content = 내용
// btn = 확인버튼
// closeModal = 닫기 (state를 변경할 수 있는 handler)
const CommonModal = (props) => {
    const modalOption = {
        isOpen: props.isOpen,
        title: props.title,
        handleModalClose: props.handleModalClose,
        width: props.width,
    };

    const component = props.component;

    const handleNeedUpdate = props.handleNeedUpdate
        ? props.handleNeedUpdate
        : null;

    // 모달 컴포넌트 렌더
    const renderComponent = (component) => {
        switch (component) {
            case "HotelDetailModalMain":
                return (
                    <HotelDetailModalMain
                        handleNeedUpdate={handleNeedUpdate}
                        handleModalClose={modalOption.handleModalClose}
                    />
                );

            case "RegUserModal":
                return (
                    <RegUserModal
                        handleNeedUpdate={handleNeedUpdate}
                        handleModalClose={modalOption.handleModalClose}
                        modUserData={props.modUserData}
                    />
                );

            default:
                return;
        }
    };
    return (
        <>
            <Modal
                open={modalOption.isOpen}
                onClose={modalOption.handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal_wrap" id="modal_wrap">
                    <div className={`modal w${modalOption.width}`}>
                        <div
                            className="modal_content form hotel"
                            id="hotelInsert"
                        >
                            <div className="mo_title">
                                <h4>{modalOption.title}</h4>
                                <div
                                    className="modal_close"
                                    onClick={modalOption.handleModalClose}
                                >
                                    <img
                                        src="img/common/modal_close.png"
                                        alt=""
                                    />
                                </div>
                            </div>

                            {/* 모달 컨텐츠 드가자 */}

                            {renderComponent(component)}

                            {/* 모달 컨텐츠 드가자 END */}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

// Alert (props)
// isOpen = state 상태값
// title = 제목
// content = 내용
// btn = 확인버튼
// closeModal = 닫기 (state를 변경할 수 있는 handler)
const CommonModalChild = (props) => {
    const modalOption = {
        isOpen: props.isOpen,
        title: props.title,
        handleModalClose: props.handleModalClose,
        width: props.width,
    };

    const component = props.component;

    const handleNeedUpdate = props.handleNeedUpdate
        ? props.handleNeedUpdate
        : null;

    // 미리보기 데이터
    const previewData = props.previewData;

    // 모달 컴포넌트 렌더
    const renderComponent = (component) => {
        switch (component) {
            case "HotelPreview":
                return (
                    <HotelPreview
                        handleNeedUpdate={handleNeedUpdate}
                        handleModalClose={modalOption.handleModalClose}
                        previewData={previewData}
                    />
                );

            default:
                return;
        }
    };
    return (
        <>
            <Modal
                open={modalOption.isOpen}
                onClose={modalOption.handleModalClose}
                aria-labelledby="modal2-modal2-title"
                aria-describedby="modal2-modal2-description"
            >
                <div className="modal_wrap" id="modal_wrap">
                    <div
                        className={`modal w${modalOption.width}`}
                        style={{ zIndex: 11 }}
                    >
                        <div
                            className="modal_content form hotel"
                            id="hotelInsert"
                        >
                            <div className="mo_title">
                                <h4>{modalOption.title}</h4>
                                <div
                                    className="modal_close"
                                    onClick={modalOption.handleModalClose}
                                >
                                    <img
                                        src="img/common/modal_close.png"
                                        alt=""
                                    />
                                </div>
                            </div>

                            {/* 모달 컨텐츠 드가자 */}

                            {renderComponent(component)}

                            {/* 모달 컨텐츠 드가자 END */}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

// 디버깅용 콘솔
const CommonConsole = (type, responseData) => {
    let response;

    let result_message_ko;
    let result_message_en;
    let result_code;
    let message;

    if (!responseData.response) {
        response = responseData;
    } else {
        response = responseData.response;
    }

    if (response.headers) {
        result_message_ko = response.headers.result_message_ko;
        result_message_en = response.headers.result_message_en;
        result_code = response.headers.result_code;
        message = response.headers.message;
    } else {
        response = responseData;
    }

    switch (type) {
        case "log":
            return console.log(responseData);

        case "decLog":
            return console.log(
                decodeURI(result_message_ko),
                decodeURI(result_message_en),
                decodeURI(result_code),
                decodeURI(message)
            );

        case "alertMsg":
            return alert(decodeURI(result_message_ko).replace("%20", " "));

        case "alert":
            return alert(responseData);

        default:
            break;
    }
};

// 스피너
const CommonSpinner = (props) => {
    const spinner = useRef();

    const isLoading = props.option.isLoading;
    const alertMsg = props.option.alert ? props.option.alert : "";
    const error = props.option.error ? props.option.error : "";

    useEffect(() => {
        if (error === "Y") {
            if (!alertMsg) {
                let spnin = spinner.current.childNodes[0];
                spnin.classList.add("error");
            } else {
                alert(decodeURI(alertMsg).replace("%20", " "));
            }
        }
    }, [props]);

    return (
        <>
            {isLoading && (
                <div className="spinner" ref={spinner}>
                    <CircularProgress />
                </div>
            )}
        </>
    );
};

const CommonSpinner2 = (props) => {
    return (
        <>
            <div className="spinner">
                <CircularProgress />
            </div>
        </>
    );
};

const CommonErrorCatch = (
    error,
    setIsSpinner,
    alert,
    resetUserInfo,
    resetUserToken
) => {
    // 오류발생시 실행
    CommonConsole("log", error);

    if (error.response) {
        if (
            error.response.status === errorCode.timeOut || // 타임아웃 - 500
            error.response.status === errorCode.timeOut2 // 타임아웃 - 503
        ) {
            // dispatch(
            //     set_spinner({
            //         isLoading: false,
            //     })
            // );

            setIsSpinner(false);

            CommonNotify({
                type: "alert",
                hook: alert,
                message: "잠시 후 다시 시도해주세요",
            });
        }
        // 비정상접근 or 비정상토큰
        else if (
            error.response.headers.result_code === errorCode.abnormalApproach || // 비정상 접근 - "9995"
            error.response.headers.result_code === errorCode.emptyToken || // 토큰이 없음 - "2000"
            error.response.headers.result_code === errorCode.tokenExpired || // 토큰 만료 - "2001"
            error.response.headers.result_code === errorCode.tokenTamperWith || // 올바른 토큰 아닐 시 - "2002"
            error.response.headers.result_code === errorCode.invalidToken // 올바른 토큰 아닐 시 - "2003"
        ) {
            tokenExpire(
                // dispatch,
                setIsSpinner,
                alert,
                resetUserInfo,
                resetUserToken
            );
        }
        // 에러
        else {
            // dispatch(
            //     set_spinner({
            //         isLoading: false,
            //     })
            // );
            setIsSpinner(false);

            CommonNotify({
                type: "alert",
                hook: alert,
                message: error.response.headers.result_message_ko,
            });
        }
    }
    // 타임아웃
    const timeOut = 20000;
    if (error.message === `timeout of ${timeOut}ms exceeded`) {
        // dispatch(
        //     set_spinner({
        //         isLoading: false,
        //     })
        // );
        setIsSpinner(false);

        CommonNotify({
            type: "alert",
            hook: alert,
            message: "잠시 후 다시 시도해주세요",
        });
    }
};

// 알림창
const CommonNotify = async (option) => {
    const type = option.type;
    const hook = option.hook;
    const message = option.message;
    const callback = option.callback ? option.callback : null;

    switch (type) {
        case "confirm":
            const resultConfirm = await hook({
                message: message,
                buttons: {
                    ok: "확인",
                    cancel: "취소",
                },
            });

            if (resultConfirm) {
                if (callback) {
                    const type = typeof callback;

                    if (type === "function") {
                        callback();
                    }
                }
            }

            break;

        case "alert":
            const resultAlert = await hook({
                message: message,
                buttons: {
                    ok: "확인",
                    cancel: "취소",
                },
            });

            if (resultAlert) {
                if (callback) {
                    const type = typeof callback;

                    if (type === "function") {
                        callback();
                    }
                }
            }

            break;
        default:
            break;
    }
};

// 공용 REST
/* 
-- restParams --
dispatch : useDispatch
alert : useAlert
method : "post", "get", "delete", "put", "post_multi", "put_multi"
url : ""
data : {}
callback : callback()
admin: ""
*/
const CommonRest = async (restParams = {}) => {
    // const dispatch = restParams.err.dispatch;
    const setIsSpinner = restParams.err.setIsSpinner;
    const alert = restParams.err.alert ? restParams.err.alert : "";
    const resetUserInfo = restParams.err.resetUserInfo;
    const resetUserToken = restParams.err.resetUserToken;

    const method = restParams.method;
    const url = restParams.url;
    const data = restParams.data;
    const admin = restParams.admin;

    await RestServer(method, url, data, admin)
        .then((response) => {
            restParams.callback(response);
        })
        .catch((error) => {
            CommonErrorCatch(
                error,
                // dispatch,
                setIsSpinner,
                alert,
                resetUserInfo,
                resetUserToken
            );

            // console.log(restParams);

            // restParams.errCallback(error);
            // console.log(error);
            // func(error);
        });
};

const CommonErrModule = () => {
    const { alert } = useAlert();
    // const { confirm } = useConfirm();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);
    const resetUserInfo = useResetRecoilState(userInfoAtom);
    const resetUserToken = useResetRecoilState(userTokenAtom);
    const err = {
        setIsSpinner,
        alert,
        resetUserInfo,
        resetUserToken,
    };

    return err;
};

export {
    CommonModal,
    CommonConsole,
    CommonSpinner,
    CommonErrorCatch,
    CommonNotify,
    CommonRest,
    CommonSpinner2,
    CommonErrModule,
    CommonModalChild,
};
