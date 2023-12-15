import { Link } from "react-router-dom";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import {CommonConsole, CommonErrModule, CommonNotify, CommonRest} from "common/js/Common";
import {useSetRecoilState} from "recoil";
import {isSpinnerAtom} from "recoils/atoms";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable} from "@tanstack/react-table";
import {apiPath} from "webPath";
import {successCode} from "common/js/resultCode";
import CommonListComponent from "components/common/CommonListComponent";
import {Checkbox} from "@mui/material";

const KmediBannerMng = (props) => {
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

    // 약관 상세 데이터
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

        const url = apiPath.api_admin_kmedi_banner_list;
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

    // 삭제 버튼
    const removeBoard = async () => {
        let checkItemsStr = checkItems.join();
        setIsSpinner(true);

        const url = `${apiPath.api_admin_kmedi_banner_remove}${checkItemsStr}`;

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

        const url = apiPath.api_admin_kmedi_banner_detail + idx;
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

    // // 컬럼 세팅
    const columns = useMemo(() => [
        {
            accessorKey: "banner_sq",
            cell: (info) => (
                <Checkbox
                    size="small"
                    name={`banner_sq_${info.getValue()}`}
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

        columnHelper.accessor(
            (row) => (
                <>
                    <img
                        loading="lazy"
                        src={
                            row.banner_image_url
                                ? row.banner_image_url
                                : "img/common/no_image.jpg"
                        }
                        alt=""
                        style={{ width: "100px" }}
                    />
                </>
            ),
            {
                id: "banner_image_url",
                cell: (info) => info.getValue(),
                header: "미리보기",
                enableSorting: false,
            },
        ),

        columnHelper.accessor((row) => row.banner_name, {
            id: "banner_name",
            cell: (info) => info.getValue(),
            header: "배너명",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.banner_desc, {
            id: "banner_desc",
            cell: (info) => info.getValue(),
            header: "내용",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => (
                <Link
                    to=""
                    className="tablebtn"
                    onClick={() => detailBoard(row.banner_sq)}
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
        "15%",
        "20%",
        "*",
        "5%"
    ]

    return (
        <>
            <CommonListComponent
                templateTitle={"홈페이지 관리 - 배너관리"}
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
                removeBoard={removeBoard}
                regBoard={regBoard}
                table={table}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                modalTitle={modalTitle}
                setModalTitle={setModalTitle}
                setPage={setPage}
                handleNeedUpdate={handleNeedUpdate}
                colWidth={colWidth}
                // downloadExcel={downloadExcel}
                // uploadExcel={uploadExcel}
            />
        </>
    );
};

export default KmediBannerMng;
