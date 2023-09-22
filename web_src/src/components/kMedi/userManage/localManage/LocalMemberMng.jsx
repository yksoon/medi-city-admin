import {
    CommonConsole,
    CommonErrModule,
    CommonModal,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import useConfirm from "hook/useConfirm";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Pagination } from "@mui/material";

const LocalMemberMng = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [userList, setUserList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [checkItems, setCheckItems] = useState([]);

    // 회원 상세 데이터
    const [modData, setModData] = useState({});

    // 모달
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    // 테이블 세팅
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();

    const isRefresh = props.isRefresh;

    useEffect(() => {
        getUserList(1, 10, "");
    }, [isNeedUpdate, isRefresh]);

    // 리스트
    const getUserList = (pageNum, pageSize, searchKeyword) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_member_list;
        const data = {
            page_num: pageNum,
            page_size: pageSize,
            search_keyword: searchKeyword,
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
            const result_code = res.headers.result_code;

            // 성공
            if (
                result_code === successCode.success ||
                result_code === successCode.noData
            ) {
                const result_info = res.data.result_info;
                const page_info = res.data.page_info;

                // console.log(res);
                setUserList(result_info);
                setPageInfo(page_info);

                // console.log(res);
                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    // 모달창 닫기
    const handleModalClose = () => {
        CommonNotify({
            type: "confirm",
            hook: confirm,
            message: "입력된 정보가 초기화 됩니다. 창을 닫으시겠습니까?",
            callback: () => close(),
        });

        const close = () => {
            setModalTitle("");
            setModData({});
            setIsOpen(false);
        };
    };

    // 리스트 새로고침
    const handleNeedUpdate = () => {
        setModalTitle("");
        setIsOpen(false);
        setIsNeedUpdate(!isNeedUpdate);
    };

    // 약관 신규 등록 모달
    const regUser = () => {
        setModalTitle("현지회원 신규 등록");
        setIsOpen(true);
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
            userList.forEach((el) => idArray.push(el.member_sq));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getUserList(value, 10);
    };

    // 약관 상세
    const detailUser = (member_sq) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_member_detail + member_sq;
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
            if (res.headers.result_code === successCode.success) {
                const result_info = res.data.result_info;
                setModData(result_info);

                modUser();

                setIsSpinner(false);
            } else {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                });
            }
        };
    };

    // 현지회원 상세보기 모달
    const modUser = () => {
        setModalTitle("현지회원 상세보기");
        setIsOpen(true);
    };

    // 약관 선택 삭제
    const clickRemove = () => {
        //선택여부 확인
        checkItems.length === 0
            ? CommonNotify({
                  type: "alert",
                  hook: alert,
                  message: "탈퇴처리 할 회원을 선택해주세요",
              })
            : CommonNotify({
                  type: "confirm",
                  hook: confirm,
                  message: "선택된 목록을 삭제 하시겠습니까?",
                  callback: () => removeUsers(),
              });
    };

    // 삭제 버튼
    const removeUsers = async () => {
        let checkItemsStr = checkItems.join();
        setIsSpinner(true);

        const url = `${apiPath.api_admin_kmedi_member_remove}${checkItemsStr}`;

        const restParams = {
            method: "delete",
            url: url,
            data: {},
            err: err,
            callback: (res) => responsLogic(res),
        };

        CommonRest(restParams);

        const responsLogic = (res) => {
            const result_code = res.headers.result_code;
            if (result_code === successCode.success) {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "탈퇴 처리가 완료 되었습니다",
                    callback: () => handleNeedUpdate(),
                });
            } else {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "잠시 후 다시 시도해주세요",
                });
            }
        };
    };

    // 컬럼 세팅
    const columns = useMemo(() => [
        {
            accessorKey: "member_sq",
            cell: (info) => (
                <input
                    type="checkbox"
                    name={`member_sq_${info.getValue()}`}
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

        columnHelper.accessor((row) => row.insert_dt.split(" ")[0], {
            id: "insert_dt",
            cell: (info) => info.getValue(),
            header: "가입일",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.member_status_cd_nm, {
            id: "member_status_cd_nm",
            cell: (info) => info.getValue(),
            header: "상태",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.member_type_cd_nm, {
            id: "member_type_cd_nm",
            cell: (info) => info.getValue(),
            header: "구분",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.member_nm, {
            id: "member_nm",
            cell: (info) => info.getValue(),
            header: "이름",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => <></>, {
            id: "phone",
            cell: (info) => info.getValue(),
            header: "연락처",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.member_email_addr, {
            id: "member_email_addr",
            cell: (info) => info.getValue(),
            header: "이메일",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.member_company_nm, {
            id: "member_company_nm",
            cell: (info) => info.getValue(),
            header: "소속병원",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => (
                <Link
                    className="tablebtn"
                    onClick={() => detailUser(row.member_sq)}
                >
                    상세보기
                </Link>
            ),
            {
                id: "viewDetail",
                cell: (info) => info.getValue(),
                header: "상세보기",
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
                    <h3>회원 관리 - 현지회원</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_top_wrap">
                        <div className="kmedi_top_box">
                            <div className="kmedi_top">
                                <h5>기간조회</h5>
                                <a href="" className="kmedi_top_btn">
                                    7일
                                </a>
                                <a href="" className="kmedi_top_btn">
                                    14일
                                </a>
                                <a href="" className="kmedi_top_btn">
                                    30일
                                </a>
                                <a href="" className="kmedi_top_btn">
                                    3개월
                                </a>
                                <input type="date" className="input" /> ~{" "}
                                <input type="date" className="input" />
                            </div>
                            <div className="kmedi_top">
                                <h5>회원상태</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_state1"
                                        name="member_state"
                                    />
                                    <label for="member_state1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_state2"
                                        name="member_state"
                                    />
                                    <label for="member_state2">정상</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_state3"
                                        name="member_state"
                                    />
                                    <label for="member_state3">탈퇴</label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <h5>회원구분</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_division1"
                                        name="member_division"
                                    />
                                    <label for="member_division1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_division2"
                                        name="member_division"
                                    />
                                    <label for="member_division2">
                                        개인의사
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_division3"
                                        name="member_division"
                                    />
                                    <label for="member_division3">
                                        영업사원
                                    </label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <h5>상세정보</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_detail1"
                                        name="member_detail"
                                    />
                                    <label for="member_detail1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_detail2"
                                        name="member_detail"
                                    />
                                    <label for="member_detail2">입력</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_detail3"
                                        name="member_detail"
                                    />
                                    <label for="member_detail3">미입력</label>
                                </div>
                            </div>
                        </div>
                        <div className="kmedi_top_box">
                            <div className="kmedi_top">
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">회원이름</option>
                                    <option value="">병원이름</option>
                                    <option value="">핸드폰</option>
                                    <option value="">customer ID</option>
                                </select>
                                <input type="text" className="input" />
                                <a href="" className="subbtn off">
                                    검색
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="adm_statistics">
                        <div>
                            <h5>회원</h5>
                            <ul>
                                <li>
                                    <a href="">
                                        전체 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        개인의사 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        영업사원 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        한국 크리에이터 <strong>00</strong>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5>1:1문의</h5>
                            <ul>
                                <li>
                                    <a href="">
                                        전체 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        답변대기 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        답변완료 <strong>00</strong>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="kmedi_add_btn">
                        <div>
                            <Link className="subbtn del" onClick={clickRemove}>
                                강제탈퇴
                            </Link>{" "}
                            <Link className="subbtn on" onClick={regUser}>
                                회원등록
                            </Link>
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
                                <col width="5%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                            </colgroup>
                            <thead>
                                {/* <tr>
                                    <th>
                                        <input type="checkbox" />
                                    </th>
                                    <th>가입일</th>
                                    <th>상태</th>
                                    <th>구분</th>
                                    <th>이름</th>
                                    <th>연락처</th>
                                    <th>이메일</th>
                                    <th>소속병원</th>
                                    <th>상세보기</th>
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
                                {/* <tr>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>23-05-30</td>
                                    <td>정상</td>
                                    <td>개인의사</td>
                                    <td>임은지</td>
                                    <td>010-0000-0000</td>
                                    <td>ej.lim@hicomp.net</td>
                                    <td>hicompint</td>
                                    <td>
                                        <a
                                            href="kmedi_member_local_detail.html"
                                            className="tablebtn"
                                        >
                                            상세보기
                                        </a>
                                    </td>
                                </tr> */}
                                {userList.length !== 0 ? (
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
                                                colSpan="9"
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
                component={"KmediLocalUserModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
            />
        </>
    );
};

export default LocalMemberMng;
