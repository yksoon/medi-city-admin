import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CommonConsole, CommonModal } from "common/js/Common";
import { RestServer } from "common/js/Rest";
import { apiPath } from "webPath";
import { useDispatch } from "react-redux";
import { set_alert, set_spinner } from "redux/actions/commonAction";
import RegUserModal from "./RegUserModal";
import tokenRefresh from "common/js/tokenRefresh";
import tokenRefreshCallback from "common/js/tokenRefresh";
import tokenExpire from "common/js/tokenExpire";

const UserList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [userList, setUserList] = useState([]);
    const [modUserData, setModUserData] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        reqUserList();
    }, []);

    const handleModalClose = () => {
        setModUserData(null);
        setIsOpen(false);
    };

    const regUser = () => {
        setModalTitle("회원등록");
        setIsOpen(true);
    };

    // 유저 리스트
    const reqUserList = () => {
        dispatch(
            set_spinner({
                isLoading: true,
            })
        );

        // account/v1/user/infos
        // POST
        let url = apiPath.api_user_list;
        let data = {
            page_num: 1,
            page_size: 10,
        };

        RestServer("post", url, data)
            .then((response) => {
                let res = response;
                let result_code = res.headers.result_code;
                let result_info = res.data.result_info;

                // 성공
                if (result_code === "0000") {
                    setUserList(result_info);

                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );
                } else {
                    // 에러
                    CommonConsole("log", response);

                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );
                }
            })
            .catch((error) => {
                // 오류발생시 실행
                CommonConsole("log", error);

                // 서버 배포중이거나 지연
                if (
                    error.response.status === 500 ||
                    error.response.status === 503
                ) {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: "잠시 후 다시 시도해주세요",
                            alertContent: "",
                        })
                    );
                }
                // 비정상접근 or 비정상토큰
                else if (
                    error.response.result_code === "9995" ||
                    error.response.result_code === "2003"
                ) {
                    tokenExpire(dispatch);
                }
                // 에러
                else {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: "조회 실패",
                            alertContent: "",
                        })
                    );
                }
            });
    };

    // 회원 정보 수정
    const modUser = (user_idx) => {
        dispatch(
            set_spinner({
                isLoading: true,
            })
        );

        let userIdx = String(user_idx);

        // account/v1/user/info/{user_idx}
        // GET
        const url = apiPath.api_user_info + `/${userIdx}`;
        const data = {};

        RestServer("get", url, data)
            .then((response) => {
                let res = response;
                let result_code = res.headers.result_code;
                let result_info = res.data.result_info;

                // 성공
                if (result_code === "0000") {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    setModUserData(result_info);

                    setModalTitle("회원수정");
                    setIsOpen(true);
                }
                // 에러
                else {
                    CommonConsole("log", response);

                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: response.headers.result_message_ko,
                            alertContent: "",
                        })
                    );
                }
            })
            .catch((error) => {
                // 오류발생시 실행
                CommonConsole("log", error);

                // 서버 배포중이거나 지연
                if (
                    error.response.status === 500 ||
                    error.response.status === 503
                ) {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle: "잠시 후 다시 시도해주세요",
                            alertContent: "",
                        })
                    );
                }
                // 에러
                else {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    dispatch(
                        set_alert({
                            isAlertOpen: true,
                            alertTitle:
                                error.response.headers.result_message_ko,
                            alertContent: "",
                        })
                    );
                }
            });
    };

    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>회원 리스트</h3>
                </div>
                <div className="con_area">
                    <div className="adm_search">
                        <div>
                            <select name="" id="">
                                <option value="">구분</option>
                                <option value="">이름</option>
                                <option value="">소속</option>
                            </select>{" "}
                            <input type="text" className="input" />{" "}
                            <Link className="subbtn off">검색</Link>
                        </div>
                        <div>
                            <Link className="subbtn on" onClick={regUser}>
                                회원등록
                            </Link>{" "}
                            <Link className="subbtn on">엑셀 다운로드</Link>
                        </div>
                    </div>
                    <div className="adm_table">
                        <table className="table_a">
                            <colgroup>
                                <col width="3%" />
                                <col width="5%" />
                                <col width="7%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" />
                                    </th>
                                    <th>고유번호</th>
                                    <th>구분</th>
                                    <th>아이디</th>
                                    <th>이름</th>
                                    <th>연락처</th>
                                    <th>소속</th>
                                    <th>전공과</th>
                                    <th>전공분야</th>
                                    <th>정보수정</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList &&
                                    userList.map((item, idx) => (
                                        <tr key={`list_${idx}`}>
                                            <td>
                                                <input type="checkbox" />
                                            </td>
                                            <td>{item.user_key}</td>
                                            <td>{item.user_role}</td>
                                            <td>{item.user_id}</td>
                                            <td>{item.user_name_ko}</td>
                                            <td>{`${item.mobile1}-${item.mobile2}-${item.mobile3}`}</td>
                                            <td>{item.organization_name_ko}</td>
                                            <td>{item.department_name_ko}</td>
                                            <td>{item.specialized_name_ko}</td>
                                            <td>
                                                <Link
                                                    className="tablebtn"
                                                    onClick={(e) => {
                                                        modUser(item.user_idx);
                                                    }}
                                                >
                                                    정보 수정
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagenation"></div>
                </div>
            </div>
            <RegUserModal
                isOpen={isOpen}
                title={modalTitle}
                handleModalClose={handleModalClose}
                modUserData={modUserData}
            />
        </>
    );
};

export default UserList;
