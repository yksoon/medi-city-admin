import { CommonConsole, CommonErrModule, CommonRest } from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import { useEffect, useMemo, useState } from "react";
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

const KmediTermsMng = (props) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [termsList, setTermsList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [checkItems, setCheckItems] = useState([]);

    // 테이블 세팅
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();

    const isRefresh = props.isRefresh;

    useEffect(() => {
        getTermsList(1, 10, "");
    }, [isRefresh]);

    const getTermsList = (pageNum, pageSize, searchKeyword) => {
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

                console.log(res);
                setTermsList(result_info);
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
            termsList.forEach((el) => idArray.push(el.terms_sq));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getTermsList(value, 10);
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
                        termsList &&
                        checkItems.length === termsList.length
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
                    // onClick={
                    //     () => modTerms(row.terms_sq)
                    // }
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

    const data = useMemo(() => termsList, [termsList]);

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
                    <h3>홈페이지 관리 - 약관 관리</h3>
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
                            <Link
                                className="subbtn del"
                                // onClick={clickRemove}
                            >
                                선택삭제
                            </Link>{" "}
                            <Link
                                className="subbtn on"
                                // onClick={regUser}
                            >
                                약관등록
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
                                <col width="*" />
                                <col width="7%" />
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
                                {termsList.length !== 0 ? (
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
        </>
    );
};

export default KmediTermsMng;
