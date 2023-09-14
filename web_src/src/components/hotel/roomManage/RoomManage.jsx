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
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Headers,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useTable } from "react-table";

const RoomManage = () => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    const [roomList, setRoomList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    // 체크박스
    const [checkItems, setCheckItems] = useState([]);

    // 테이블 세팅
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();

    // 객실 상세 데이터
    const [modData, setModData] = useState({});

    useEffect(() => {
        getRoomList(1, 10, "");
    }, [isNeedUpdate]);

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

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getRoomList(value, 10, "");
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

    // 호텔 신규 등록
    const regRoom = () => {
        setModalTitle("객실 신규 등록");
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

                // modHotel();
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

    const columns = useMemo(() => [
        {
            // TODO: 내일해
            // accessorKey: "room_idx",
            id: "room_idx",
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
        },
        columnHelper.accessor((row) => row.hotel_name_ko, {
            id: "hotel_name_ko",
            cell: (info) => info.getValue(),
            header: "호텔명",
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

        // columnHelper.accessor((row) => row.room_name_ko, {
        //     id: "room_name_ko",
        //     cell: (info) => <i>{info.getValue()}</i>,
        //     header: "객실명(국문)",
        // }),
        // columnHelper.accessor((row) => row.room_name_en, {
        //     id: "room_name_en",
        //     cell: (info) => <i>{info.getValue()}</i>,
        //     header: "객실명(영문)",
        // }),
        columnHelper.accessor((row) => row.room_size, {
            id: "room_size",
            cell: (info) => info.getValue(),
            header: "객실크기",
        }),
        columnHelper.accessor((row) => row.min_people, {
            id: "min_people",
            cell: (info) => info.getValue(),
            header: "최소인원",
        }),
        columnHelper.accessor((row) => row.max_people, {
            id: "max_people",
            cell: (info) => info.getValue(),
            header: "최대인원",
        }),
        columnHelper.accessor(
            (row) =>
                room_static.bed_type[
                    row.additional_info.filter(
                        (e) => e.key_name === "BED_TYPE"
                    )[0].additional_memo
                ],
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
                      )[0].additional_memo
                    : "0" + " 개",
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
        debugTable: true,
    });

    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>객실 관리</h3>
                </div>
                <div className="con_area">
                    <div>
                        <div className="adm_search">
                            <div>
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">이름</option>
                                    <option value="">소속</option>
                                </select>
                                <input type="text" className="input" />
                                <Link href="" className="subbtn off">
                                    검색
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="modal_btn subbtn on"
                                    title="#hotelInsert"
                                    onClick={(e) => regRoom()}
                                >
                                    객실신규등록
                                </Link>
                                <Link href="" className="subbtn on">
                                    엑셀 다운로드
                                </Link>
                                <Link href="" className="subbtn on">
                                    일괄 업로드
                                </Link>
                            </div>
                        </div>
                        {/* <div className="adm_table">
                            <table className="table_a">
                                <colgroup>
                                    <col width="3%" />
                                    <col width="12%" />
                                    <col width="12%" />
                                    <col width="12%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" />
                                        </th>
                                        <th>호텔명</th>
                                        <th colSpan="2">객실명</th>
                                        <th>객실크기</th>
                                        <th>최소/최대인원</th>
                                        <th>베드타입</th>
                                        <th>베드개수</th>
                                        <th>상세보기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roomList.length !== 0 ? (
                                        roomList.map((item, idx) => (
                                            <tr key={`room_list_${idx}`}>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                                <td>{item.hotel_name_ko}</td>
                                                <td>{item.room_name_ko}</td>
                                                <td>{item.room_name_en}</td>
                                                <td>{`${item.room_size} ㎡`}</td>
                                                <td>{`${item.min_people}/${item.max_people}`}</td>
                                                <td>
                                                    {item.additional_info &&
                                                        (item.additional_info
                                                            .filter(
                                                                (e) =>
                                                                    e.key_name ===
                                                                    "BED_TYPE"
                                                            )[0]
                                                            .additional_memo.indexOf(
                                                                ","
                                                            ) === -1
                                                            ? room_static
                                                                  .bed_type[
                                                                  item.additional_info.filter(
                                                                      (e) =>
                                                                          e.key_name ===
                                                                          "BED_TYPE"
                                                                  )[0]
                                                                      .additional_memo
                                                              ]
                                                            : item.additional_info
                                                                  .filter(
                                                                      (e) =>
                                                                          e.key_name ===
                                                                          "BED_TYPE"
                                                                  )[0]
                                                                  .additional_memo.split(
                                                                      ","
                                                                  )
                                                                  .map(
                                                                      (item) =>
                                                                          room_static
                                                                              .bed_type[
                                                                              item
                                                                          ]
                                                                  )
                                                                  .join(", "))}
                                                </td>
                                                <td>
                                                    {item.additional_info &&
                                                    item.additional_info.filter(
                                                        (e) =>
                                                            e.key_name ===
                                                            "BED_COUNT"
                                                    ).length !== 0
                                                        ? item.additional_info.filter(
                                                              (e) =>
                                                                  e.key_name ===
                                                                  "BED_COUNT"
                                                          )[0].additional_memo
                                                        : "0"}{" "}
                                                    개
                                                </td>
                                                <td>
                                                    <Link
                                                        className="tablebtn"
                                                        onClick={() =>
                                                            openDetail(
                                                                item.room_idx
                                                            )
                                                        }
                                                    >
                                                        상세보기
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                style={{ height: "55px" }}
                                            >
                                                <b>데이터가 없습니다.</b>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {pageInfo && (
                            <div className="pagenation">
                                <Pagination
                                    count={pageInfo.pages}
                                    onChange={handleChange}
                                    shape="rounded"
                                    color="primary"
                                />
                            </div>
                        )} */}

                        {/* 테이블 테스트 */}
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
                                                                                    ? "cursor-pointer select-none"
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
                                                                        {{
                                                                            asc: " 🔼",
                                                                            desc: " 🔽",
                                                                        }[
                                                                            header.column.getIsSorted()
                                                                        ] ??
                                                                            null}
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
                        {/* 테이블 테스트 */}
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
