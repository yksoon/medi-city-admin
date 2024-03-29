import React, {useRef, useState} from 'react';
import SearchBar from "components/common/SearchBar";
import {flexRender} from "@tanstack/react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {Pagination} from "@mui/material";
import {CommonErrModule, CommonModal, CommonNotify} from "common/js/Common";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import {useSetRecoilState} from "recoil";
import {isSpinnerAtom} from "recoils/atoms";

const CommonListComponent = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();

    /**
     * props
     */
    const templateTitle = props.templateTitle ?? ""
    const modalComponent = props.modalComponent
    const modalWidth = props.modalWidth
    const modalTitle = props.modalTitle
    const setModalTitle = props.setModalTitle
    const boardList = props.boardList ?? []
    const pageInfo = props.pageInfo ?? {}
    const getBoardList = props.getBoardList
    const regBoard = props.regBoard
    const checkItems = props.checkItems
    const removeBoard = props.removeBoard
    const table = props.table
    const modData = props.modData
    const setModData = props.setModData
    const isOpen = props.isOpen
    const setIsOpen = props.setIsOpen
    const setPage = props.setPage
    const handleNeedUpdate = props.handleNeedUpdate
    const colWidth = props.colWidth

    const downloadExcel = props.downloadExcel
    const uploadExcel = props.uploadExcel

    const searchKeyword = useRef(null);

    // 검색
    const doSearch = () => {
        const keyword = searchKeyword.current.value;

        getBoardList(1, 10, keyword);
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

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getBoardList(value, 10, searchKeyword.current.value)

        setPage(value)
    };

    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>{templateTitle}</h3>
                </div>
                <div className="con_area">

                    {/*검색 바*/}
                    <SearchBar
                        searchKeyword={searchKeyword}
                        doSearch={doSearch}
                        regBoard={regBoard}
                        downloadExcel={downloadExcel}
                        uploadExcel={uploadExcel}
                        removeBoard={removeBoard}
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
                            <b>&nbsp; {pageInfo && pageInfo.total} &nbsp;</b> 건
                        </div>
                    )}
                    {/* 총 건수 END */}

                    <div className="adm_table">
                        <table className="table_a">
                            <colgroup>
                                {colWidth && colWidth.length !== 0 &&
                                    colWidth.map((item, idx) => (
                                        <col key={`${item}_${idx}`} width={item}/>
                                    ))}
                            </colgroup>
                            <thead>
                            {table.length !== 0 && table.getHeaderGroups().map((headerGroup) => (
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
                width={modalWidth}
                handleModalClose={handleModalClose}
                component={modalComponent}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
            />
        </>
    );
};

export default CommonListComponent;
