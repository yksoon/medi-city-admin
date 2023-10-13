import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
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
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Pagination } from "@mui/material";

const KmediCreatorMemberMng = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [userList, setUserList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [checkItems, setCheckItems] = useState([]);

    // 회원 상세 데이터
    const [modData, setModData] = useState({});

    // 회원 등록 모달
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [regModalTitle, setRegModalTitle] = useState("");

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

        const url = apiPath.api_admin_kmedi_creator_list;
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
            userList.forEach((el) => idArray.push(el.creator_sq));
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

    // 크리에이터 회원 등록
    const regUser = () => {
        setRegModalTitle("크리에이터 신규 등록");
        setIsRegModalOpen(true);
    };

    // 등록 모달창 닫기
    const handleRegModalClose = () => {
        setRegModalTitle("");
        // setModData({});
        setIsRegModalOpen(false);
    };

    // 상세보기
    const detailUser = (member_sq) => {
        setModalTitle("크리에이터 상세보기");
        setIsOpen(true);
    };

    // 상세 모달창 닫기
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
        setRegModalTitle("");

        setIsOpen(false);
        setIsRegModalOpen(false);

        setIsNeedUpdate(!isNeedUpdate);
    };

    // -------------------------------------------------------------------------------------------------------
    // ----------------------------------------- react table setting -----------------------------------------
    // -------------------------------------------------------------------------------------------------------

    // 컬럼 세팅
    const columns = useMemo(() => [
        {
            accessorKey: "creator_sq",
            cell: (info) => (
                <input
                    type="checkbox"
                    name={`creator_sq_${info.getValue()}`}
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

        columnHelper.accessor((row) => row.creator_nm, {
            id: "creator_nm",
            cell: (info) => info.getValue(),
            header: "이름",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.creator_desc, {
            id: "creator_desc",
            cell: (info) => info.getValue(),
            header: "설명",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.creator_email_addr, {
            id: "creator_email_addr",
            cell: (info) => info.getValue(),
            header: "이메일",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.creator_phone_no, {
            id: "creator_phone_no",
            cell: (info) => info.getValue(),
            header: "연락처",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => (
                <Link
                    className="tablebtn"
                    onClick={() => detailUser(row.creator_sq)}
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
                    <h3>회원 관리 - 한국 크리에이터</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_top_wrap">
                        <div className="kmedi_top_box">
                            <div className="kmedi_top">
                                <h5>기간조회</h5>
                                <Link href="" className="kmedi_top_btn">
                                    7일
                                </Link>
                                <Link href="" className="kmedi_top_btn">
                                    14일
                                </Link>
                                <Link href="" className="kmedi_top_btn">
                                    30일
                                </Link>
                                <Link href="" className="kmedi_top_btn">
                                    3개월
                                </Link>
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
                                    <label htmlFor="member_state1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_state2"
                                        name="member_state"
                                    />
                                    <label htmlFor="member_state2">정상</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_state3"
                                        name="member_state"
                                    />
                                    <label htmlFor="member_state3">탈퇴</label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">회원이름</option>
                                    <option value="">병원이름</option>
                                    <option value="">이메일</option>
                                    <option value="">핸드폰</option>
                                </select>
                                <input type="text" className="input" />
                                <Link href="" className="subbtn off">
                                    검색
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="adm_statistics">
                        <div>
                            <h5>회원</h5>
                            <ul>
                                <li>
                                    <Link href="">
                                        전체 <strong>00</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        병원그룹 <strong>00</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        병원그룹 <strong>00</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        영업사원 <strong>00</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        한국 크리에이터 <strong>00</strong>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="kmedi_add_btn">
                        <div>
                            <Link className="subbtn on" onClick={regUser}>
                                회원등록
                            </Link>
                            <Link href="" className="subbtn on">
                                엑셀 다운로드
                            </Link>
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
                                <col width="3%" />
                                <col width="15%" />
                                <col width="*" />
                                <col width="15%" />
                                <col width="10%" />
                                <col width="5%" />
                            </colgroup>
                            <thead>
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
                                                                        ? "cursor-pointer select-none table_sort"
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
                                                            {header.column.getCanSort() &&
                                                                ({
                                                                    asc: (
                                                                        <div className="sort_asc">
                                                                            <ArrowDropUpIcon />
                                                                            <ArrowDropDownIcon />
                                                                        </div>
                                                                    ),
                                                                    desc: (
                                                                        <div className="sort_desc">
                                                                            <ArrowDropUpIcon />
                                                                            <ArrowDropDownIcon />
                                                                        </div>
                                                                    ),
                                                                }[
                                                                    header.column.getIsSorted()
                                                                ] ?? (
                                                                    <div>
                                                                        <ArrowDropUpIcon />
                                                                        <ArrowDropDownIcon />
                                                                    </div>
                                                                ))}
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
                                                colSpan="6"
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
            {/* 신규 회원 등록 */}
            <CommonModal
                isOpen={isRegModalOpen}
                title={regModalTitle}
                width={"1400"}
                handleModalClose={handleRegModalClose}
                component={"KmediCreatorRegModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
            />
            {/* 신규 회원 등록 END */}
            {/* 회원 상세 */}
            <CommonModal
                isOpen={isOpen}
                title={modalTitle}
                width={"800"}
                handleModalClose={handleModalClose}
                component={"KmediCreatorDetailModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
            />
            {/* 회원 상세 END */}
        </>
    );
};

export default KmediCreatorMemberMng;
