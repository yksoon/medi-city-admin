import useAlert from "hook/useAlert";
import useConfirm from "hook/useConfirm";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { codesAtom, isSpinnerAtom } from "recoils/atoms";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { createElement, useEffect, useMemo, useRef, useState } from "react";
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
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import { apiPath } from "webPath";
import { successCode } from "common/js/resultCode";
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";

const managerCode = ["000", "100", "110", "120", "130", "140", "150"];

const KmediCreatorRegModalMain = (props) => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const codes = useRecoilValue(codesAtom);

    // 테이블 세팅
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();

    const [userList, setUserList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const [checkItems, setCheckItems] = useState([]);

    const [selectUserRoleOptions, setSelectUserRoleOptions] = useState([]);

    const handleNeedUpdate = props.handleNeedUpdate;

    useEffect(() => {
        selectboxUserRole();
        reqUserList(1, 10);
    }, []);

    // 유저 리스트
    const reqUserList = (pageNum, pageSize) => {
        setIsSpinner(true);

        // account/v1/user/infos
        // POST
        let url = apiPath.api_user_list;
        let data = {
            page_num: pageNum,
            page_size: pageSize,
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
            let result_code = res.headers.result_code;

            // 성공
            if (
                result_code === successCode.success ||
                result_code === successCode.noData
            ) {
                let result_info = res.data.result_info;
                let page_info = res.data.page_info;

                setUserList(result_info);
                setPageInfo(page_info);

                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    // 유저권한 SELECT 가공
    const selectboxUserRole = () => {
        let options = [];
        const userRole = codes.filter((e) => e.code_type === "USER_ROLE");

        for (let i = 0; i < userRole.length; i++) {
            let newObj = {
                value: userRole[i].code_key,
                label: userRole[i].code_value,
            };

            if (managerCode.indexOf(newObj.value) === -1) {
                options.push(newObj);
            }
        }

        setSelectUserRoleOptions(options);
    };

    // 체크박스 단일 선택
    const handleSingleCheck = (checked, row) => {
        console.log(checked, row);
        if (checked) {
            // 단일 선택 시 체크된 아이템을 배열에 추가
            setCheckItems((prev) => [...prev, row]);
        } else {
            // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
            setCheckItems(checkItems.filter((el) => el !== row));
        }
    };

    // 체크박스 전체 선택
    const handleAllCheck = (checked) => {
        if (checked) {
            // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
            const idArray = [];
            userList.forEach((el) => idArray.push(el.user_idx));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        reqUserList(value, 10);
    };

    // 셀렉트박스로 변경
    const modUserRoleSelect = (e, row) => {
        CommonNotify({
            type: "confirm",
            hook: confirm,
            message: `${row.user_name_ko} 님을 크리에이터로 변경하시겠습니까?`,
            callback: () => doModUser(),
        });

        const doModUser = () => {
            setIsSpinner(true);

            const modData = {
                signup_type: row.signup_type_cd,
                user_idx: row.user_idx,
                user_id: row.user_id,
                user_name_first_ko: row.user_name_first_ko,
                user_name_last_ko: row.user_name_last_ko,
                user_name_first_en: row.user_name_first_en,
                user_name_last_en: row.user_name_last_en,
                inter_phone_number: row.inter_phone_number,
                mobile1: row.mobile1,
                mobile2: row.mobile2,
                mobile3: row.mobile3,
                md_licenses_number: row.md_licenses_number ?? "",
                organization_name_ko: row.organization_name_ko ?? "",
                department_name_ko: row.department_name_ko ?? "",
                specialized_name_ko: row.specialized_name_ko ?? "",
                user_status: row.user_status_cd,
                user_role: e.target.value,
            };

            // 수정
            // /v1/user
            // PUT
            const url = apiPath.api_admin_user_mod;
            const data = modData;

            // 파라미터
            const restParams = {
                method: "put",
                url: url,
                data: data,
                err: err,
                callback: (res) => responsLogic(res),
            };

            CommonRest(restParams);

            const responsLogic = (res) => {
                if (res.headers.result_code === successCode.success) {
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: `${row.user_name_ko} 님이 크리에이터로 변경 되었습니다.`,
                        callback: () => refresh(),
                    });
                } else {
                    // 에러
                    CommonConsole("log", res);

                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: "잠시후 다시 시도해주세요",
                    });
                }
            };

            const refresh = () => {
                reqUserList(1, 10);
            };
        };
    };

    // 체크박스로 여러명 변경
    const regUser = () => {
        console.log(checkItems);
        const length = checkItems.length;

        CommonNotify({
            type: "confirm",
            hook: confirm,
            message: `${length} 명을 크리에이터로 변경하시겠습니까?`,
            callback: () => doModUser(),
        });

        const doModUser = () => {
            setIsSpinner(true);

            let checkCount = 0;

            for (let i = 0; i < length; i++) {
                const modData = {
                    signup_type: checkItems[i].signup_type_cd,
                    user_idx: checkItems[i].user_idx,
                    user_id: checkItems[i].user_id,
                    user_name_first_ko: checkItems[i].user_name_first_ko,
                    user_name_last_ko: checkItems[i].user_name_last_ko,
                    user_name_first_en: checkItems[i].user_name_first_en,
                    user_name_last_en: checkItems[i].user_name_last_en,
                    inter_phone_number: checkItems[i].inter_phone_number,
                    mobile1: checkItems[i].mobile1,
                    mobile2: checkItems[i].mobile2,
                    mobile3: checkItems[i].mobile3,
                    md_licenses_number: checkItems[i].md_licenses_number ?? "",
                    organization_name_ko:
                        checkItems[i].organization_name_ko ?? "",
                    department_name_ko: checkItems[i].department_name_ko ?? "",
                    specialized_name_ko:
                        checkItems[i].specialized_name_ko ?? "",
                    user_status: checkItems[i].user_status_cd,
                    user_role: "300", // 크리에이터
                };

                // 수정
                // /v1/user
                // PUT
                const url = apiPath.api_admin_user_mod;
                const data = modData;

                // console.log(url);
                // 파라미터
                const restParams = {
                    method: "put",
                    url: url,
                    data: data,
                    err: err,
                    callback: (res) => responsLogic(res),
                };
                CommonRest(restParams);
            }

            const responsLogic = (res) => {
                if (res.headers.result_code === successCode.success) {
                    checkCount++;

                    if (checkCount === length) {
                        setIsSpinner(false);

                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: `${checkCount} 명이 크리에이터로 변경 되었습니다.`,
                            callback: () => refresh(),
                        });

                        const refresh = () => {
                            setCheckItems([]);

                            reqUserList(1, 10);
                        };
                    }
                }
            };
        };
    };

    // const IndeterminateCheckbox = ({
    //     indeterminate,
    //     className = "",
    //     ...rest
    // }) => {
    //     const ref = useRef(null);
    //     const checkArr = useRef([]);

    //     useEffect(() => {
    //         if (typeof indeterminate === "boolean") {
    //             ref.current.indeterminate = !rest.checked && indeterminate;
    //         }

    //         if (!rest.disabled && rest.checked) {
    //             if (ref.current.checked) {
    //                 // setCheckItems((prev) => [...prev, ref.current.id]);
    //                 console.log(ref.current.id);

    //                 checkArr.current = [...checkArr.current, ref.current.id];
    //             } else {
    //                 console.log(ref.current.id);

    //                 checkArr.current = checkArr.current.filter(
    //                     (el) => el !== ref.current.id
    //                 );
    //                 // setCheckItems(
    //                 //     checkItems.filter((el) => el !== ref.current.id)
    //                 // );
    //             }
    //             console.log(checkArr.current);
    //         }
    //     }, [ref, indeterminate]);

    //     return createElement("input", {
    //         type: "checkbox",
    //         ref: ref,
    //         className: className + " cursor-pointer",
    //         ...rest,
    //     });
    // };
    // -------------------------------------------------------------------------------------------------------
    // ----------------------------------------- react table setting -----------------------------------------
    // -------------------------------------------------------------------------------------------------------

    // 컬럼 세팅
    const columns = useMemo(() => [
        columnHelper.accessor((row) => row.user_idx, {
            id: "user_idx",
            cell: ({ row }) =>
                createElement("input", {
                    type: "checkbox",
                    name: `userIdx_${row.original.user_idx}`,
                    id: row.original.user_idx,
                    value: row.original.user_idx,
                    className: "cursor-pointer",
                    onChange: (e) =>
                        handleSingleCheck(
                            e.target.checked,
                            // row.original.user_idx,
                            row.original
                        ),
                    checked: checkItems.includes(row.original) ? true : false,
                    disabled:
                        managerCode.indexOf(row.original.user_role_cd) !== -1
                            ? true
                            : false,
                }),
            header: "",
            enableSorting: false,
        }),

        columnHelper.accessor((row) => row.user_key, {
            id: "user_key",
            cell: (info) => info.getValue(),
            header: "고유번호",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) =>
                managerCode.indexOf(row.user_role_cd) === -1 ? (
                    <select
                        name=""
                        id=""
                        className="w100"
                        defaultValue={
                            selectUserRoleOptions.length !== 0 &&
                            row.user_role_cd
                        }
                        onChange={(e) => modUserRoleSelect(e, row)}
                    >
                        {selectUserRoleOptions.length !== 0 &&
                            selectUserRoleOptions.map((item, idx) => (
                                <option
                                    key={`selectUserRole_${idx}`}
                                    value={item.value}
                                    disabled={item.value !== "300"}
                                >
                                    {item.label}
                                </option>
                            ))}
                    </select>
                ) : (
                    row.user_role
                ),
            {
                id: "user_role",
                cell: (info) => info.getValue(),
                header: "구분",
                sortingFn: "alphanumericCaseSensitive",
            }
        ),

        columnHelper.accessor((row) => row.user_status, {
            id: "nation_type_cd",
            cell: (info) => info.getValue(),
            header: "상태",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.user_id, {
            id: "user_id",
            cell: (info) => info.getValue(),
            header: "아이디",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.user_name_ko, {
            id: "user_name_ko",
            cell: (info) => info.getValue(),
            header: "이름",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor(
            (row) => `${row.mobile1}-${row.mobile2}-${row.mobile3}`,
            {
                id: "mobile1",
                cell: (info) => info.getValue(),
                header: "연락처",
                enableSorting: false,
            }
        ),

        columnHelper.accessor((row) => row.organization_name_ko, {
            id: "organization_name_ko",
            cell: (info) => info.getValue(),
            header: "소속",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.department_name_ko, {
            id: "department_name_ko",
            cell: (info) => info.getValue(),
            header: "전공과",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.specialized_name_ko, {
            id: "specialized_name_ko",
            cell: (info) => info.getValue(),
            header: "전공분야",
            sortingFn: "alphanumericCaseSensitive",
        }),

        columnHelper.accessor((row) => row.reg_dttm.split(" ")[0], {
            id: "reg_dttm",
            cell: (info) => info.getValue(),
            header: "가입일",
            sortingFn: "alphanumericCaseSensitive",
        }),

        // columnHelper.accessor(
        //     (row) => (
        //         <Link
        //             className="tablebtn"
        //             onClick={() => modUser(row.user_idx)}
        //         >
        //             정보수정
        //         </Link>
        //     ),
        //     {
        //         id: "viewDetail",
        //         cell: (info) => info.getValue(),
        //         header: "정보수정",
        //         enableSorting: false,
        //     }
        // ),
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
                    <Link className="subbtn on" onClick={regUser}>
                        선택등록
                    </Link>{" "}
                </div>
            </div>
            <div className="adm_table">
                <table className="table_a">
                    <colgroup>
                        <col width="2%" />
                        <col width="5%" />
                        <col width="7%" />
                        <col width="7%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="8%" />
                        <col width="8%" />
                        <col width="8%" />
                        <col width="10%" />
                        {/* <col width="6%" /> */}
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
                                                        header.column.columnDef
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
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <>
                                <tr>
                                    <td colSpan="11" style={{ height: "55px" }}>
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
        </>
    );
};

export default KmediCreatorRegModalMain;
