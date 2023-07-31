import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CommonConsole,
    CommonErrorCatch,
    CommonNotify,
} from "common/js/Common";
import { RestServer } from "common/js/Rest";
import { apiPath } from "webPath";
import { useDispatch } from "react-redux";
import { set_spinner } from "redux/actions/commonAction";
import RegUserModal from "./RegUserModal";
import { Pagination } from "@mui/material";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";

const UserList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [userList, setUserList] = useState([]);
    const [modUserData, setModUserData] = useState(null);
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);
    const [checkItems, setCheckItems] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const { confirm } = useConfirm();
    const { alert } = useAlert();

    const dispatch = useDispatch();

    useEffect(() => {
        reqUserList(1, 10);
    }, [isNeedUpdate]);

    const handleNeedUpdate = () => {
        setIsNeedUpdate(!isNeedUpdate);
    };

    const handleModalClose = () => {
        setModUserData(null);
        setIsOpen(false);
    };

    const regUser = () => {
        setModalTitle("회원등록");
        setIsOpen(true);
    };

    // 유저 리스트
    const reqUserList = (pageNum, pageSize) => {
        dispatch(
            set_spinner({
                isLoading: true,
            })
        );

        // account/v1/user/infos
        // POST
        let url = apiPath.api_user_list;
        let data = {
            pageNum: pageNum,
            pageSize: pageSize,
        };

        RestServer("post", url, data)
            .then((response) => {
                let res = response;
                let resultCode = res.headers.resultCode;

                // 성공
                if (resultCode === "0000") {
                    let resultInfo = res.data.resultInfo;
                    let pageInfo = res.data.pageInfo;

                    setUserList(resultInfo);
                    setPageInfo(pageInfo);

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
                CommonErrorCatch(error, dispatch, alert);
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
                let resultCode = res.headers.resultCode;
                let resultInfo = res.data.resultInfo;

                // 성공
                if (resultCode === "0000") {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    setModUserData(resultInfo);

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

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: response.headers.resultMessageKo,
                    });
                }
            })
            .catch((error) => {
                CommonErrorCatch(error, dispatch, alert);
            });
    };

    // 회원 선택 삭제
    const clickRemove = () => {
        //선택여부 확인
        checkItems.length === 0
            ? CommonNotify({
                  type: "alert",
                  hook: alert,
                  message: "사용자를 선택해주세요",
              })
            : CommonNotify({
                  type: "confirm",
                  hook: confirm,
                  message: "선택된 사용자를 삭제 하시겠습니까?",
                  callback: removeUser,
              });
    };

    // 삭제 confirm callback
    const removeUser = () => {
        let checkItemsStr = checkItems.join();

        dispatch(
            set_spinner({
                isLoading: true,
            })
        );

        // account/v1/user/user/{user_idx}
        // DELETE
        const url = apiPath.api_admin_user_remove + `/${checkItemsStr}`;
        const data = {};

        RestServer("delete", url, data)
            .then((response) => {
                let res = response;
                let resultCode = res.headers.resultCode;
                let resultInfo = res.data.resultInfo;

                // 성공
                if (resultCode === "0000") {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: response.headers.resultMessageKo,
                    });

                    handleNeedUpdate();
                }
                // 에러
                else {
                    CommonConsole("log", response);

                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: response.headers.resultMessageKo,
                    });
                }
            })
            .catch((error) => {
                CommonErrorCatch(error, dispatch, alert);
            });
    };

    // 체크박스 단일 선택
    const handleSingleCheck = (checked, id) => {
        if (checked) {
            // 단일 선택 시 체크된 아이템을 배열에 추가
            setCheckItems((prev) => [...prev, id]);
        } else {
            // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
            setCheckItems(checkItems.filter((el) => el !== id));
        }
    };

    // 체크박스 전체 선택
    const handleAllCheck = (checked) => {
        if (checked) {
            // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
            const idArray = [];
            userList.forEach((el) => idArray.push(el.userIdx));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        reqUserList(value, 10);
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
                            <Link className="subbtn del" onClick={clickRemove}>
                                선택삭제
                            </Link>{" "}
                            <Link className="subbtn on" onClick={regUser}>
                                회원등록
                            </Link>{" "}
                            <Link className="subbtn on">엑셀 다운로드</Link>
                        </div>
                    </div>
                    <div className="adm_table">
                        <table className="table_a">
                            <colgroup>
                                <col width="2%" />
                                <col width="5%" />
                                <col width="7%" />
                                <col width="5%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="8%" />
                                <col width="8%" />
                                <col width="8%" />
                                <col width="7%" />
                                <col width="6%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            name="select-all"
                                            onChange={(e) =>
                                                handleAllCheck(e.target.checked)
                                            }
                                            checked={
                                                checkItems.length ===
                                                userList.length
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </th>
                                    <th>고유번호</th>
                                    <th>구분</th>
                                    <th>상태</th>
                                    <th>아이디</th>
                                    <th>이름</th>
                                    <th>연락처</th>
                                    <th>소속</th>
                                    <th>전공과</th>
                                    <th>전공분야</th>
                                    <th>가입일</th>
                                    <th>정보수정</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList &&
                                    userList.map((item, idx) => (
                                        <tr key={`list_${idx}`}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name={`userIdx_${item.userIdx}`}
                                                    id={item.userIdx}
                                                    defaultValue={item.userIdx}
                                                    onChange={(e) =>
                                                        handleSingleCheck(
                                                            e.target.checked,
                                                            item.userIdx
                                                        )
                                                    }
                                                    checked={
                                                        checkItems.includes(
                                                            item.userIdx
                                                        )
                                                            ? true
                                                            : false
                                                    }
                                                />
                                            </td>
                                            <td>{item.userKey}</td>
                                            <td>{item.userRole}</td>
                                            <td>{item.userStatus}</td>
                                            <td>{item.userId}</td>
                                            <td>{item.userNameKo}</td>
                                            <td>{`${item.mobile1}-${item.mobile2}-${item.mobile3}`}</td>
                                            <td>{item.organizationNameKo}</td>
                                            <td>{item.departmentNameKo}</td>
                                            <td>{item.specializedNameKo}</td>
                                            <td>
                                                {item.regDttm.split(" ")[0]}
                                            </td>
                                            <td>
                                                <Link
                                                    className="tablebtn"
                                                    onClick={(e) => {
                                                        modUser(item.userIdx);
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
                    {pageInfo && (
                        <div className="pagenation">
                            <Pagination
                                count={pageInfo.pages}
                                onChange={handleChange}
                                shape="rounded"
                                color="primary"
                            />
                        </div>
                    )}
                </div>
            </div>
            <RegUserModal
                isOpen={isOpen}
                title={modalTitle}
                handleModalClose={handleModalClose}
                modUserData={modUserData}
                handleNeedUpdate={handleNeedUpdate}
            />
        </>
    );
};

export default UserList;
