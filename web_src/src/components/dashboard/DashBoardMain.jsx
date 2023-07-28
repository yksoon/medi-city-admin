import useAlert from "common/hook/useAlert";
import useConfirm from "common/hook/useConfirm";
import { CommonNotify } from "common/js/Common";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const DashBoardMain = () => {
    const { alert } = useAlert();
    // const { confirm } = useConfirm();

    const testFunc = () => {
        // CommonAlert2(alert, "테스트입니다");
        CommonNotify({
            type: "alert",
            hook: alert,
            message: "테스트입니다",
        });
    };

    // const testFunc2 = () => {
    //     console.log("11111111111111");
    // };

    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>메디씨티</h3>
                </div>
                <div>
                    <h3>대쉬보드입니다</h3>
                    <Link onClick={testFunc}>test</Link>
                </div>
            </div>
        </>
    );
};

export default DashBoardMain;
