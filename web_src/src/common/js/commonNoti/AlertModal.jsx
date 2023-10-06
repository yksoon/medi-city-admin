import { Link } from "react-router-dom";
import useAlert from "hook/useAlert";

const AlertModal = () => {
    const { alertList } = useAlert();

    if (alertList.length <= 0) return null;

    return (
        <div className="alert_wrap block">
            {alertList.map(
                ({ id, message, buttons: { ok, close, cancel } }, idx) => {
                    return (
                        <div className="alert" key={`confirm_${idx}`}>
                            <div>
                                {/* <span
                                    className="noti_icon"
                                    id="modal-modal-title"
                                >
                                    <img src="img/common/alert.png" alt="" />
                                </span> */}
                                <span className="alert_icon">!</span>
                                <h3>
                                    {message
                                        ? decodeURI(message)
                                              .replaceAll("%20", " ")
                                              .replaceAll("%40", "@")
                                              .replaceAll("%3A", ":")
                                              .replaceAll("%3B", ";")
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
                            <div className="modal_btn_box">
                                <Link className="modal_btn" onClick={ok.click}>
                                    {ok.text}{" "}
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

export default AlertModal;
