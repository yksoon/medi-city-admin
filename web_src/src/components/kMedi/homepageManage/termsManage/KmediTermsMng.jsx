import {
    CommonConsole,
    CommonErrModule,
    CommonModal,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import React, {useEffect, useMemo, useRef, useState} from "react";
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
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";
import useConfirm from "hook/useConfirm";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchBar from "components/common/SearchBar";
import CommonListComponent from "components/common/CommonListComponent";

const KmediTermsMng = (props) => {
    const {confirm} = useConfirm();
    const {alert} = useAlert();
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

        const url = apiPath.api_admin_kmedi_terms_list;
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
            boardList.forEach((el) => idArray.push(el.terms_sq));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 약관 상세
    const detailBoard = (idx) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_terms_detail + idx;
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
        setModalTitle("약관 신규 등록");
        setIsOpen(true);
    };

    // 상세보기 모달
    const modBoard = () => {
        setModalTitle("약관 상세보기");
        setIsOpen(true);
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getTermsList(value, 10, searchKeyword.current.value)

        setPage(value)
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

    // 삭제 버튼
    const doRemoveBoard = async () => {
        let checkItemsStr = checkItems.join();
        setIsSpinner(true);

        const url = `${apiPath.api_admin_kmedi_terms_remove}${checkItemsStr}`;

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
            accessorKey: "terms_sq",
            cell: (info) => (
                <input
                    type="checkbox"
                    name={`termsSq_${info.getValue()}`}
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
                        boardList &&
                        checkItems.length === boardList.length
                            ? true
                            : false
                    }
                />
            ),
            enableSorting: false,
        },

        columnHelper.accessor((row) => row.terms_type_cd, {
            id: "terms_type_cd",
            cell: (info) => info.getValue(),
            header: "구분",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.lang_cd, {
            id: "lang_cd",
            cell: (info) => info.getValue(),
            header: "언어",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.terms_desc, {
            id: "terms_desc",
            cell: (info) => info.getValue(),
            header: "내용",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.reg_dttm.split(" ")[0], {
            id: "reg_dttm",
            cell: (info) => info.getValue(),
            header: "등록일",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => (
                <Link
                    className="tablebtn"
                    onClick={() => detailBoard(row.terms_sq)}
                >
                    약관수정
                </Link>
            ),
            {
                id: "viewDetail",
                cell: (info) => info.getValue(),
                header: "약관수정",
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
            "5%",
            "5%",
            "*",
            "7%",
            "5%"
        ]

    return (
        <>
            <CommonListComponent
                templateTitle={"홈페이지 관리 - 약관 관리"}
                modalComponent={"KmediTermsModalMain"}
                modalWidth={"1400"}
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

export default KmediTermsMng;
