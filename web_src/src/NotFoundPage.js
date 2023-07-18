import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <>
            <div className="wrap">
                <div className="con_area">
                    <div className="error_page">
                        <span>
                            <img src="/img/common/error.png" alt="" />
                        </span>
                        <h3>접속이 원활하지 않습니다.</h3>
                        <p>잠시 후 다시 시도해주세요.</p>
                        <div className="btn_box">
                            <Link to="/" className="backbtn">
                                메인화면 바로가기{" "}
                                <span>
                                    <img src="/img/common/arrow.png" alt="" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFound;
