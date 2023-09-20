import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    CommonConsole,
    CommonErrModule,
    CommonModal,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import { apiPath } from "webPath";
import { Pagination } from "@mui/material";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { successCode } from "common/js/resultCode";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

const UserList = (props) => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 테이블 세팅
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();

    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [userList, setUserList] = useState([]);
    const [modUserData, setModUserData] = useState(null);
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);
    const [checkItems, setCheckItems] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const isRefresh = props.isRefresh;

    useEffect(() => {
        reqUserList(1, 10);
    }, [isNeedUpdate, isRefresh]);

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
        setIsSpinner(true);

        // account/v1/user/infos
        // POST
        let url = apiPath.api_user_list;
        let data = {
            page_num: pageNum,
            page_size: pageSize,
        };

        // 파라미터
        const restParams = {
            method: "post",
            url: url,
            data: data,
            err: err,
            callback: (res) => responsLogic(res),
        };
        CommonRest(restParams);

        const responsLogic = (res) => {
            let result_code = res.headers.result_code;

            // 성공
            if (
                result_code === successCode.success ||
                result_code === successCode.noData
            ) {
                let result_info = res.data.result_info;
                let page_info = res.data.page_info;

                setUserList(result_info);
                setPageInfo(page_info);

                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    // 회원 정보 수정
    const modUser = (user_idx) => {
        setIsSpinner(true);

        let userIdx = String(user_idx);

        // account/v1/user/info/{user_idx}
        // GET
        const url = apiPath.api_user_info + `/${userIdx}`;
        const data = {};

        // 파라미터
        const restParams = {
            method: "get",
            url: url,
            data: data,
            err: err,
            callback: (res) => responsLogic(res),
        };

        CommonRest(restParams);

        const responsLogic = (res) => {
            let result_code = res.headers.result_code;
            let result_info = res.data.result_info;

            // 성공
            if (result_code === successCode.success) {
                setIsSpinner(false);

                setModUserData(result_info);

                setModalTitle("회원수정");
                setIsOpen(true);
            }
            // 에러
            else {
                CommonConsole("log", res);

                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                });
            }
        };
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
                  callback: () => removeUser(),
              });
    };

    // 삭제 confirm callback
    const removeUser = () => {
        let checkItemsStr = checkItems.join();

        setIsSpinner(true);

        // account/v1/user/user/{user_idx}
        // DELETE
        const url = apiPath.api_admin_user_remove + `/${checkItemsStr}`;
        const data = {};

        // 파라미터
        const restParams = {
            method: "delete",
            url: url,
            data: data,
            err: err,
            callback: (res) => responsLogic(res),
        };

        CommonRest(restParams);

        const responsLogic = (res) => {
            let result_code = res.headers.result_code;

            // 성공
            if (result_code === successCode.success) {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                    callback: () => pageUpdate(),
                });
            }
            // 에러
            else {
                CommonConsole("log", res);

                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                });
            }

            const pageUpdate = () => {
                handleNeedUpdate();
            };
        };
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
            userList.forEach((el) => idArray.push(el.user_idx));
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

    // 컬럼 세팅
    const columns = useMemo(() => [
        {
            accessorKey: "user_idx",
            cell: (info) => (
                <input
                    type="checkbox"
                    name={`userIdx_${info.getValue()}`}
                    id={info.getValue()}
                    value={info.getValue()}
                    onChange={(e) =>
                        handleSingleCheck(e.target.checked, info.getValue())
                    }
                    checked={
                        checkItems.includes(info.getValue()) ? true : false
                    }
                />
            ),
            header: () => (
                <input
                    type="checkbox"
                    name="select-all"
                    onChange={(e) => handleAllCheck(e.target.checked)}
                    checked={
                        checkItems &&
                        userList &&
                        checkItems.length === userList.length
                            ? true
                            : false
                    }
                />
            ),
            enableSorting: false,
        },
        columnHelper.accessor((row) => row.user_key, {
            id: "user_key",
            cell: (info) => info.getValue(),
            header: "고유번호",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.user_role, {
            id: "user_role",
            cell: (info) => info.getValue(),
            header: "구분",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.user_status, {
            id: "nation_type_cd",
            cell: (info) => info.getValue(),
            header: "상태",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.user_id, {
            id: "user_id",
            cell: (info) => info.getValue(),
            header: "아이디",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.user_name_ko, {
            id: "user_name_ko",
            cell: (info) => info.getValue(),
            header: "이름",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => `${row.mobile1}-${row.mobile2}-${row.mobile3}`,
            {
                id: "mobile1",
                cell: (info) => info.getValue(),
                header: "연락처",
                enableSorting: false,
            }
        ),

        columnHelper.accessor((row) => row.organization_name_ko, {
            id: "organization_name_ko",
            cell: (info) => info.getValue(),
            header: "소속",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.department_name_ko, {
            id: "department_name_ko",
            cell: (info) => info.getValue(),
            header: "전공과",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.specialized_name_ko, {
            id: "specialized_name_ko",
            cell: (info) => info.getValue(),
            header: "전공분야",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.reg_dttm.split(" ")[0], {
            id: "reg_dttm",
            cell: (info) => info.getValue(),
            header: "가입일",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => (
                <Link
                    className="tablebtn"
                    onClick={() => modUser(row.user_idx)}
                >
                    정보수정
                </Link>
            ),
            {
                id: "viewDetail",
                cell: (info) => info.getValue(),
                header: "정보수정",
                enableSorting: false,
            }
        ),
    ]);

    const data = useMemo(() => userList, [userList]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

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

                    {/* 총 건수 */}
                    {Object.keys(pageInfo).length !== 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: "10px",
                            }}
                        >
                            총 :{" "}
                            <b>&nbsp; {pageInfo && pageInfo.total} &nbsp;</b> 명
                        </div>
                    )}
                    {/* 총 건수 END */}

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
                                {/* <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            name="select-all"
                                            onChange={(e) =>
                                                handleAllCheck(e.target.checked)
                                            }
                                            checked={
                                                checkItems &&
                                                userList &&
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
                                </tr> */}
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <th
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <div
                                                            {...{
                                                                className:
                                                                    header.column.getCanSort()
                                                                        ? "cursor-pointer select-none"
                                                                        : "",
                                                                onClick:
                                                                    header.column.getToggleSortingHandler(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                            {
                                                                {
                                                                    asc: " 🔼",
                                                                    desc: " 🔽",
                                                                }[
                                                                    header.column.getIsSorted()
                                                                ] ?? null
                                                                // <span className="blue">
                                                                //     ⇅
                                                                // </span>
                                                            }
                                                        </div>
                                                    )}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {userList.length !== 0 ? (
                                    // userList.map((item, idx) => (
                                    //     <tr key={`list_${idx}`}>
                                    //         <td>
                                    //             <input
                                    //                 type="checkbox"
                                    //                 name={`userIdx_${item.user_idx}`}
                                    //                 id={item.user_idx}
                                    //                 defaultValue={item.user_idx}
                                    //                 onChange={(e) =>
                                    //                     handleSingleCheck(
                                    //                         e.target.checked,
                                    //                         item.user_idx
                                    //                     )
                                    //                 }
                                    //                 checked={
                                    //                     checkItems.includes(
                                    //                         item.user_idx
                                    //                     )
                                    //                         ? true
                                    //                         : false
                                    //                 }
                                    //             />
                                    //         </td>
                                    //         <td>{item.user_key}</td>
                                    //         <td>{item.user_role}</td>
                                    //         <td>{item.user_status}</td>
                                    //         <td>{item.user_id}</td>
                                    //         <td>{item.user_name_ko}</td>
                                    //         <td>{`${item.mobile1}-${item.mobile2}-${item.mobile3}`}</td>
                                    //         <td>{item.organization_name_ko}</td>
                                    //         <td>{item.department_name_ko}</td>
                                    //         <td>{item.specialized_name_ko}</td>
                                    //         <td>
                                    //             {item.reg_dttm.split(" ")[0]}
                                    //         </td>
                                    //         <td>
                                    //             <Link
                                    //                 className="tablebtn"
                                    //                 onClick={(e) => {
                                    //                     modUser(item.user_idx);
                                    //                 }}
                                    //             >
                                    //                 정보 수정
                                    //             </Link>
                                    //         </td>
                                    //     </tr>
                                    // ))}
                                    table.getRowModel().rows.map((row) => (
                                        <tr key={row.id}>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <td key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                ))}
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        <tr>
                                            <td
                                                colSpan="12"
                                                style={{ height: "55px" }}
                                            >
                                                <b>데이터가 없습니다.</b>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {Object.keys(pageInfo).length !== 0 && (
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
            <CommonModal
                isOpen={isOpen}
                title={modalTitle}
                width={"800"}
                handleModalClose={handleModalClose}
                component={"RegUserModal"}
                handleNeedUpdate={handleNeedUpdate}
                modUserData={modUserData}
            />
        </>
    );
};

export default UserList;
