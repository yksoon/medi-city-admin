import React, { useEffect, useRef, useState } from "react";
import { Modal } from "@mui/material";
import { Link } from "react-router-dom";
import { CommonConsole } from "common/js/Common";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { pwPattern } from "common/js/Pattern";
import { set_alert, set_spinner } from "redux/actions/commonAction";
import { apiPath } from "webPath";
import { RestServer } from "common/js/Rest";

const RegUserModal = (props) => {
    // { isOpen, title, content, btn, handleModalClose }
    const dispatch = useDispatch();

    let modalOption = {
        isOpen: props.isOpen,
        title: props.title,
        content: props.content,
        handleModalClose: props.handleModalClose,
    };

    let modUserData = props.modUserData ? props.modUserData : null;

    const [selectCountryOptions, setSelectCountryOptions] = useState([]);
    const [selectUserRoleOptions, setSelectUserRoleOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [idStatus, setIdStatus] = useState(false);

    const countryBank = useSelector((state) => state.codes.countryBank);
    const codes = useSelector((state) => state.codes.codes);

    const selectUserRole = useRef(null);
    const inputID = useRef(null);
    const inputPW = useRef(null);
    const inputPWChk = useRef(null);
    const inputFirstNameKo = useRef(null);
    const inputLastNameKo = useRef(null);
    const inputFirstNameEn = useRef(null);
    const inputLastNameEn = useRef(null);
    const inputMobile1 = useRef(null);
    const inputMobile2 = useRef(null);
    const inputMobile3 = useRef(null);
    const inputLisenceNum = useRef(null);
    const inputOrganization = useRef(null);
    const inputDepartment = useRef(null);
    const inputSpecialized = useRef(null);

    useEffect(() => {
        selectboxCountry();

        selectboxUserRole();
    }, []);

    useEffect(() => {
        modUserData && setSelectedCountry(modUserData.inter_phone_number);
    }, [modUserData]);

    // 국가번호 SELECT 가공
    const selectboxCountry = () => {
        let options = [];
        const country = countryBank.filter(
            (e) => e.code_type === "COUNTRY_TYPE"
        );

        for (let i = 0; i < country.length; i++) {
            let newObj = {
                value: country[i].code_key,
                label: country[i].code_value,
            };

            options.push(newObj);
        }

        setSelectCountryOptions(options);
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

            options.push(newObj);
        }

        setSelectUserRoleOptions(options);
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

    // 회원등록
    const signupUser = () => {
        // dispatch(
        //     set_spinner({
        //         isLoading: true,
        //     })
        // );

        let signupData = {
            signup_type: "000",
            user_id: inputID.current.value,
            user_pwd: inputPW.current.value,
            user_name_first_ko: inputFirstNameKo.current.value,
            user_name_last_ko: inputLastNameKo.current.value,
            user_name_first_en: inputFirstNameEn.current.value,
            user_name_last_en: inputLastNameEn.current.value,
            inter_phone_number: selectedCountry,
            mobile1: inputMobile1.current.value,
            mobile2: inputMobile2.current.value,
            mobile3: inputMobile2.current.value,
            md_licenses_number: inputLisenceNum.current.value,
            organization_name_ko: inputOrganization.current.value,
            department_name_ko: inputDepartment.current.value,
            specialized_name_ko: inputSpecialized.current.value,
            user_role: selectUserRole.current.value,
        };

        if (checkValidation("signup")) {
            console.log(signupData);
        }
    };

    // 아이디 중복 체크
    const idDuplicateCheck = () => {
        // /user/_check
        // POST
        const user_chk_url = apiPath.api_user_check;
        let data = {
            signup_type: "000",
            user_id: `${inputID.current.value}`,
        };

        RestServer("post", user_chk_url, data)
            .then((response) => {
                let res = response;

                console.log(res);

                if (res.headers.result_code === "0000") {
                    // setIdStatus(true);
                } else if (res.headers.result_code === "1000") {
                    // setIdStatus(false);
                }
            })
            .catch((error) => {
                CommonConsole("log", error);
                CommonConsole("decLog", error);

                // setIdStatus(false);
            });
    };

    // 회원수정
    const modUser = () => {
        dispatch(
            set_spinner({
                isLoading: true,
            })
        );

        CommonConsole("log", modUserData);
        CommonConsole("log", selectedCountry);

        let modData = {
            signup_type: "000",
            user_idx: modUserData.user_idx,
            user_id: inputID.current.value,
            user_pwd: inputPW.current.value,
            user_name_first_ko: inputFirstNameKo.current.value,
            user_name_last_ko: inputLastNameKo.current.value,
            user_name_first_en: inputFirstNameEn.current.value,
            user_name_last_en: inputLastNameEn.current.value,
            inter_phone_number: selectedCountry,
            mobile1: inputMobile1.current.value,
            mobile2: inputMobile2.current.value,
            mobile3: inputMobile2.current.value,
            md_licenses_number: inputLisenceNum.current.value,
            organization_name_ko: inputOrganization.current.value,
            department_name_ko: inputDepartment.current.value,
            specialized_name_ko: inputSpecialized.current.value,
            user_role: selectUserRole.current.value,
        };

        if (checkValidation("mod")) {
            console.log(modData);

            // 수정
            // /v1/user
            // PUT
            const url = apiPath.api_admin_user_mod;
            const data = modData;

            RestServer("put", url, data)
                .then((response) => {
                    let res = response;

                    console.log(res);

                    // if (res.headers.result_code === "0000") {
                    //     setIdStatus(true);
                    // } else if (res.headers.result_code === "1000") {
                    //     setIdStatus(false);
                    // }
                })
                .catch((error) => {
                    CommonConsole("log", error);
                    CommonConsole("decLog", error);
                });
        }
    };

    // 검증 (signup/mod)
    const checkValidation = (type) => {
        // 등록
        if (type === "signup") {
            // 아이디
            if (!inputID.current.value) {
                dispatch(
                    set_alert({
                        isAlertOpen: true,
                        alertTitle: "아이디를 입력해주세요",
                        alertContent: "",
                    })
                );
                inputMobile2.current.focus();
                return false;
            }

            // 비밀번호 여부 확인
            if (!inputPW.current.value || !inputPWChk.current.value) {
                dispatch(
                    set_alert({
                        isAlertOpen: true,
                        alertTitle: "비밀번호를 입력해주세요",
                        alertContent: "",
                    })
                );

                inputPW.current.focus();

                return false;
            }

            // 비밀번호 패턴체크
            if (
                !pwPattern.test(inputPW.current.value) ||
                !pwPattern.test(inputPWChk.current.value)
            ) {
                dispatch(
                    set_alert({
                        isAlertOpen: true,
                        alertTitle:
                            "비밀번호는 특수문자, 문자, 숫자 포함 형태의 6~16자리로 입력해주세요",
                        alertContent: "",
                    })
                );

                inputPW.current.focus();

                return false;
            }

            // 비밀번호 일치 확인
            if (inputPW.current.value !== inputPWChk.current.value) {
                dispatch(
                    set_alert({
                        isAlertOpen: true,
                        alertTitle: "비밀번호가 일치하지 않습니다",
                        alertContent: "",
                    })
                );

                inputPW.current.focus();

                return false;
            }
        }
        // 등록 END

        // 국적
        if (!selectedCountry) {
            dispatch(
                set_alert({
                    isAlertOpen: true,
                    alertTitle: "국적을 선택해 주세요",
                    alertContent: "",
                })
            );
            return false;
        }

        // 휴대전화
        if (
            !inputMobile1.current.value ||
            !inputMobile2.current.value ||
            !inputMobile3.current.value
        ) {
            dispatch(
                set_alert({
                    isAlertOpen: true,
                    alertTitle: "휴대전화를 입력해주세요",
                    alertContent: "",
                })
            );
            inputMobile2.current.focus();
            return false;
        }

        // 성명
        if (!inputFirstNameKo.current.value || !inputLastNameKo.current.value) {
            dispatch(
                set_alert({
                    isAlertOpen: true,
                    alertTitle: "성명을 입력해주세요",
                    alertContent: "",
                })
            );
            inputFirstNameKo.current.focus();
            return false;
        }

        // 성명(영문)
        if (!inputFirstNameEn.current.value || !inputLastNameEn.current.value) {
            dispatch(
                set_alert({
                    isAlertOpen: true,
                    alertTitle: "성명을 입력해주세요",
                    alertContent: "",
                })
            );
            inputFirstNameEn.current.focus();
            return false;
        }

        return true;
    };

    return (
        <>
            <Modal
                open={modalOption.isOpen}
                onClose={modalOption.handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal_wrap" id="modal_wrap">
                    <div className="modal w800" id="modal">
                        <div className="mo_title">
                            <h3>{modalOption.title}</h3>
                        </div>

                        <table className="table_b inner_table">
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
                                            id=""
                                            className="w180"
                                            ref={selectUserRole}
                                            defaultValue={
                                                modUserData &&
                                                modUserData.user_role_cd
                                            }
                                        >
                                            {selectUserRoleOptions &&
                                                selectUserRoleOptions.map(
                                                    (item, idx) => (
                                                        <option
                                                            key={`selectUserRole_${idx}`}
                                                            value={item.value}
                                                        >
                                                            {item.label}
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        아이디 <span className="red">*</span>
                                    </th>
                                    <td>
                                        {modUserData ? (
                                            <input
                                                type="email"
                                                className="input hold w180"
                                                ref={inputID}
                                                defaultValue={
                                                    modUserData
                                                        ? modUserData.user_id
                                                        : ""
                                                }
                                                readOnly
                                            />
                                        ) : (
                                            <input
                                                type="email"
                                                className="input w180"
                                                ref={inputID}
                                                autoFocus
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        비밀번호 <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="password"
                                            className="input w180"
                                            ref={inputPW}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        비밀번호 확인{" "}
                                        <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="password"
                                            className="input w180"
                                            ref={inputPWChk}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        성명 (국문){" "}
                                        <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="name"
                                            className="input w120"
                                            placeholder="성"
                                            ref={inputFirstNameKo}
                                            defaultValue={
                                                modUserData
                                                    ? modUserData.user_name_first_ko
                                                    : ""
                                            }
                                        />
                                        <input
                                            type="name"
                                            className="input w120"
                                            placeholder="이름"
                                            ref={inputLastNameKo}
                                            defaultValue={
                                                modUserData
                                                    ? modUserData.user_name_last_ko
                                                    : ""
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        성명 (영문){" "}
                                        <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="name"
                                            className="input w120"
                                            placeholder="First name"
                                            defaultValue={
                                                modUserData
                                                    ? modUserData.user_name_first_en
                                                    : ""
                                            }
                                            ref={inputFirstNameEn}
                                        />
                                        <input
                                            type="name"
                                            className="input w120"
                                            placeholder="Last name"
                                            defaultValue={
                                                modUserData
                                                    ? modUserData.user_name_last_en
                                                    : ""
                                            }
                                            ref={inputLastNameEn}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>국적</th>
                                    <td>
                                        <Select
                                            className="select"
                                            options={selectCountryOptions}
                                            defaultValue={
                                                modUserData &&
                                                selectCountryOptions.find(
                                                    (e) =>
                                                        e.value ===
                                                        modUserData.inter_phone_number
                                                )
                                            }
                                            key={
                                                modUserData &&
                                                modUserData.inter_phone_number
                                            }
                                            styles={customStyles}
                                            onChange={(e) => {
                                                setSelectedCountry(e.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        휴대전화 <span className="red">*</span>
                                    </th>
                                    <td>
                                        <div id="phone_num" className="m0">
                                            <input
                                                type="tel"
                                                className="input w120"
                                                id="phone_num1"
                                                defaultValue="010"
                                                ref={inputMobile1}
                                                readOnly
                                            />
                                            <input
                                                type="tel"
                                                className="input w120"
                                                id="phone_num2"
                                                defaultValue={
                                                    modUserData
                                                        ? modUserData.mobile2
                                                        : ""
                                                }
                                                ref={inputMobile2}
                                            />
                                            <input
                                                type="tel"
                                                className="input w120"
                                                id="phone_num3"
                                                defaultValue={
                                                    modUserData
                                                        ? modUserData.mobile3
                                                        : ""
                                                }
                                                ref={inputMobile3}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>면허번호</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="input w180"
                                            ref={inputLisenceNum}
                                            defaultValue={
                                                modUserData
                                                    ? modUserData.md_licenses_number
                                                    : ""
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>소속 기관</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="input w180"
                                            ref={inputOrganization}
                                            defaultValue={
                                                modUserData
                                                    ? modUserData.organization_name_ko
                                                    : ""
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>전공과</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="input w180"
                                            ref={inputDepartment}
                                            defaultValue={
                                                modUserData
                                                    ? modUserData.department_name_ko
                                                    : ""
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>전공분야</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="input w180"
                                            ref={inputSpecialized}
                                            defaultValue={
                                                modUserData
                                                    ? modUserData.specialized_name_ko
                                                    : ""
                                            }
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="subbtn_box">
                            {modUserData ? (
                                <Link className="subbtn on" onClick={modUser}>
                                    수정
                                </Link>
                            ) : (
                                <Link
                                    className="subbtn on"
                                    onClick={signupUser}
                                >
                                    등록
                                </Link>
                            )}

                            <Link
                                className="subbtn off"
                                onClick={modalOption.handleModalClose}
                            >
                                취소
                            </Link>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RegUserModal;
