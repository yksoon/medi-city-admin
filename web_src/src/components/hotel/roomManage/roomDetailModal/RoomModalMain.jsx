import { Link } from "react-router-dom";
import RoomModalEssential from "./modalComponents/RoomModalEssential";
import RoomModalDetail from "./modalComponents/RoomModalDetail";
import RoomModalAdditional from "./modalComponents/RoomModalAdditional";
import { useRef, useState } from "react";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import { CommonErrModule, CommonNotify, CommonRest } from "common/js/Common";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { roomModel } from "models/hotel/room";
import { apiPath } from "webPath";
import { successCode } from "common/js/resultCode";
import RoomModalPrice from "./modalComponents/RoomModalPrice";

const RoomModalMain = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    // 부대시설 체크 리스트 state
    const [additionalCheckList, setAdditionalCheckList] = useState([]);

    // 객실 필수 부대시설 체크 리스트 state
    const [essentialAdditionalCheckList, setEssentialAdditionalCheckList] =
        useState([]);

    // 호텔선택 체크 리스트 state
    const [selectedHotel, setSelectedHotel] = useState(null);

    // 가격정보 리스트 state
    const [priceList, setPriceList] = useState([{ idx: 1, priceDiv: "000" }]);

    const handleNeedUpdate = props.handleNeedUpdate;

    // 객실 refs
    const roomRefs = {
        // Essential
        hotelIdx: useRef(null), // 호텔 idx
        nameKo: useRef(null), // 객실명(국문)
        nameEn: useRef(null), // 객실명(영문)
        roomNumber: useRef(null), // 객실번호
        attachmentOrgFile: useRef(null), // 객실이미지
        roomSize: useRef(null), // 객실크기
        minPeople: useRef(null), // 최소인원
        maxPeople: useRef(null), // 최대인원

        // Detail
        infoKo: useRef(null), // 객실 정보(국문)
        infoEn: useRef(null), // 객실 정보(영문)
        ruleKo: useRef(null), // 이용안내(국문)
        ruleEn: useRef(null), // 이용안내(영문)
    };

    // 부대시설 핸들러
    const handleAdditionalCheck = (list) => {
        setAdditionalCheckList(list);
    };

    // 필수정보 부대시설 핸들러
    const handleEssentialAdditionalCheck = (list) => {
        setEssentialAdditionalCheckList(list);
    };

    // 호텔선택 핸들러
    const handleSelectedhotel = (value) => {
        setSelectedHotel(value);
    };

    // 가격정보 핸들러
    const handlePriceList = (list) => {
        // console.log(list);
        setPriceList(list);
    };

    // 저장버튼
    const clickSave = () => {
        if (validation()) {
            setIsSpinner(true);

            const formData = new FormData();

            let data = {};

            let fileArr = [];
            let fileArrOrg = [];

            data = {
                ...roomModel,
                hotelIdx: selectedHotel,
                nameKo: roomRefs.nameKo.current.value,
                nameEn: roomRefs.nameEn.current.value,
                roomNumber: roomRefs.roomNumber.current.value,
                roomSize: roomRefs.roomSize.current.value,
                minPeople: roomRefs.minPeople.current.value,
                maxPeople: roomRefs.maxPeople.current.value,
                infoKo: roomRefs.infoKo.current.value,
                infoEn: roomRefs.infoEn.current.value,
                ruleKo: roomRefs.ruleKo.current.value,
                ruleEn: roomRefs.ruleEn.current.value,
            };

            // 기본 formData append
            for (const key in data) {
                formData.append(key, data[key]);
            }

            // 필수 additional + 부대시설 additional
            const willSendAdditionalList = [
                ...additionalCheckList,
                ...essentialAdditionalCheckList,
            ];

            // 부대시설 formData append
            willSendAdditionalList.forEach((item, idx) => {
                formData.append(
                    `additionalInfo[${idx}].additionalIdx`,
                    item.additionalIdx
                );
                formData.append(
                    `additionalInfo[${idx}].additionalMemo`,
                    item.additionalMemo
                );
            });

            // 객실 가격정보 formData append
            priceList.forEach((item, idx) => {
                formData.append(`priceInfo[${idx}].priceDiv`, item.priceDiv);
                formData.append(
                    `priceInfo[${idx}].originPrice`,
                    item.originPrice
                );
                formData.append(`priceInfo[${idx}].orgStart`, item.orgStart);
                formData.append(`priceInfo[${idx}].orgEnd`, item.orgEnd);
                formData.append(`priceInfo[${idx}].salePrice`, item.salePrice);
                formData.append(`priceInfo[${idx}].saleStart`, item.saleStart);
                formData.append(`priceInfo[${idx}].saleEnd`, item.saleEnd);
                formData.append(`priceInfo[${idx}].saleRate`, item.saleRate);
                formData.append(`priceInfo[${idx}].priceMemo`, item.priceMemo);
                formData.append(`priceInfo[${idx}].priceType`, item.priceType);
            });

            // 파일 formData append
            fileArrOrg = Array.from(roomRefs.attachmentOrgFile.current.files);
            let len2 = fileArrOrg.length;
            for (let i = 0; i < len2; i++) {
                formData.append("attachmentOrgFile", fileArrOrg[i]);
            }

            const restParams = {
                method: "post_multi",
                url: apiPath.api_admin_reg_room, // hotel/v1/meta/room
                data: formData,
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
                        message: "객실등록이 완료 되었습니다",
                        callback: () => pageUpdate(),
                    });
                } else if (result_code === successCode.duplicationRoom) {
                    // 중복일 경우
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.result_message_ko,
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
        }
    };

    // 수정버튼
    const clickMod = () => {
        if (validation()) {
            setIsSpinner(true);

            const formData = new FormData();

            let data = {};

            let fileArr = [];
            let fileArrOrg = [];

            data = {
                ...roomModel,
                hotelIdx: selectedHotel,
                roomIdx: modData.room_idx,
                nameKo: roomRefs.nameKo.current.value,
                nameEn: roomRefs.nameEn.current.value,
                roomNumber: roomRefs.roomNumber.current.value,
                roomSize: roomRefs.roomSize.current.value,
                minPeople: roomRefs.minPeople.current.value,
                maxPeople: roomRefs.maxPeople.current.value,
                infoKo: roomRefs.infoKo.current.value,
                infoEn: roomRefs.infoEn.current.value,
                ruleKo: roomRefs.ruleKo.current.value,
                ruleEn: roomRefs.ruleEn.current.value,
            };

            // 기본 formData append
            for (const key in data) {
                formData.append(key, data[key]);
            }

            // 필수 additional + 부대시설 additional
            const willSendAdditionalList = [
                ...additionalCheckList,
                ...essentialAdditionalCheckList,
            ];

            console.log(willSendAdditionalList);
            // 부대시설 formData append
            willSendAdditionalList.forEach((item, idx) => {
                formData.append(
                    `additionalInfo[${idx}].additionalIdx`,
                    item.additionalIdx
                );
                formData.append(
                    `additionalInfo[${idx}].additionalMemo`,
                    item.additionalMemo
                );
            });

            // 객실 가격정보 formData append
            priceList.forEach((item, idx) => {
                formData.append(`priceInfo[${idx}].priceDiv`, item.priceDiv);
                formData.append(
                    `priceInfo[${idx}].originPrice`,
                    item.originPrice
                );
                formData.append(`priceInfo[${idx}].orgStart`, item.orgStart);
                formData.append(`priceInfo[${idx}].orgEnd`, item.orgEnd);
                formData.append(`priceInfo[${idx}].salePrice`, item.salePrice);
                formData.append(`priceInfo[${idx}].saleStart`, item.saleStart);
                formData.append(`priceInfo[${idx}].saleEnd`, item.saleEnd);
                formData.append(`priceInfo[${idx}].saleRate`, item.saleRate);
                formData.append(`priceInfo[${idx}].priceMemo`, item.priceMemo);
                formData.append(`priceInfo[${idx}].priceType`, item.priceType);
            });

            // 파일 formData append
            fileArrOrg = Array.from(roomRefs.attachmentOrgFile.current.files);
            let len2 = fileArrOrg.length;
            for (let i = 0; i < len2; i++) {
                formData.append("attachmentOrgFile", fileArrOrg[i]);
            }

            const restParams = {
                method: "put_multi",
                url: apiPath.api_admin_mod_room, // hotel/v1/meta/room
                data: formData,
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
                        message: "객실수정이 완료 되었습니다",
                        callback: () => pageUpdate(),
                    });
                } else if (result_code === successCode.duplicationRoom) {
                    // 중복일 경우
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.result_message_ko,
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
        }
    };

    // 삭제 버튼
    const clickRemove = () => {
        CommonNotify({
            type: "confirm",
            hook: confirm,
            message: "해당 객실을 삭제하시겠습니까?",
            callback: () => doRemove(),
        });

        const doRemove = () => {
            setIsSpinner(true);

            // hotel/v1/meta/hotel/${hotel_idx}
            const url = apiPath.api_admin_remove_room + modData.room_idx;
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
    };

    const validation = () => {
        // 호텔 선택
        if (!selectedHotel) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "호텔을 선택 해주세요",
            });

            return false;
        }

        // 객실명(국문)
        if (!roomRefs.nameKo.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "객실명(국문)을 입력해주세요",
                callback: () => roomRefs.nameKo.current.focus(),
            });

            return false;
        }

        // 객실명(영문)
        if (!roomRefs.nameEn.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "객실명(영문)을 입력해주세요",
                callback: () => roomRefs.nameEn.current.focus(),
            });

            return false;
        }

        // 객실번호
        if (!roomRefs.roomNumber.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "객실번호를 입력해주세요",
                callback: () => roomRefs.roomNumber.current.focus(),
            });

            return false;
        }

        // 객실이미지
        if (!isModData) {
            if (roomRefs.attachmentOrgFile.current.files.length === 0) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "이미지를 선택 해주세요",
                    callback: () => roomRefs.attachmentOrgFile.current.focus(),
                });

                return false;
            }
        }

        // 객실크기
        if (!roomRefs.roomSize.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "객실 크기를 입력 해주세요",
                callback: () => roomRefs.roomSize.current.focus(),
            });

            return false;
        }

        // 최소인원
        if (!roomRefs.minPeople.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "최소인원을 입력 해주세요",
                callback: () => roomRefs.minPeople.current.focus(),
            });

            return false;
        }

        // 최대인원
        if (!roomRefs.maxPeople.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "최대인원을 입력 해주세요",
                callback: () => roomRefs.maxPeople.current.focus(),
            });

            return false;
        }

        // 인원 확인
        if (
            Number(roomRefs.minPeople.current.value) >
            Number(roomRefs.maxPeople.current.value)
        ) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "최소인원은 최대인원보다 많을 수 없습니다",
                callback: () => roomRefs.maxPeople.current.focus(),
            });

            return false;
        }

        // 침대 유형
        if (
            essentialAdditionalCheckList.filter(
                (e) => e.key_name === "BED_TYPE"
            ).length === 0
        ) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "침대 유형을 선택 해주세요",
            });
            return false;
        }

        // 침대 유무가 Y인 경우
        if (
            essentialAdditionalCheckList.filter((e) => e.key_name === "BED")[0]
                .additionalMemo === "Y"
        ) {
            // 침대 수 미입력 시
            if (
                essentialAdditionalCheckList.filter(
                    (e) => e.key_name === "BED_COUNT"
                ).length === 0
            ) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "침대 갯수를 입력해 주세요",
                });
                return false;
            }
        }

        // 추가 침대 유무가 Y인 경우
        if (
            essentialAdditionalCheckList.filter(
                (e) => e.key_name === "ADD_BED"
            )[0].additionalMemo === "Y"
        ) {
            // 추가 침대 유형 미선택 시
            if (
                essentialAdditionalCheckList.filter(
                    (e) => e.key_name === "ADD_BED_TYPE"
                ).length === 0
            ) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "추가 침대 유형을 선택 해주세요",
                });
                return false;
            }

            // 추가 침대 수 (유무가 Y일 경우)
            if (
                essentialAdditionalCheckList.filter(
                    (e) => e.key_name === "ADD_BED_COUNT"
                ).length === 0
            ) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "추가 침대 갯수를 입력해 주세요",
                });
                return false;
            }
        }

        // 타월 유무가 Y일 경우
        if (
            essentialAdditionalCheckList.filter(
                (e) => e.key_name === "TOWEL"
            )[0].additionalMemo === "Y"
        ) {
            // 타월 타입 미선택 시
            if (
                essentialAdditionalCheckList.filter(
                    (e) => e.key_name === "TOWEL_TYPE"
                ).length === 0
            ) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "타월 타입을 선택 해주세요",
                });
                return false;
            }

            // 타월 수 미입력 시
            if (
                essentialAdditionalCheckList.filter(
                    (e) => e.key_name === "TOWEL_COUNT"
                ).length === 0
            ) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "타월 제공 수를 입력 해주세요",
                });
                return false;
            }
        }

        // 생수 유무가 Y일 경우
        if (
            essentialAdditionalCheckList.filter(
                (e) => e.key_name === "WATER"
            )[0].additionalMemo === "Y"
        ) {
            // 생수 갯수 미 입력 시
            if (
                essentialAdditionalCheckList.filter(
                    (e) => e.key_name === "WATER_COUNT"
                ).length === 0
            ) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "생수 갯수를 입력 해주세요",
                });
                return false;
            }
        }

        // 슬리퍼 유무가 Y일 경우
        if (
            essentialAdditionalCheckList.filter(
                (e) => e.key_name === "SLIPPERS"
            )[0].additionalMemo === "Y"
        ) {
            // 생수 갯수 미 입력 시
            if (
                essentialAdditionalCheckList.filter(
                    (e) => e.key_name === "SLIPPERS_COUNT"
                ).length === 0
            ) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "슬리퍼 갯수를 입력 해주세요",
                });
                return false;
            }
        }

        // 가격정보
        if (priceList.length === 0) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "객실 가격을 입력 해주세요",
            });

            return false;
        } else {
            const priceListLength = priceList.length;

            for (let i = 0; i < priceListLength; i++) {
                if (!priceList[i].originPrice) {
                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: "객실 가격(원가)을 입력 해주세요",
                    });

                    return false;
                }

                if (!priceList[i].orgStart) {
                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: "객실 가격(원가기간-시작)을 입력 해주세요",
                    });
                    return false;
                }

                if (!priceList[i].orgEnd) {
                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: "객실 가격(원가기간-종료)을 입력 해주세요",
                    });
                    return false;
                }

                if (priceList[i].priceDiv !== "000") {
                    if (!priceList[i].salePrice) {
                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: "객실 가격(할인가)을 입력 해주세요",
                        });
                        return false;
                    }

                    if (!priceList[i].saleStart) {
                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: "객실 가격(할인가-시작)을 입력 해주세요",
                        });
                        return false;
                    }

                    if (!priceList[i].saleEnd) {
                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: "객실 가격(할인가-종료)을 입력 해주세요",
                        });
                        return false;
                    }

                    if (!priceList[i].saleRate) {
                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: "객실 가격(할인율)을 입력 해주세요",
                        });
                        return false;
                    }
                }
            }
        }

        return true;
    };

    return (
        <>
            {/* 객실 필수 정보 */}
            <RoomModalEssential
                handleSelectedhotel={handleSelectedhotel}
                modData={modData}
                ref={roomRefs}
                handleEssentialAdditionalCheck={handleEssentialAdditionalCheck}
                essentialAdditionalCheckList={essentialAdditionalCheckList}
            />

            {/* 객실 가격 정보 */}
            <RoomModalPrice
                priceList={priceList}
                handlePriceList={handlePriceList}
                modData={modData}
            />

            {/* 객실 상세 정보 */}
            <RoomModalDetail modData={modData} ref={roomRefs} />

            {/* 객실 부대시설 */}
            <RoomModalAdditional
                handleAdditionalCheck={handleAdditionalCheck}
                additionalCheckList={additionalCheckList}
                modData={modData}
            />

            <div className="subbtn_box modal_btn_footer_box">
                <Link
                    className="modal_btn subbtn off"
                    title="#hotelPreview"
                    // onClick={openPreview}
                >
                    미리보기
                </Link>
                {isModData ? (
                    <>
                        <Link className="subbtn del" onClick={clickRemove}>
                            삭제
                        </Link>
                        <Link className="subbtn on" onClick={clickMod}>
                            수정
                        </Link>
                    </>
                ) : (
                    <Link className="subbtn on" onClick={clickSave}>
                        저장
                    </Link>
                )}
                {/* <Link className="subbtn on" onClick={clickSave}>
                    저장
                </Link> */}
            </div>
        </>
    );
};

export default RoomModalMain;
