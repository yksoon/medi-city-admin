import { Link } from "react-router-dom";
import useAlert from "hook/useAlert";
import useConfirm from "hook/useConfirm";
import {CommonConsole, CommonErrModule, CommonModal, CommonNotify, CommonRest} from "common/js/Common";
import {useSetRecoilState} from "recoil";
import {isSpinnerAtom} from "recoils/atoms";
import {useEffect, useMemo, useRef, useState} from "react";
import {createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable} from "@tanstack/react-table";
import {apiPath} from "webPath";
import {successCode} from "common/js/resultCode";
import SearchBar from "components/common/SearchBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {Checkbox, Pagination} from "@mui/material";

const KmediNoticeMng = (props) => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const isRefresh = props.isRefresh;

    /**
     * states
     */
    // 테이블 세팅
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();

    // 리스트 states
    const [boardList, setBoardList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [page, setPage] = useState(1);
    const [checkItems, setCheckItems] = useState([]);

    // 상세 데이터 states
    const [modData, setModData] = useState({});

    // 모달 states
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    const searchKeyword = useRef(null);

    useEffect(() => {
        getBoardList(page, 10, "");
    }, [isNeedUpdate, isRefresh]);

    // 리스트
    const getBoardList = (pageNum, pageSize, searchKeyword) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_board_notice_list;
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
                setBoardList(result_info);
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

    // 검색
    const doSearch = () => {
        const keyword = searchKeyword.current.value;

        getBoardList(1, 10, keyword);
    };

    // 리스트 새로고침
    const handleNeedUpdate = () => {
        setModalTitle("");
        setIsOpen(false);
        setIsNeedUpdate(!isNeedUpdate);
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
            boardList.forEach((el) => idArray.push(el.notice_sq));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getBoardList(value, 10, searchKeyword.current.value);
        setPage(value);
    };

    // 신규 등록 모달
    const regBoard = () => {
        setModalTitle("공지사항 신규 등록");
        setIsOpen(true);
    };

    // 상세보기 모달
    const modBoard = () => {
        setModalTitle("공지사항 상세보기");
        setIsOpen(true);
    };

    // 공지사항 상세
    const detailBoard = (board_idx) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_board_notice_detail + board_idx;
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

                modBoard();

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

    // 선택 삭제
    const clickRemove = () => {
        //선택여부 확인
        checkItems.length === 0
            ? CommonNotify({
                type: "alert",
                hook: alert,
                message: "삭제할 목록을 선택해주세요",
            })
            : CommonNotify({
                type: "confirm",
                hook: confirm,
                message: "선택된 목록을 삭제 하시겠습니까?",
                callback: () => removeBoard(),
            });
    };

    // 삭제
    const removeBoard = async () => {
        let checkItemsStr = checkItems.join();
        setIsSpinner(true);

        const url = `${apiPath.api_admin_kmedi_board_notice_remove}${checkItemsStr}`;

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
                    message: "삭제가 완료 되었습니다",
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
            accessorKey: "notice_sq",
            cell: (info) => (
                <Checkbox
                    size="small"
                    name={`notice_sq_${info.getValue()}`}
                    id={info.getValue()}
                    value={info.getValue()}
                    onChange={(e) =>
                        handleSingleCheck(
                            e.target.checked,
                            info.getValue()
                        )
                    }
                    checked={checkItems.includes(info.getValue()) ? true : false}
                />
            ),
            header: () => (
                <Checkbox
                    size="small"
                    type="checkbox"
                    name="select-all"
                    onChange={(e) => handleAllCheck(e.target.checked)}
                    checked={
                        checkItems &&
                        boardList &&
                        checkItems.length === boardList.length
                    }
                />
            ),
            enableSorting: false,
        },

        columnHelper.accessor((row) => row.notice_sq, {
            id: "notice",
            cell: (info) => info.getValue(),
            header: "번호",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.notice_title, {
            id: "notice_title",
            cell: (info) => info.getValue(),
            header: "제목",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.notice_desc, {
            id: "notice_desc",
            cell: (info) => info.getValue(),
            header: "내용",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.insert_id.split(" ")[0], {
            id: "insert_id",
            cell: (info) => info.getValue(),
            header: "등록자",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => (
            <>
                {row.insert_dt.split(" ")[0]}<br/>
                {row.insert_dt.split(" ")[1]}
            </>
        ), {
            id: "insert_dt",
            cell: (info) => info.getValue(),
            header: "등록일",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => (
                <Link
                    className="tablebtn"
                    onClick={() => detailBoard(row.notice_sq)}
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

    const data = useMemo(() => boardList, [boardList]);

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
                    <h3>공지사항</h3>
                </div>
                <div className="con_area">
                    {/*검색 바*/}
                    <SearchBar
                        searchKeyword={searchKeyword}
                        doSearch={doSearch}
                        regBoard={regBoard}
                        // downloadExcel={downloadExcel}
                        clickRemove={clickRemove}
                    />

                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                            marginBottom: "10px",
                        }}
                    >
                        총 : <b>&nbsp; {pageInfo && pageInfo.total} &nbsp;</b>{" "}
                        건
                    </div>

                    <div className="kmedi_content">
                        <div className="kmedi_notice">
                            <div className="adm_table">
                                <table className="table_a">
                                    <colgroup>
                                        <col width="2%"/>
                                        <col width="5%"/>
                                        <col width="15%"/>
                                        <col width="*"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="5%"/>
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
                                                                                <ArrowDropUpIcon/>
                                                                                <ArrowDropDownIcon/>
                                                                            </div>
                                                                        ),
                                                                        desc: (
                                                                            <div className="sort_desc">
                                                                                <ArrowDropUpIcon/>
                                                                                <ArrowDropDownIcon/>
                                                                            </div>
                                                                        ),
                                                                    }[
                                                                        header.column.getIsSorted()
                                                                        ] ?? (
                                                                        <div>
                                                                            <ArrowDropUpIcon/>
                                                                            <ArrowDropDownIcon/>
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
                                    {boardList.length !== 0 ? (
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
                                                    colSpan="100%"
                                                    style={{height: "55px"}}
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
                </div>
            </div>
            <CommonModal
                isOpen={isOpen}
                title={modalTitle}
                width={"800"}
                handleModalClose={handleModalClose}
                component={"KmediBoardNoticeModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
            />
        </>
    );
};

export default KmediNoticeMng;
