import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CommonConsole, CommonModal } from "common/js/Common";
import { RestServer } from "common/js/Rest";
import { apiPath } from "webPath";
import { useDispatch } from "react-redux";
import { set_alert, set_spinner } from "redux/actions/commonAction";
import RegUserModal from "./RegUserModal";

const testData = [
    {
        mod_user_idx: "7",
        user_type: "일반사용자",
        user_id: "ksyong1990@naver.com",
        mod_user_name_ko: "용 광순",
        mobile1: "010",
        mobile2: "5090",
        mobile3: "7526",
        organization_name_ko: null,
        department_name_ko: null,
        specialized_name_ko: null,
    },
    {
        mod_user_idx: "6",
        user_type: "일반사용자",
        user_id: "ksyong1990@naver.com",
        mod_user_name_ko: "용 광순",
        mobile1: "010",
        mobile2: "5090",
        mobile3: "7526",
        organization_name_ko: null,
        department_name_ko: null,
        specialized_name_ko: null,
    },
    {
        mod_user_idx: "1",
        user_type: "관리자",
        user_id: "ej.lim@hicomp.net",
        mod_user_name_ko: "임은지",
        mobile1: "010",
        mobile2: "0000",
        mobile3: "0000",
        organization_name_ko: "하이컴프아이엔티",
        department_name_ko: "디자인",
        specialized_name_ko: "웹디자인",
    },
];
const UserList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState([]);
    const [userList, setUserList] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        reqUserList();
    }, []);

    const handleModalClose = () => {
        setIsOpen(false);
    };

    const regUser = () => {
        setIsOpen(true);
        setModalTitle("회원등록");
        setModalContent([]);
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
                } else {
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
                                <col width="5%" />
                                <col width="5%" />
                                <col width="5%" />
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
                                            <td>{item.user_idx}</td>
                                            <td>{item.user_type}</td>
                                            <td>{item.user_id}</td>
                                            <td>{item.user_name_ko}</td>
                                            <td>{`${item.mobile1}-${item.mobile2}-${item.mobile3}`}</td>
                                            <td>{item.organization_name_ko}</td>
                                            <td>{item.department_name_ko}</td>
                                            <td>{item.specialized_name_ko}</td>
                                            <td>
                                                <Link className="tablebtn">
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
            />
        </>
    );
};

export default UserList;
