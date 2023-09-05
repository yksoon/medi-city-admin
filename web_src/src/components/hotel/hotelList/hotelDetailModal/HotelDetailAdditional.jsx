import { Popover } from "@mui/material";
import { CommonConsole, CommonErrModule, CommonRest } from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import $ from "jquery";

const HotelDetailAdditional = () => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [additionalList, setAdditionalList] = useState([]);

    useEffect(() => {
        getAdditionalList(0, 10);
    }, []);

    // 리스트 가져오기
    const getAdditionalList = (pageNum, pageSize) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_hotel_additionals_list;
        const data = {
            page_num: pageNum,
            page_size: pageSize,
            additional_type: "000",
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
                        <li>
                            <img src="img/additional/ADD_BED.svg" alt="" />
                            베드 추가 가능
                        </li>
                        <li>
                            <img src="img/additional/NO_SMOKING.svg" alt="" />
                            금연
                        </li>
                        <li>
                            <img src="img/additional/SAUNA.svg" alt="" />
                            사우나 있음
                        </li>
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
                                    hidden={true}
                                />
                                <label htmlFor={`chk_${item.additional_idx}`}>
                                    <img
                                        src={`img/additional/${item.key_name}.svg`}
                                        alt=""
                                    />
                                    {item.additional_name_ko}
                                    <div className="hotel_pay_box">
                                        <input type="text" className="input" />
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

export default HotelDetailAdditional;
