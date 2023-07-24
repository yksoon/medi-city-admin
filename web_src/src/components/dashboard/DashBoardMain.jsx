import { navItems } from "components/nav/navItems";
import React from "react";

const DashBoardMain = () => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>메디씨티</h3>
                </div>
                <div>{JSON.stringify(navItems)}</div>
            </div>
        </>
    );
};

export default DashBoardMain;
