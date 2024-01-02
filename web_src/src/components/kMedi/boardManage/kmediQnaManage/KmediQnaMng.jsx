import { Link } from "react-router-dom";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import {CommonConsole, CommonErrModule, CommonNotify, CommonRest} from "common/js/Common";
import {useSetRecoilState} from "recoil";
import {isSpinnerAtom} from "recoils/atoms";
import React, {useEffect, useMemo, useState} from "react";
import {createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable} from "@tanstack/react-table";
import {apiPath} from "webPath";
import {successCode} from "common/js/resultCode";
import {Checkbox} from "@mui/material";
import CommonListComponent from "components/common/CommonListComponent";

const KmediQnaMng = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const isRefresh = props.isRefresh;
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    const [boardList, setBoardList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [checkItems, setCheckItems] = useState([]);
    const [page, setPage] = useState(1);

    // 상세 데이터
    const [modData, setModData] = useState({});

    // 모달
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");

    // 테이블 세팅
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();

    useEffect(() => {
        getBoardList(page, 10, "");
    }, [isNeedUpdate, isRefresh]);

    // 리스트 새로고침
    const handleNeedUpdate = () => {
        setModalTitle("");
        setIsOpen(false);
        setIsNeedUpdate(!isNeedUpdate);
    };

    // 리스트
    const getBoardList = (pageNum, pageSize, searchKeyword) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_board_qna_list;
        const data = {
            page_num: pageNum,
            page_size: pageSize,
            // search_tp: "qnaTitle",
            // search_wd: searchKeyword,
            search_wd: searchKeyword,
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
            boardList.forEach((el) => idArray.push(el.banner_sq));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 약관 상세
    const detailBoard = (idx) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_board_qna_detail + idx;
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

    // 신규 등록 모달
    const regBoard = () => {
        setModalTitle("배너 신규 등록");
        setIsOpen(true);
    };

    // 상세보기 모달
    const modBoard = () => {
        setModalTitle("배너 상세보기");
        setIsOpen(true);
    };

    // 선택 삭제
    const removeBoard = () => {
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
                callback: () => doRemoveBoard(),
            });
    };

    // 삭제
    const doRemoveBoard = async () => {
        let checkItemsStr = checkItems.join();
        setIsSpinner(true);

        const url = `${apiPath.api_admin_kmedi_board_qna_remove}${checkItemsStr}`;

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
            accessorKey: "qna_sq",
            cell: (info) => (
                <Checkbox
                    size="small"
                    name={`qna_sq_${info.getValue()}`}
                    id={info.getValue()}
                    value={info.getValue()}
                    onChange={(e) =>
                        handleSingleCheck(e.target.checked, info.getValue())
                    }
                    checked={
                        checkItems.includes(info.getValue())
                    }
                />
            ),
            header: () => (
                <Checkbox
                    size="small"
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

        columnHelper.accessor((row) => row.member_nm, {
            id: "member_nm",
            cell: (info) => info.getValue(),
            header: "회원명",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.member_type_cd_nm, {
            id: "member_type_cd_nm",
            cell: (info) => info.getValue(),
            header: "회원구분명",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.member_company_nm, {
            id: "member_company_nm",
            cell: (info) => info.getValue(),
            header: "회원소속명",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.qna_title, {
            id: "qna_title",
            cell: (info) => info.getValue(),
            header: "제목",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.qna_desc, {
            id: "qna_desc",
            cell: (info) => info.getValue(),
            header: "답변내용",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.is_complete === "Y" ? "완료" : row.is_complete === "N" ? "미완료" : "", {
            id: "is_complete",
            cell: (info) => info.getValue(),
            header: "답변상태",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.insert_dt, {
            id: "insert_dt",
            cell: (info) => info.getValue(),
            header: "등록일",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => (
                <Link
                    to=""
                    className="tablebtn"
                    onClick={() => detailBoard(row.qna_sq)}
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

    const colWidth = [
        "2%",
        "10%",
        "5%",
        "10%",
        "15%",
        "*",
        "7%",
        "10%",
        "5%",
    ]

    return (
        <>
            <CommonListComponent
                templateTitle={"게시판 관리 - QNA"}
                modalComponent={"KmediBannerModal"}
                modalWidth={"800"}
                boardList={boardList}
                getBoardList={getBoardList}
                modData={modData}
                setModData={setModData}
                pageInfo={pageInfo}
                isNeedUpdate={isNeedUpdate}
                setIsNeedUpdate={setIsNeedUpdate}
                checkItems={checkItems}
                setCheckItems={setCheckItems}
                table={table}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                modalTitle={modalTitle}
                setModalTitle={setModalTitle}
                setPage={setPage}
                handleNeedUpdate={handleNeedUpdate}
                colWidth={colWidth}
                /**
                * 검색바 props
                */
                regBoard={regBoard}
                removeBoard={removeBoard}
                // downloadExcel={downloadExcel}
                // uploadExcel={uploadExcel}
            />
        </>
    );
};

export default KmediQnaMng;
