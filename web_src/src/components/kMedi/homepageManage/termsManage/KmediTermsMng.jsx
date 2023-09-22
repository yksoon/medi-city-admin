import {
    CommonConsole,
    CommonErrModule,
    CommonModal,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
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
import useConfirm from "hook/useConfirm";

const KmediTermsMng = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [termsList, setTermsList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [checkItems, setCheckItems] = useState([]);

    // 약관 상세 데이터
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
        getTermsList(1, 10, "");
    }, [isNeedUpdate, isRefresh]);

    // 리스트
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

                // console.log(res);
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

    // 약관 신규 등록 모달
    const regTerms = () => {
        setModalTitle("약관 신규 등록");
        setIsOpen(true);
    };

    // 약관 상세보기 모달
    const modTerms = () => {
        setModalTitle("약관 상세보기");
        setIsOpen(true);
    };

    // 약관 상세
    const detailTerms = (terms_sq) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_terms_detail + terms_sq;
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

                modTerms();

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

    // 약관 선택 삭제
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
                  callback: () => removeTerms(),
              });
    };

    // 삭제 버튼
    const removeTerms = async () => {
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
                    onClick={() => detailTerms(row.terms_sq)}
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
                            <Link className="subbtn del" onClick={clickRemove}>
                                선택삭제
                            </Link>{" "}
                            <Link className="subbtn on" onClick={regTerms}>
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
                            <b>&nbsp; {pageInfo && pageInfo.total} &nbsp;</b> 건
                        </div>
                    )}
                    {/* 총 건수 END */}

                    <div className="adm_table">
                        <table className="table_a">
                            <colgroup>
                                <col width="2%" />
                                <col width="5%" />
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
            <CommonModal
                isOpen={isOpen}
                title={modalTitle}
                width={"1400"}
                handleModalClose={handleModalClose}
                component={"KmediTermsModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
            />
        </>
    );
};

export default KmediTermsMng;
