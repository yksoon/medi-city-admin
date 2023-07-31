import { Link } from "react-router-dom";
import useConfirm from "hook/useConfirm";

const ConfirmModal = () => {
    const { confirmList } = useConfirm();

    if (confirmList.length <= 0) return null;

    return (
        <div className="modal_wrap block">
            {confirmList.map(
                ({ id, message, buttons: { ok, close, cancel } }, idx) => {
                    return (
                        <div
                            className="modal noti_modal"
                            key={`confirm_${idx}`}
                        >
                            <div>
                                <span
                                    className="noti_icon"
                                    id="modal-modal-title"
                                >
                                    <img src="img/common/alert.png" alt="" />
                                </span>
                                <h3>
                                    {message
                                        ? decodeURI(message)
                                              .replaceAll("%20", " ")
                                              .replaceAll("%40", "@")
                                        : ""}
                                </h3>
                                <p>
                                    {/* {message
                                        ? decodeURI(message)
                                              .replaceAll("%20", " ")
                                              .replaceAll("%40", "@")
                                        : ""} */}
                                </p>
                            </div>
                            <div className="btn_box">
                                <Link className="backbtn on" onClick={ok.click}>
                                    {ok.text}{" "}
                                    <span>
                                        <img
                                            src="img/common/arrow.png"
                                            alt=""
                                        />
                                    </span>
                                </Link>{" "}
                                <Link
                                    className="backbtn"
                                    onClick={cancel.click}
                                >
                                    {cancel.text}{" "}
                                    <span>
                                        <img
                                            src="img/common/arrow.png"
                                            alt=""
                                        />
                                    </span>
                                </Link>
                            </div>
                        </div>
                        // <div className="mmodal-content" key={`confirm_${idx}`}>
                        //     <span className="close" onClick={close.click}>
                        //         &times;
                        //     </span>

                        //     <p>{message}</p>

                        //     <div className="mmodal-buttons">
                        //         <button onClick={ok.click}>{ok.text}</button>

                        //         {cancel && (
                        //             <button onClick={cancel.click}>
                        //                 {cancel.text}
                        //             </button>
                        //         )}
                        //     </div>
                        // </div>
                    );
                }
            )}
        </div>
    );
};

export default ConfirmModal;
