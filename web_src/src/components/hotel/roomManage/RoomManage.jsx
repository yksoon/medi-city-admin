import { Pagination } from "@mui/material";
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
import { room_static } from "models/hotel/room";
import {useEffect, useMemo, useRef, useState} from "react";
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
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchBar from "components/common/SearchBar";

const RoomManage = (props) => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    const [roomList, setRoomList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [page, setPage] = useState(1);

    // 체크박스
    const [checkItems, setCheckItems] = useState([]);

    // 테이블 세팅
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();

    // 객실 상세 데이터
    const [modData, setModData] = useState({});

    const searchKeyword = useRef(null);

    const isRefresh = props.isRefresh;

    useEffect(() => {
        getRoomList(page, 10, "");

        setModData({});
    }, [isNeedUpdate, isRefresh]);

    // 객실 리스트
    const getRoomList = (pageNum, pageSize, searchKeyword) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_room_list;
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

                setRoomList(result_info);
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

        getRoomList(1, 10, keyword);
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getRoomList(value, 10, searchKeyword.current.value);

        setPage(value)
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

    // 객실 신규 등록
    const regRoom = () => {
        setModalTitle("객실 신규 등록");
        setIsOpen(true);
    };

    // 객실 상세보기 모달
    const modRoom = () => {
        setModalTitle("객실 상세보기");
        setIsOpen(true);
    };

    // 상세보기
    const openDetail = (hotelIdx, roomIdx) => {
        setIsSpinner(true);

        const url = `${apiPath.api_admin_room_detail}${hotelIdx}/${roomIdx}`;
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
            const result_code = res.headers.result_code;

            // 성공
            if (
                result_code === successCode.success ||
                result_code === successCode.noData
            ) {
                const result_info = res.data.result_info;

                console.log("111111111", result_info);
                setModData(result_info);

                modRoom();
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
            roomList.forEach((el) => idArray.push(el.room_idx));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 회원 선택 삭제
    const clickRemove = () => {
        //선택여부 확인
        checkItems.length === 0
            ? CommonNotify({
                  type: "alert",
                  hook: alert,
                  message: "객실을 선택해주세요",
              })
            : CommonNotify({
                  type: "confirm",
                  hook: confirm,
                  message: "선택된 객실을 삭제 하시겠습니까?",
                  callback: () => removeRoom(),
              });
    };

    // 삭제 버튼
    const removeRoom = async () => {
        let checkItemsStr = checkItems.join();
        setIsSpinner(true);

        const url = `${apiPath.api_admin_remove_room}${checkItemsStr}`;

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
                    callback: () => pageUpdate(),
                });
            } else {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "잠시 후 다시 시도해주세요",
                });
            }

            const pageUpdate = () => {
                handleNeedUpdate();
            };
        };
    };

    const columns = useMemo(() => [
        {
            accessorKey: "room_idx",
            cell: (info) => (
                <input
                    type="checkbox"
                    name={`roomIdx_${info.getValue()}`}
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
                        roomList &&
                        checkItems.length === roomList.length
                            ? true
                            : false
                    }
                />
            ),
            enableSorting: false,
        },
        columnHelper.accessor((row) => row.hotel_name_ko, {
            id: "hotel_name_ko",
            cell: (info) => info.getValue(),
            header: "호텔명",
            sortingFn: "alphanumericCaseSensitive",
            sortDescFirst: true,
        }),

        {
            header: "객실명",
            columns: [
                columnHelper.accessor((row) => row.room_name_ko, {
                    id: "room_name_ko",
                    cell: (info) => info.getValue(),
                    header: "객실명(국문)",
                }),
                columnHelper.accessor((row) => row.room_name_en, {
                    id: "room_name_en",
                    cell: (info) => info.getValue(),
                    header: "객실명(영문)",
                }),
            ],
        },

        columnHelper.accessor((row) => row.room_size, {
            id: "room_size",
            cell: (info) => info.getValue(),
            header: "객실크기",
            sortingFn: "alphanumericCaseSensitive",
        }),
        columnHelper.accessor((row) => row.min_people, {
            id: "min_people",
            cell: (info) => info.getValue(),
            header: "최소인원",
            sortingFn: "alphanumericCaseSensitive",
        }),
        columnHelper.accessor((row) => row.max_people, {
            id: "max_people",
            cell: (info) => info.getValue(),
            header: "최대인원",
            sortingFn: "alphanumericCaseSensitive",
        }),
        columnHelper.accessor(
            (row) =>
                row.additional_info.filter((e) => e.key_name === "BED_TYPE")
                    .length !== 0 &&
                row.additional_info
                    .filter((e) => e.key_name === "BED_TYPE")[0]
                    .additional_memo.indexOf(",") === -1
                    ? room_static.bed_type[
                          row.additional_info.filter(
                              (e) => e.key_name === "BED_TYPE"
                          )[0].additional_memo
                      ]
                    : row.additional_info
                          .filter((e) => e.key_name === "BED_TYPE")[0]
                          .additional_memo.split(",")
                          .map((item) => room_static.bed_type[item])
                          .join(", "),
            {
                id: "BED_TYPE",
                cell: (info) => info.getValue(),
                header: "베드타입",
            }
        ),
        columnHelper.accessor(
            (row) =>
                row.additional_info.filter((e) => e.key_name === "BED_COUNT")
                    .length !== 0
                    ? row.additional_info.filter(
                          (e) => e.key_name === "BED_COUNT"
                      )[0].additional_memo + " 개"
                    : "0 개",
            {
                id: "BED_COUNT",
                cell: (info) => info.getValue(),
                header: "베드개수",
            }
        ),
        columnHelper.accessor(
            (row) => (
                <Link
                    className="tablebtn"
                    onClick={() => openDetail(row.hotel_idx, row.room_idx)}
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

    const data = useMemo(() => roomList, [roomList]);

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
                    <h3>객실 관리</h3>
                </div>
                <div className="con_area">
                    <div>

                        {/*검색 바*/}
                        <SearchBar
                            searchKeyword={searchKeyword}
                            doSearch={doSearch}
                            regBoard={regRoom}
                            downloadExcel={() => {}}
                            uploadExcel={() => {}}
                            clickRemove={clickRemove}
                        />
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
                                <b>
                                    &nbsp; {pageInfo && pageInfo.total} &nbsp;
                                </b>{" "}
                                건
                            </div>
                        )}
                        {/* 총 건수 END */}

                        {/* 테이블 start */}
                        <div className="adm_table">
                            <table className="table_a">
                                <colgroup>
                                    <col width="3%" />
                                    <col width="12%" />
                                    <col width="12%" />
                                    <col width="12%" />
                                    <col width="10%" />
                                    <col width="5%" />
                                    <col width="5%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                </colgroup>
                                <thead>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <th
                                                                key={header.id}
                                                                colSpan={
                                                                    header.colSpan
                                                                }
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
                                                                            header
                                                                                .column
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
                                                    }
                                                )}
                                            </tr>
                                        ))}
                                </thead>
                                <tbody>
                                    {roomList.length !== 0 ? (
                                        table.getRowModel().rows.map((row) => (
                                            <tr key={row.id}>
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <td key={cell.id}>
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="10"
                                                style={{ height: "55px" }}
                                            >
                                                <b>데이터가 없습니다.</b>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {roomList.length !== 0 && pageInfo && (
                            <div className="pagenation">
                                <Pagination
                                    count={pageInfo.pages}
                                    onChange={handleChange}
                                    shape="rounded"
                                    color="primary"
                                />
                            </div>
                        )}
                        {/* 테이블 end */}
                    </div>
                </div>
            </div>
            <CommonModal
                isOpen={isOpen}
                title={modalTitle}
                width={"1400"}
                handleModalClose={handleModalClose}
                component={"RoomModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
                // modUserData={modUserData}
            />
        </>
    );
};

export default RoomManage;
