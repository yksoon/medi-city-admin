import React, { useEffect, useRef, useState } from "react";
import { Modal } from "@mui/material";
import $ from "jquery";
import { regHotelModel } from "models/hotel/hotel";
import { Link } from "react-router-dom";
import HotelDetailEssential from "./HotelDetailEssential";
import HotelDetailBasic from "./HotelDetailBasic";
import HotelDetailEtc from "./HotelDetailEtc";
import HotelDetailManager from "./HotelDetailManager";
import HotelDetailAdditional from "./HotelDetailAdditional";
import {
    CommonErrModule,
    CommonModalChild,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import useAlert from "hook/useAlert";
import { successCode } from "common/js/resultCode";

const HotelDetailModalMain = (props) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;

    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    // const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    // 홈페이지 노출여부 state
    const [homePageShowYn, setHomePageShowYn] = useState("Y");

    // 호텔등급 state
    const [grade, setGrade] = useState(0);

    // 국가코드 선택 state
    const [selectedCountry, setSelectedCountry] = useState("82");

    // 미리보기 데이터 state
    const [previewData, setPreviewData] = useState({
        previewImg: "",
    });

    // 부대시설 체크 리스트 state
    const [additionalCheckList, setAdditionalCheckList] = useState([]);

    // 부대시설 체크 리스트 state
    const [managerList, setManagerList] = useState([]);

    const handleNeedUpdate = props.handleNeedUpdate;

    useEffect(() => {
        console.log(modData);
    }, []);

    // 미리보기 닫기
    const handleModalClose = () => {
        setModalTitle("");
        setIsOpen(false);
    };

    // 미리보기 열기
    const openPreview = () => {
        setModalTitle("미리보기");
        setIsOpen(true);
    };

    // 국가코드 핸들러
    const handleSelectedCountry = (value) => {
        setSelectedCountry(value);
    };

    // 부대시설 핸들러
    const handleAdditionalCheck = (list) => {
        setAdditionalCheckList(list);
    };

    // 담당자 핸들러
    const handleManagerList = (list) => {
        setManagerList(list);
    };

    let hotelModel = { ...regHotelModel };

    let hotelRefs = {
        // Essential
        nationType: useRef(null),
        nameKo: useRef(null),
        nameEn: useRef(null),
        zipcode: useRef(null),
        addr1Ko: useRef(null),
        addr2Ko: useRef(null),
        addr1En: useRef(null),
        addr2En: useRef(null),
        latitude: useRef(null),
        longitude: useRef(null),
        phone1: useRef(null),
        phone2: useRef(null),
        phone3: useRef(null),
        nameKey: useRef(null),
        interPhoneNumber: useRef(null),
        attachmentThumbFile: useRef(null),
        attachmentOrgFile: useRef(null),
        codeName: useRef(null),

        // Basic
        hotelStatus: useRef(null),
        positionType: useRef(null),
        homePage: useRef(null),
        checkInTime: useRef(null),
        checkOutTime: useRef(null),

        // Etc
        infoKo: useRef(null),
        infoEn: useRef(null),
        ruleKo: useRef(null),
        ruleEn: useRef(null),
    };

    const handlePreviewImg = (imgUrl) => {
        setPreviewData({ ...previewData, previewImg: imgUrl });
    };

    const handlePreview = (preview) => {
        setPreviewData({ ...previewData, ...preview });
    };

    // Basic
    // 라디오 버튼 제어
    const handleRadioChange = (e) => {
        setHomePageShowYn(e.currentTarget.value);

        console.log(e.currentTarget.value);
    };

    // Basic
    // 등급 제어
    const handleStarChange = (length) => {
        setGrade(length);
    };

    // 저장
    const clickSave = () => {
        // if (validation()) {
        setIsSpinner(true);

        const formData = new FormData();

        let data = {};

        let fileArr = [];
        let fileArrOrg = [];

        data = {
            ...hotelModel,
            nationType: hotelRefs.nationType.current.value,
            nameKo: hotelRefs.nameKo.current.value,
            nameEn: hotelRefs.nameEn.current.value,
            addr1Ko: hotelRefs.addr1Ko.current.value,
            addr2Ko: hotelRefs.addr2Ko.current.value,
            addr1En: hotelRefs.addr1En.current.value,
            addr2En: hotelRefs.addr2En.current.value,
            latitude: hotelRefs.latitude.current.value,
            longitude: hotelRefs.longitude.current.value,
            hotelStatus: hotelRefs.hotelStatus.current.value,
            homePage: hotelRefs.homePage.current.value,
            homePageShowYn: hotelRefs.homePage.current.value
                ? homePageShowYn
                : "N",
            grade: grade,
            positionType: hotelRefs.positionType.current.value,
            checkInTime: hotelRefs.checkInTime.current.value,
            checkOutTime: hotelRefs.checkOutTime.current.value,
            phone1: hotelRefs.phone1.current.value,
            phone2: hotelRefs.phone2.current.value,
            phone3: hotelRefs.phone3.current.value,
            nameKey: hotelRefs.nameKey.current.value,
            interPhoneNumber: selectedCountry,
            zipcode: hotelRefs.zipcode.current.value,
            infoKo: hotelRefs.infoKo.current.value,
            infoEn: hotelRefs.infoEn.current.value,
            ruleKo: hotelRefs.ruleKo.current.value,
            ruleEn: hotelRefs.ruleEn.current.value,
            codeName: hotelRefs.codeName.current.value,
            // additionalInfo: additionalCheckList,
            // personInfo: managerList,
        };

        console.log(data);

        // 기본 formData append
        for (const key in data) {
            formData.append(key, data[key]);
        }

        additionalCheckList.forEach((item, idx) => {
            formData.append(
                `additionalInfo[${idx}].additionalIdx`,
                item.additionalIdx
            );
            formData.append(
                `additionalInfo[${idx}].additionalMemo`,
                item.additionalMemo
            );
        });

        managerList.forEach((item, idx) => {
            formData.append(`personInfo[${idx}].personName`, item.personName);
            formData.append(`personInfo[${idx}].position`, item.position);
            formData.append(`personInfo[${idx}].email`, item.email);
            formData.append(`personInfo[${idx}].phone`, item.phone);
            formData.append(`personInfo[${idx}].memo`, item.memo);
        });

        // // 부대시설 formData append
        // let additionalArr = [];
        // additionalArr = Array.from(additionalCheckList);
        // let addlen = additionalArr.length;
        // for (let i = 0; i < addlen; i++) {
        //     formData.append("additionalInfo", additionalArr[i]);
        // }

        // // 담당자 formData append
        // let personInfoArr = [];
        // personInfoArr = Array.from(additionalCheckList);
        // let personlen = personInfoArr.length;
        // for (let i = 0; i < personlen; i++) {
        //     formData.append("personInfo", personInfoArr[i]);
        // }

        // 파일 formData append
        fileArr = Array.from(hotelRefs.attachmentThumbFile.current.files);
        let len = fileArr.length;
        for (let i = 0; i < len; i++) {
            formData.append("attachmentThumbFile", fileArr[i]);
        }

        // 파일 formData append
        fileArrOrg = Array.from(hotelRefs.attachmentOrgFile.current.files);
        let len2 = fileArrOrg.length;
        for (let i = 0; i < len2; i++) {
            formData.append("attachmentOrgFile", fileArrOrg[i]);
        }

        // console.log(data);

        const restParams = {
            method: "post_multi",
            url: apiPath.api_admin_reg_hotel, // hotel/v1/meta/hotel
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
                    message: "호텔등록이 완료 되었습니다",
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
        // }
    };

    const validation = () => {
        // 호텔명 (국문)
        if (!hotelRefs.nameKo.current.value) {
            hotelRefs.nameKo.current.blur();
            regAlert({
                msg: "호텔명(국문)을 입력해주세요",
                ref: hotelRefs.nameKo,
            });
            return false;
        }

        // 호텔명 (영문)
        if (!hotelRefs.nameEn.current.value) {
            hotelRefs.nameEn.current.blur();
            regAlert({
                msg: "호텔명(영문)을 입력해주세요",
                ref: hotelRefs.nameEn,
            });
            return false;
        }

        // 고유번호
        if (!hotelRefs.nameKey.current.value) {
            hotelRefs.nameKey.current.blur();
            regAlert({
                msg: "고유번호를 입력해주세요",
                ref: hotelRefs.nameKey,
            });
            return false;
        }

        // 호텔약어
        if (!hotelRefs.codeName.current.value) {
            hotelRefs.codeName.current.blur();
            regAlert({
                msg: "호텔 약어를 입력해주세요",
                ref: hotelRefs.codeName,
            });
            return false;
        }

        // 썸네일 이미지
        if (!hotelRefs.attachmentThumbFile.current.value) {
            hotelRefs.attachmentThumbFile.current.blur();
            regAlert({
                msg: "썸네일 이미지를 선택해주세요",
                ref: hotelRefs.attachmentThumbFile,
            });
            return false;
        }

        // 호텔 이미지
        if (!hotelRefs.attachmentOrgFile.current.value) {
            hotelRefs.attachmentOrgFile.current.blur();
            regAlert({
                msg: "호텔 이미지를 선택해주세요",
                ref: hotelRefs.attachmentOrgFile,
            });
            return false;
        }

        // 우편번호
        if (!hotelRefs.zipcode.current.value) {
            hotelRefs.zipcode.current.blur();
            regAlert({
                msg: "주소를 입력해주세요",
                ref: hotelRefs.zipcode,
            });
            return false;
        }

        // 전화번호
        if (
            !hotelRefs.phone1.current.value ||
            !hotelRefs.phone2.current.value ||
            !hotelRefs.phone3.current.value
        ) {
            hotelRefs.phone1.current.blur();
            hotelRefs.phone2.current.blur();
            hotelRefs.phone3.current.blur();
            regAlert({
                msg: "전화번호를 입력해주세요",
                ref: hotelRefs.phone1,
            });
            return false;
        }

        return true;
    };

    // 알럿
    const regAlert = (params) => {
        CommonNotify({
            type: "alert",
            hook: alert,
            message: params.msg,
            callback: () => focusFunc(params.ref),
        });
    };

    // 포커스
    const focusFunc = (ref) => {
        ref.current.focus();
    };

    return (
        <>
            <HotelDetailEssential
                ref={hotelRefs}
                handlePreviewImg={handlePreviewImg}
                handlePreview={handlePreview}
                handleSelectedCountry={handleSelectedCountry}
                modData={modData}
            />

            <HotelDetailBasic
                ref={hotelRefs}
                handlePreview={handlePreview}
                handleRadioChange={handleRadioChange}
                homePageShowYn={homePageShowYn}
                handleStarChange={handleStarChange}
            />

            <HotelDetailEtc ref={hotelRefs} handlePreview={handlePreview} />

            <HotelDetailManager
                managerList={managerList}
                handleManagerList={handleManagerList}
            />

            <HotelDetailAdditional
                handleAdditionalCheck={handleAdditionalCheck}
                additionalCheckList={additionalCheckList}
            />

            <div className="subbtn_box modal_btn_footer_box">
                <Link
                    className="modal_btn subbtn off"
                    title="#hotelPreview"
                    onClick={openPreview}
                >
                    미리보기
                </Link>
                <Link className="subbtn on" onClick={clickSave}>
                    저장
                </Link>
            </div>

            <CommonModalChild
                isOpen={isOpen}
                title={modalTitle}
                width={"1600"}
                handleModalClose={handleModalClose}
                component={"HotelPreview"}
                previewData={previewData}
                // handleNeedUpdate={handleNeedUpdate}
            />
        </>
    );
};

export default HotelDetailModalMain;
