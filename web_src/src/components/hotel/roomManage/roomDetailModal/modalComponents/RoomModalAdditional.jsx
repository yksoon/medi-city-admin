import { Popover } from "@mui/material";
import { CommonConsole, CommonErrModule, CommonRest } from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import { room_static } from "models/hotel/room";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";

const RoomModalAdditional = (props) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [additionalList, setAdditionalList] = useState([]);

    const additionalCheckList = props.additionalCheckList;
    const handleAdditionalCheck = props.handleAdditionalCheck;

    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    useEffect(() => {
        getAdditionalList(1, 1, 1);
    }, []);

    // 리스트 가져오기
    const getAdditionalList = (pageNum, pageSize, searchType) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_hotel_additionals_list;
        const data = {
            page_num: pageNum,
            page_size: pageSize,
            additional_type: room_static.additional_type, // additional_type : "100"
            search_type: searchType,
            show_yn: "Y",
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

            console.log(res);

            // 성공
            if (
                result_code === successCode.success ||
                result_code === successCode.noData
            ) {
                const result_info = res.data.result_info;

                setAdditionalList(result_info);

                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    const handlePopoverClose = () => {
        setIsPopoverOpen(false);
    };

    const handleClick = (e) => {
        setIsPopoverOpen(true);
        setAnchorEl(e.currentTarget);
    };

    return (
        <>
            <div className="hotel_box hotel_service">
                <h4 className="mo_subtitle">부대시설 설정</h4>
                <div className="hotel_service_wrap">
                    <ul className="hotel_service_list">
                        {additionalCheckList.length !== 0 &&
                            additionalCheckList.map((item, idx) => (
                                <li key={`additional_checked_${idx}`}>
                                    <img
                                        src={`img/additional/${item.key_name}.svg`}
                                        alt=""
                                    />
                                    {item.additional_name_ko}
                                </li>
                            ))}
                        <li
                            className="hotel_servie_plus"
                            aria-describedby="additional_plus"
                            onClick={(e) => {
                                handleClick(e);
                            }}
                        >
                            +
                        </li>
                        <CustomPopover
                            open={isPopoverOpen}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            additionalList={additionalList}
                            additionalCheckList={additionalCheckList}
                            handleAdditionalCheck={handleAdditionalCheck}
                        />
                    </ul>
                </div>
            </div>
        </>
    );
};

const CustomPopover = (props) => {
    const open = props.open;
    const anchorEl = props.anchorEl;
    const onClose = props.onClose;
    const anchorOrigin = props.anchorOrigin;
    const transformOrigin = props.transformOrigin;

    const additionalList = props.additionalList;

    const additionalCheckList = props.additionalCheckList;
    const handleAdditionalCheck = props.handleAdditionalCheck;

    // 체크 여부 확인
    const isChecked = (item) => {
        if (
            additionalCheckList.filter(
                (e) => e.additional_idx === item.additional_idx
            ).length !== 0
            // additionalCheckList.filter(
            //     (e) => e.additional_name_ko === item.additional_name_ko
            // ).length !== 0
        ) {
            return true;
        } else {
            return false;
        }
    };

    // 체크박스 핸들러
    const handleCheck = (e, item) => {
        let list = additionalCheckList;

        if (e.target.checked) {
            // console.log(item);
            let insertItem = item;

            const memoValue = document.getElementById(
                `additional_memo_${item.additional_idx}`
            ).value;

            // insertItem = { ...insertItem, additional_memo: memoValue };
            insertItem = {
                ...insertItem,
                additionalMemo: memoValue,
                additional_memo: memoValue,
                additionalIdx: item.additional_idx,
            };
            list = [...list, insertItem];

            handleAdditionalCheck(list);
        } else {
            list = list.filter((e) => e.additional_idx !== item.additional_idx);

            document.getElementById(
                `additional_memo_${item.additional_idx}`
            ).value = "";

            handleAdditionalCheck(list);
        }
    };

    const handleInput = (e, item) => {
        let list = additionalCheckList;

        const isChecked = document.getElementById(
            `chk_${item.additional_idx}`
        ).checked;

        if (isChecked) {
            let insertItem = list.filter(
                (e) => e.additional_idx === item.additional_idx
            );

            list = list.filter((e) => e.additional_idx !== item.additional_idx);

            insertItem = {
                ...insertItem[0],
                additionalMemo: e.target.value,
                additional_memo: e.target.value,
                additionalIdx: item.additional_idx,
            };
            // insertItem[0].additional_memo = e.target.value;
            // insertItem[0].additionalMemo = e.target.value;
            // insertItem[0].additionalIdx = item.additional_idx;

            list = [...list, insertItem];

            handleAdditionalCheck(list);
        }
    };

    // additional_memo 디폴트 세팅
    const inputDefault = (item) => {
        if (
            additionalCheckList.filter(
                (e) => e.additional_idx === item.additional_idx
            ).length !== 0
            // additionalCheckList.filter(
            //     (e) => e.additional_name_ko === item.additional_name_ko
            // ).length !== 0
        ) {
            return additionalCheckList.filter(
                (e) => e.additional_name_ko === item.additional_name_ko
            )[0].additional_memo;
        } else {
            return "";
        }
    };

    return (
        <Popover
            id="additional_plus"
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
        >
            {/* <div class="hotel_service_select_wrap view">
                <div class="hotel_service_select"> */}
            <div style={{ padding: "20px" }}>
                <ul className="hotel_service_list ">
                    {additionalList.length !== 0 &&
                        additionalList.map((item, idx) => (
                            <li key={`additional_list_${idx}`}>
                                <input
                                    type="checkbox"
                                    name="fitness"
                                    id={`chk_${item.additional_idx}`}
                                    // hidden={true}
                                    onChange={(e) => {
                                        handleCheck(e, item);
                                    }}
                                    checked={isChecked(item)}
                                />
                                <label htmlFor={`chk_${item.additional_idx}`}>
                                    <img
                                        src={`img/additional/${item.key_name}.svg`}
                                        alt=""
                                    />
                                    {item.additional_name_ko}
                                    <div className="hotel_pay_box">
                                        <input
                                            type="text"
                                            className="input"
                                            id={`additional_memo_${item.additional_idx}`}
                                            onChange={(e) => {
                                                handleInput(e, item);
                                            }}
                                            defaultValue={inputDefault(item)}
                                        />
                                    </div>
                                </label>
                            </li>
                        ))}
                </ul>
            </div>
            {/* <div class="subbtn_box">
                        <a
                            href="javascript:void(0);"
                            class="modal_btn subbtn off"
                            title="#hotelPreview"
                            onclick="modal_open(hotelPreview);"
                        >
                            취소
                        </a>
                        <a
                            href="javascript:alert('저장되었습니다.');"
                            class="subbtn on"
                        >
                            저장
                        </a>
                    </div> */}
            {/* </div>
            </div> */}
        </Popover>
    );
};

export default RoomModalAdditional;
