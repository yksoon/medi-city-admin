import { React, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CircularProgress, Dialog, Modal } from "@mui/material";
import { set_spinner } from "redux/actions/commonAction";
import { routerPath } from "webPath";
import tokenExpire from "./tokenExpire";

// Alert (props)
// isOpen = state 상태값
// title = 제목
// content = 내용
// btn = 확인버튼
// closeModal = 닫기 (state를 변경할 수 있는 handler)
const CommonModal = ({ isOpen, title, content, btn, handleModalClose }) => {
    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal_wrap" id="modal_wrap">
                    <div className="modal w1000" id="modal">
                        <div className="modal_close" onClick={handleModalClose}>
                            <img src="/img/common/modal_close.png" alt="" />
                        </div>
                        <div className="term" id="term">
                            <h3 className="title">{title}</h3>
                            <div className="linebox bd50">{content}</div>
                        </div>
                        {/* <div className="btn_box">
                            <Link
                                className="mainbtn btn01"
                                onClick={handleModalClose}
                            >
                                확인
                            </Link>
                        </div> */}
                    </div>
                </div>
            </Modal>
        </>
    );
};

// 디버깅용 콘솔
const CommonConsole = (type, responseData) => {
    let response;

    let resultMessageKo;
    let resultMessageEn;
    let resultCode;
    let message;

    if (!responseData.response) {
        response = responseData;
    } else {
        response = responseData.response;
    }

    if (response.headers) {
        resultMessageKo = response.headers.resultMessageKo;
        resultMessageEn = response.headers.resultMessageEn;
        resultCode = response.headers.resultCode;
        message = response.headers.message;
    } else {
        response = responseData;
    }

    switch (type) {
        case "log":
            return console.log(responseData);

        case "decLog":
            return console.log(
                decodeURI(resultMessageKo),
                decodeURI(resultMessageEn),
                decodeURI(resultCode),
                decodeURI(message)
            );

        case "alertMsg":
            return alert(decodeURI(resultMessageKo).replace("%20", " "));

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

const CommonErrorCatch = (error, dispatch, alert) => {
    // 오류발생시 실행
    CommonConsole("log", error);

    if (error.response) {
        if (error.response.status === 500 || error.response.status === 503) {
            dispatch(
                set_spinner({
                    isLoading: false,
                })
            );

            CommonNotify({
                type: "alert",
                hook: alert,
                message: "잠시 후 다시 시도해주세요",
            });
        }
        // 비정상접근 or 비정상토큰
        else if (
            error.response.headers.resultCode === "9995" ||
            error.response.headers.resultCode === "2003"
        ) {
            tokenExpire(dispatch, alert);
        }
        // 에러
        else {
            dispatch(
                set_spinner({
                    isLoading: false,
                })
            );

            CommonNotify({
                type: "alert",
                hook: alert,
                message: error.response.headers.resultMessageKo,
            });
        }
    }
    // 타임아웃
    if (error.message === "timeout of 5000ms exceeded") {
        dispatch(
            set_spinner({
                isLoading: false,
            })
        );

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
    const callback = option.callback && option.callback;

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
            await hook({
                message: message,
                buttons: {
                    ok: "확인",
                    cancel: "취소",
                },
            });

            break;
        default:
            break;
    }
};

export {
    CommonModal,
    CommonConsole,
    CommonSpinner,
    CommonErrorCatch,
    CommonNotify,
};
