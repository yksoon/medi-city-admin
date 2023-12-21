/*global kakao*/
import { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { Modal } from "@mui/material";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { CommonErrModule, CommonNotify } from "common/js/Common";
import useAlert from "hook/useAlert";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { codesAtom, countryBankAtom, isSpinnerAtom } from "recoils/atoms";
import Select from "react-select";
import { hotel_static } from "models/hotel/hotel";
import { apiPath } from "webPath";

const HotelDetailEssential = forwardRef((props, ref) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const codes = useRecoilValue(codesAtom);
    const countryBank = useRecoilValue(countryBankAtom);

    const [nationTypeState, setNationTypeState] = useState([]);
    const [selectCountryOptions, setSelectCountryOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isShowNation, setIsShowNation] = useState(false);

    const open = useDaumPostcodePopup();
    let geocoder = new kakao.maps.services.Geocoder();

    const handleSelectedCountry = props.handleSelectedCountry;

    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    // const [hotelEssentialState, setHotelEssentialState] = useState({
    //     ...regHotelEssential,
    // });

    const {
        zipcode,
        addr1Ko,
        addr2Ko,
        addr1En,
        addr2En,
        latitude,
        longitude,
        nationType,
        nameKo,
        nameEn,
        phone1,
        phone2,
        phone3,
        nameKey,
        interPhoneNumber,
        attachmentThumbFile,
        attachmentOrgFile,
        codeName,
    } = ref;
    const zipcode_en = useRef(null);

    useEffect(() => {
        // 국가번호
        selectboxCountry();
    }, [countryBank]);

    useEffect(() => {
        // 수정일 경우 세팅
        isModData && setDefaultValue();
    }, [nationTypeState]);

    // 수정일 경우 세팅
    const setDefaultValue = () => {
        nationType.current.value = modData.nation_type_cd;
        modData.nation_type_cd === hotel_static.NATION_TYPE.overseas &&
            setIsShowNation(true);

        nameKo.current.value = modData.name_ko;
        nameEn.current.value = modData.name_en;
        nameKey.current.value = modData.name_key;
        codeName.current.value = modData.code_name;
        zipcode.current.value = modData.zipcode;
        zipcode_en.current.value = modData.zipcode;
        addr1Ko.current.value = modData.addr1_ko;
        addr2Ko.current.value = modData.addr2_ko;
        addr1En.current.value = modData.addr1_en;
        addr2En.current.value = modData.addr2_en;
        phone1.current.value = modData.phone1;
        phone2.current.value = modData.phone2;
        phone3.current.value = modData.phone3;
        setSelectedCountry(
            selectCountryOptions.find(
                (e) => e.value === modData.inter_phone_number
            )
        );

        // 썸네일, 이미지 추가
        setDefaultSingle();
        setDefaultMulti();
    };

    // 수정일 시 썸네일 미리보기 추가
    const setDefaultSingle = () => {
        const thumbFileEnc = modData.attachment_file_info.filter(
            (e) => e.origin_type_cd === hotel_static.file_origin_type_cd.thumb
        );

        if (thumbFileEnc.length !== 0) {
            document.getElementById(
                "preview"
            ).src = `${apiPath.api_admin_hotel_list_thumb}${thumbFileEnc[0].file_path_enc}`;
        }
    };

    // 수정일 시 이미지들 미리보기 추가
    const setDefaultMulti = () => {
        const orgFileEnc = modData.attachment_file_info.filter(
            (e) => e.origin_type_cd === hotel_static.file_origin_type_cd.origin
        );

        if (orgFileEnc.length !== 0) {
            document.querySelector("#imageContainer").replaceChildren();

            orgFileEnc.forEach((e) => {
                let span = document.createElement("span");
                span.setAttribute("class", "hotel_img");

                let img = document.createElement("img");
                span.appendChild(img);

                img.setAttribute(
                    "src",
                    `${apiPath.api_admin_hotel_list_thumb}${e.file_path_enc}`
                );

                document.querySelector("#imageContainer").appendChild(span);
            });
        }
    };

    // 국가번호 SELECT 가공
    const selectboxCountry = () => {
        let options = [];
        const country = countryBank.filter(
            (e) => e.code_type === "INTER_PHONE_TYPE"
        );

        for (let i = 0; i < country.length; i++) {
            let newObj = {
                value: country[i].code_key,
                label: country[i].code_value,
            };

            options.push(newObj);
        }

        setSelectCountryOptions(options);

        // 기본
        const defaultObj = options.find((e) => e.value === "82");
        setSelectedCountry(defaultObj);
    };

    // 국적 SELECT 스타일
    const customStyles = {
        control: () => ({
            width: "inherit",
            height: "inherit",
            lineHeight: "28px",
        }),
        valueContainer: () => ({
            height: "28px",
            lineHeight: "28px",
            padding: "0",
            display: "block",
        }),
        indicatorsContainer: () => ({
            display: "none",
        }),
        input: () => ({
            height: "inherit",
            lineHeight: "28px",
            gridArea: "0",
            display: "block",
            position: "absolute",
            top: "0",
            width: "85%",
        }),
    };

    useEffect(() => {
        const nation = codes.filter((e) => e.code_type === "NATION_TYPE");
        setNationTypeState(nation);

        // console.log(nation);
    }, []);

    function isFileImage(file) {
        if (file) {
            for (let i = 0; i < file.length; i++) {
                return file[i] && file[i]["type"].split("/")[0] === "image";
            }
        }
    }

    // 이미지 업로드 시 미리보기
    const readURL = (input) => {
        if (isFileImage(input.files)) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("preview").src = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                document.getElementById("preview").src = "";
            }
        } else {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "이미지만 업로드 가능합니다.",
            });

            input.value = "";

            return false;
        }
    };

    // 이미지 업로드 시 미리보기 (멀티)
    const readURLMulti = (input) => {
        const maxFileCnt = 5; // 첨부파일 최대 개수

        // console.log("1111111", input.files);

        if (isFileImage(input.files)) {
            if (input.files.length > maxFileCnt) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "이미지는 5장까지 업로드 가능합니다.",
                });

                input.value = "";

                return false;
            } else {
                document.querySelector("#imageContainer").replaceChildren();

                let fileArr = [];
                let i = input.files.length - 1;
                for (let image of input.files) {
                    let span = document.createElement("span");
                    span.setAttribute("class", "hotel_img");

                    let img = document.createElement("img");
                    span.appendChild(img);

                    // let img = document.createElement("img");
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        img.setAttribute("src", e.target.result);

                        fileArr.push(e.target.result);
                    };
                    reader.readAsDataURL(input.files[i--]);
                    // document.querySelector("#imageContainer").appendChild(img);
                    document.querySelector("#imageContainer").appendChild(span);
                }

                // setHotel({
                //     essential: {
                //         ...hotel.essential,
                //         attachmentOrgFile: fileArr,
                //     },
                // });
            }
        } else {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "이미지만 업로드 가능합니다.",
            });

            input.value = "";

            return false;
        }
    };

    const handle = {
        // 버튼 클릭 이벤트
        openPost: () => {
            open({
                popupTitle: "medi-city.co.kr",
                // top: 400,
                // left: 500,
                onComplete: handle.selectAddress,
            });
        },

        // 주소 선택 이벤트
        selectAddress: (data) => {
            // console.log(data);
            // console.log(data.address);

            zipcode.current.value = data.zonecode;
            zipcode_en.current.value = data.zonecode;
            addr1Ko.current.value = data.address;
            addr1En.current.value = data.addressEnglish;

            // setHotel({
            //     essential: {
            //         ...hotel.essential,
            //         zipcode: data.zonecode,
            //         addr1Ko: data.address,
            //         addr1En: data.addressEnglish,
            //     },
            // });
            // dispatch(
            //     set_reg_hotel({
            //         ...regHotelEssential,
            //         zipcode: data.zonecode,
            //         addr1Ko: data.address,
            //         addr1En: data.addressEnglish,
            //     })
            // );

            geocoder.addressSearch(data.address, postCallback);
        },
    };

    // 위도 latitude
    // 경도 longitude
    const postCallback = (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            console.log(result);
            let res = result[0];

            latitude.current.value = res.x;
            longitude.current.value = res.y;
        }
    };

    // 국내 해외 구분에 따른 국가코드 노출 여부
    const handleIshowNation = (e) => {
        const val = e.target.value;

        // 해외 일 경우
        if (val === hotel_static.NATION_TYPE.overseas) {
            setIsShowNation(true);
        } else {
            setIsShowNation(false);
        }
    };

    return (
        <>
            <div className="hotel_box">
                <h4 className="mo_subtitle">호텔 필수 정보</h4>
                <table className="table_bb">
                    <colgroup>
                        <col width="20%" />
                        <col width="*" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>구분</th>
                            <td>
                                <select
                                    name=""
                                    id="nationType"
                                    className="w180"
                                    ref={nationType}
                                    onChange={(e) => {
                                        handleIshowNation(e);
                                    }}
                                    defaultValue="100"
                                >
                                    {nationTypeState.map((item, idx) => (
                                        <option
                                            value={item.code_key}
                                            key={`nationType_${idx}`}
                                        >
                                            {`${item.code_value_ko}(${item.code_value_en})`}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                호텔명(국문) <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="input w370"
                                    id="nameKo"
                                    ref={nameKo}
                                    // autoFocus
                                    autoComplete="off"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                호텔명(영문) <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="input w370"
                                    id="nameEn"
                                    ref={nameEn}
                                    autoComplete="off"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                고유번호 <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="input w180"
                                    id="nameKey"
                                    ref={nameKey}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                호텔약어 <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="input w180"
                                    id="codeName"
                                    ref={codeName}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                썸네일 이미지 <span className="red">*</span>
                            </th>
                            <td>
                                <div className="hotel_thumb_wrap">
                                    <span className="hotel_thumb">
                                        <img src="" alt="" id="preview" />
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    onChange={(e) => readURL(e.target)}
                                    accept="image/*"
                                    id="attachmentThumbFile"
                                    ref={attachmentThumbFile}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                호텔 이미지 <span className="red">*</span>
                                <br />
                                (최대 5개)
                            </th>
                            <td>
                                <div
                                    className="hotel_img_wrap"
                                    id="imageContainer"
                                >
                                    <span className="hotel_img"></span>{" "}
                                    <span className="hotel_img"></span>{" "}
                                    <span className="hotel_img"></span>{" "}
                                    <span className="hotel_img"></span>{" "}
                                    <span className="hotel_img"></span>{" "}
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => readURLMulti(e.target)}
                                    accept="image/*"
                                    id="attachmentOrgFile"
                                    ref={attachmentOrgFile}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                주소(국문) <span className="red">*</span>
                            </th>
                            <td className="hotel_add_wrap">
                                <div>
                                    {/* 우편번호 */}
                                    <input
                                        type="text"
                                        className="input w120 hold"
                                        id="zipcode"
                                        ref={zipcode}
                                        onClick={handle.openPost}
                                        readOnly
                                    />{" "}
                                    <Link
                                        className="tablebtn"
                                        onClick={handle.openPost}
                                    >
                                        우편번호찾기
                                    </Link>
                                </div>
                                <div>
                                    <input
                                        type="name"
                                        className="input w370 hold"
                                        id="addr1Ko"
                                        ref={addr1Ko}
                                        onClick={handle.openPost}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <input
                                        type="name"
                                        className="input w370"
                                        id="addr2Ko"
                                        ref={addr2Ko}
                                        placeholder="상세 주소 (선택사항)"
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                주소(영문) <span className="red">*</span>
                            </th>
                            <td className="hotel_add_wrap">
                                <div>
                                    <input
                                        type="text"
                                        className="input w120 hold"
                                        ref={zipcode_en}
                                        onClick={handle.openPost}
                                        readOnly
                                    />{" "}
                                    <Link
                                        className="tablebtn"
                                        onClick={handle.openPost}
                                    >
                                        우편번호찾기
                                    </Link>
                                </div>
                                <div>
                                    <input
                                        type="name"
                                        className="input w370 hold"
                                        onClick={handle.openPost}
                                        id="addr1En"
                                        ref={addr1En}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <input
                                        type="name"
                                        className="input w370"
                                        id="addr2En"
                                        ref={addr2En}
                                        placeholder="상세 주소 (선택사항)"
                                    />
                                </div>
                                {/* 위도, 경도 */}
                                <input type="hidden" ref={latitude} />
                                <input type="hidden" ref={longitude} />
                            </td>
                        </tr>
                        {isShowNation && (
                            <tr>
                                <th>국가코드</th>
                                <td>
                                    <Select
                                        className="select"
                                        id="interPhoneNumber"
                                        options={selectCountryOptions}
                                        // defaultValue={
                                        //     modUserData
                                        //         ? selectCountryOptions.find(
                                        //               (e) =>
                                        //                   e.value ===
                                        //                   modUserData.inter_phone_number
                                        //           )
                                        //         : selectCountryOptions.find(
                                        //               (e) => e.value === "82"
                                        //           )
                                        // }
                                        // defaultValue={selectCountryOptions.find(
                                        //     (e) => e.value === "82"
                                        // )}
                                        value={selectedCountry}
                                        // key={
                                        //     modUserData
                                        //         ? selectCountryOptions.find(
                                        //               (e) =>
                                        //                   e.value ===
                                        //                   modUserData.inter_phone_number
                                        //           )
                                        //         : selectCountryOptions.find(
                                        //               (e) => e.value === "82"
                                        //           )
                                        // }
                                        // key={selectCountryOptions.find(
                                        //     (e) => e.value === "82"
                                        // )}
                                        key={selectedCountry}
                                        styles={customStyles}
                                        onChange={(e) => {
                                            setSelectedCountry(
                                                selectCountryOptions.find(
                                                    (event) =>
                                                        event.value === e.value
                                                )
                                            );
                                            handleSelectedCountry(e.value);
                                        }}
                                        ref={interPhoneNumber}
                                    />
                                </td>
                            </tr>
                        )}
                        <tr>
                            <th>
                                전화번호 <span className="red">*</span>
                            </th>
                            <td>
                                <div id="phone_num" className="m0">
                                    <input
                                        type="tel"
                                        className="input w120"
                                        id="phone1"
                                        ref={phone1}
                                    />
                                    {` - `}
                                    <input
                                        type="tel"
                                        className="input w120"
                                        id="phone2"
                                        ref={phone2}
                                    />
                                    {` - `}
                                    <input
                                        type="tel"
                                        className="input w120"
                                        id="phone3"
                                        ref={phone3}
                                    />
                                </div>
                            </td>
                        </tr>
                        {/* <tr>
                            <th>전화번호 (해외)</th>
                            <td>
                                <div id="phone_num" className="m0">
                                    <select name="" id="" className="w100">
                                        <option defaultValue="">+82</option>
                                    </select>
                                    <input
                                        type="tel"
                                        className="input w100"
                                        id="inter_phone_num1"
                                        defaultValue="010"
                                        readOnly
                                    />
                                    <input
                                        type="tel"
                                        className="input w120"
                                        id="inter_phone_num2"
                                    />
                                    <input
                                        type="tel"
                                        className="input w120"
                                        id="inter_phone_num3"
                                    />
                                </div>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
                {/* <div className="subbtn_box">
                    <a
                        // href="javascript:alert('저장되었습니다.');"
                        className="subbtn off"
                    >
                        저장
                    </a>
                </div> */}
            </div>
        </>
    );
});

export default HotelDetailEssential;
