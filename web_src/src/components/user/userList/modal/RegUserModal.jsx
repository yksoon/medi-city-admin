import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CommonErrModule, CommonNotify, CommonRest } from "common/js/Common";
import Select from "react-select";
import { pwPattern } from "common/js/Pattern";
import { apiPath } from "webPath";
import useAlert from "hook/useAlert";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
    codesAtom,
    countryBankAtom,
    isSpinnerAtom,
    userInfoAtom,
} from "recoils/atoms";
import { successCode } from "common/js/resultCode";
import CountrySelect from "components/common/CountrySelect";

const RegUserModal = (props) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const modalOption = {
        isOpen: props.isOpen,
        title: props.title,
        content: props.content,
        handleModalClose: props.handleModalClose,
    };

    const modUserData = props.modUserData ? props.modUserData : null;

    const handleNeedUpdate = props.handleNeedUpdate;

    const [selectCountryOptions, setSelectCountryOptions] = useState([]);
    const [selectUserRoleOptions, setSelectUserRoleOptions] = useState([]);
    const [selectUserStatusOptions, setSelectUserStatusOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("82");
    const [idStatus, setIdStatus] = useState(false);

    const countryBank = useRecoilValue(countryBankAtom);
    const codes = useRecoilValue(codesAtom);
    const userInfo = useRecoilValue(userInfoAtom);

    // const countryBank = useSelector((state) => state.codes.countryBank);
    // const codes = useSelector((state) => state.codes.codes);
    // const userInfo = useSelector((state) => state.userInfo.userInfo);

    const selectUserRole = useRef(null);
    const selectUserStatus = useRef(null);
    const selectCountry = useRef(null);
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
    const inputEmail = useRef(null);
    const inputUserMemo = useRef(null);

    useEffect(() => {
        // 국가번호
        selectboxCountry();

        // 권한
        selectboxUserRole();

        // 상태
        selectboxUserStatus();
    }, []);

    useEffect(() => {
        // mod인경우
        if (modUserData) {
            getDefaultValue();
        }
    }, [selectCountryOptions]);

    // useEffect(() => {
    //     // mod인경우
    //     if (modUserData) {
    //         getDefaultValue();
    //     }
    // }, [modUserData]);

    // 수정일경우 디폴트 세팅
    const getDefaultValue = () => {
        inputID.current.value = modUserData.user_id;
        inputFirstNameKo.current.value = modUserData.user_name_first_ko;
        inputLastNameKo.current.value = modUserData.user_name_last_ko;
        inputFirstNameEn.current.value = modUserData.user_name_first_en;
        inputLastNameEn.current.value = modUserData.user_name_last_en;
        inputMobile1.current.value = modUserData.mobile1;
        inputMobile2.current.value = modUserData.mobile2;
        inputMobile3.current.value = modUserData.mobile3;
        inputOrganization.current.value = modUserData.organization_name_ko;
        inputDepartment.current.value = modUserData.department_name_ko;
        inputSpecialized.current.value = modUserData.specialized_name_ko;
        inputLisenceNum.current.value = modUserData.md_licenses_number;
        selectUserRole.current.value = modUserData.user_role_cd;
        selectUserStatus.current.value = modUserData.user_status_cd;
        inputEmail.current.value = modUserData.email;
        inputUserMemo.current.value = modUserData.user_memo;

        setSelectedCountry(modUserData.inter_phone_number);

        // console.log(selectCountry);
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
                label: country[i].code_value_ko,
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
                label: `${userRole[i].code_value_ko}(${userRole[i].code_value_en})`,
            };

            // 로그인유저가 시스템 관리자가 아닌경우 시스템관리자 빼고 담어
            if (userInfo.user_role_cd !== "000") {
                if (newObj.value !== "000") {
                    options.push(newObj);
                }
            } else {
                options.push(newObj);
            }
        }

        setSelectUserRoleOptions(options);
    };

    // 유저상태 SELECT 가공
    const selectboxUserStatus = () => {
        let options = [];
        const userStatus = codes.filter((e) => e.code_type === "USER_STATUS");

        for (let i = 0; i < userStatus.length; i++) {
            let newObj = {
                value: userStatus[i].code_key,
                label: `${userStatus[i].code_value_ko}(${userStatus[i].code_value_en})`,
            };

            options.push(newObj);
        }

        setSelectUserStatusOptions(options);
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

    // 수정, 등록 완료 로직
    const requestUserInfo = () => {
        // 리스트 새로고침
        handleNeedUpdate();

        // 모달 닫기
        modalOption.handleModalClose();
    };

    // 회원등록
    const signupUser = () => {
        if (checkValidation("signup")) {
            idDuplicateCheck();
        }
    };

    // 아이디 중복 체크
    const idDuplicateCheck = () => {
        setIsSpinner(true);

        // /user/_check
        // POST
        const user_chk_url = apiPath.api_user_check;
        let data = {
            signup_type: "000",
            user_id: `${inputID.current.value}`,
        };

        // 파라미터
        const restParams = {
            method: "post",
            url: user_chk_url,
            data: data,
            err: err,
            callback: (res) => responsLogic(res),
        };

        CommonRest(restParams);

        const responsLogic = (res) => {
            if (res.headers.result_code === successCode.success) {
                // setIdStatus(true);
                regUser();
            } else if (res.headers.result_code === successCode.duplication) {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                });

                // setIdStatus(false);
                console.log(res);
            }
        };
    };

    const regUser = () => {
        let signupData = {
            /**
             * signup_type
             * 000 : 일반(아이디+PW)
             * 100 : SNS(네이버)
             * 200 : SNS(카카오)
             * 300 : 관리자가 등록
             */
            signup_type: "300",
            ptn_yn : "N",
            user_id: inputID.current.value,
            user_pwd: inputPW.current.value,
            user_name_first_ko: inputFirstNameKo.current.value,
            user_name_last_ko: inputLastNameKo.current.value,
            user_name_first_en: inputFirstNameEn.current.value,
            user_name_last_en: inputLastNameEn.current.value,
            inter_phone_number: selectedCountry,
            mobile1: inputMobile1.current.value,
            mobile2: inputMobile2.current.value,
            mobile3: inputMobile3.current.value,
            md_licenses_number: inputLisenceNum.current.value,
            organization_name_ko: inputOrganization.current.value,
            department_name_ko: inputDepartment.current.value,
            specialized_name_ko: inputSpecialized.current.value,
            user_role: selectUserRole.current.value,
            user_status: selectUserStatus.current.value,
            email: inputEmail.current.value,
            user_memo: inputUserMemo.current.value,
        };

        // 등록
        // /v1/user
        // POST
        const url = apiPath.api_admin_user_reg;
        const data = signupData;

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
            if (res.headers.result_code === successCode.success) {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "회원 등록이 완료 되었습니다.",
                    callback: () => pageUpdate(),
                });
            } else {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                    callback: () => pageUpdate(),
                });
            }
        };
    };

    // 회원수정
    const modUser = () => {
        let modData = {
            signup_type: modUserData.signup_type_cd,
            ptn_yn : "N",
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
            mobile3: inputMobile3.current.value,
            md_licenses_number: inputLisenceNum.current.value,
            organization_name_ko: inputOrganization.current.value,
            department_name_ko: inputDepartment.current.value,
            specialized_name_ko: inputSpecialized.current.value,
            user_role: selectUserRole.current.value,
            user_status: selectUserStatus.current.value,
            email: inputEmail.current.value,
            user_memo: inputUserMemo.current.value,
        };

        if (checkValidation("mod")) {
            setIsSpinner(true);

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
                        message: "회원 정보 수정이 완료 되었습니다",
                        callback: () => pageUpdate(),
                    });
                } else {
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.result_message_ko,
                        callback: () => pageUpdate(),
                    });
                }
            };
        }
    };

    // 등록,수정 완료 로직
    const pageUpdate = () => {
        handleNeedUpdate();
        modalOption.handleModalClose();
    };

    // 검증 (signup/mod)
    const checkValidation = (type) => {
        // 등록
        if (type === "signup") {
            // 아이디
            if (!inputID.current.value) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "아이디를 입력해주세요",
                });

                inputMobile2.current.focus();
                return false;
            }

            // 비밀번호 여부 확인
            if (!inputPW.current.value || !inputPWChk.current.value) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "비밀번호를 입력해주세요",
                });

                inputPW.current.focus();
                return false;
            }

            // // 비밀번호 패턴체크
            // if (
            //     !pwPattern.test(inputPW.current.value) ||
            //     !pwPattern.test(inputPWChk.current.value)
            // ) {
            //     CommonNotify({
            //         type: "alert",
            //         hook: alert,
            //         message:
            //             "비밀번호는 특수문자, 문자, 숫자 포함 형태의 6~16자리로 입력해주세요",
            //     });
            //
            //     inputPW.current.focus();
            //     return false;
            // }

            // 비밀번호 일치 확인
            if (inputPW.current.value !== inputPWChk.current.value) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "비밀번호가 일치하지 않습니다",
                });

                inputPW.current.focus();
                return false;
            }
        }
        // 등록 END

        // 수정
        if (type === "mod") {
            // 비밀번호 여부 확인
            if (inputPW.current.value || inputPWChk.current.value) {
                // // 비밀번호 패턴체크
                // if (
                //     !pwPattern.test(inputPW.current.value) ||
                //     !pwPattern.test(inputPWChk.current.value)
                // ) {
                //     CommonNotify({
                //         type: "alert",
                //         hook: alert,
                //         message:
                //             "비밀번호는 특수문자, 문자, 숫자 포함 형태의 6~16자리로 입력해주세요",
                //     });
                //
                //     inputPW.current.focus();
                //     return false;
                // }

                // 비밀번호 일치 확인
                if (inputPW.current.value !== inputPWChk.current.value) {
                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: "비밀번호가 일치하지 않습니다",
                    });

                    inputPW.current.focus();
                    return false;
                }
            }
        }
        // 수정 END

        // 국적
        if (!selectedCountry) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "국적을 선택해 주세요",
            });

            return false;
        }

        // 휴대전화
        if (
            !inputMobile1.current.value ||
            !inputMobile2.current.value ||
            !inputMobile3.current.value
        ) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "휴대전화를 입력해주세요",
            });

            inputMobile2.current.focus();
            return false;
        }

        // 성명
        if (!inputFirstNameKo.current.value || !inputLastNameKo.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "성명을 입력해주세요",
            });
            inputFirstNameKo.current.focus();
            return false;
        }

        // 성명(영문)
        if (!inputFirstNameEn.current.value || !inputLastNameEn.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "성명을 입력해주세요",
            });
            inputFirstNameEn.current.focus();
            return false;
        }

        // 성명(영문)
        if (selectUserRole.current.value === "300" && !inputUserMemo.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "메모를 입력해주세요",
            });
            inputUserMemo.current.focus();
            return false;
        }

        return true;
    };

    return (
        <>
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
                                className="wp100"
                                ref={selectUserRole}
                            >
                                {selectUserRoleOptions &&
                                    selectUserRoleOptions.map((item, idx) => (
                                        <option
                                            key={`selectUserRole_${idx}`}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>상태</th>
                        <td>
                            <select
                                name=""
                                id=""
                                className="wp100"
                                ref={selectUserStatus}
                            >
                                {selectUserStatusOptions &&
                                    selectUserStatusOptions.map((item, idx) => (
                                        <option
                                            key={`selectUserStatus_${idx}`}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    ))}
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
                                    className="input hold w230"
                                    ref={inputID}
                                    readOnly
                                />
                            ) : (
                                <input
                                    type="email"
                                    className="input w230"
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
                                className="input w230"
                                ref={inputPW}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            비밀번호 확인 <span className="red">*</span>
                        </th>
                        <td>
                            <input
                                type="password"
                                className="input w230"
                                ref={inputPWChk}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            성명 (국문) <span className="red">*</span>
                        </th>
                        <td>
                            <input
                                type="name"
                                className="input w120"
                                placeholder="성"
                                ref={inputFirstNameKo}
                            />
                            <input
                                type="name"
                                className="input w120"
                                placeholder="이름"
                                ref={inputLastNameKo}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            성명 (영문) <span className="red">*</span>
                        </th>
                        <td>
                            <input
                                type="name"
                                className="input w120"
                                placeholder="First name"
                                ref={inputFirstNameEn}
                            />
                            <input
                                type="name"
                                className="input w120"
                                placeholder="Last name"
                                ref={inputLastNameEn}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>
                            <input
                                type="text"
                                className="input w230"
                                ref={inputEmail}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>국적</th>
                        <td>
                            <CountrySelect
                                onChange={(e, value) =>
                                    setSelectedCountry(value)
                                }
                                defaultValue={selectedCountry}
                                mode={"full"}
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
                                />{" "}-{" "}
                                <input
                                    type="tel"
                                    className="input w120"
                                    id="phone_num2"
                                    ref={inputMobile2}
                                />{" "}-{" "}
                                <input
                                    type="tel"
                                    className="input w120"
                                    id="phone_num3"
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
                                className="input wp100"
                                ref={inputLisenceNum}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>소속 기관</th>
                        <td>
                            <input
                                type="text"
                                className="input wp100"
                                ref={inputOrganization}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>전공과</th>
                        <td>
                            <input
                                type="text"
                                className="input wp100"
                                ref={inputDepartment}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>전공분야</th>
                        <td>
                            <input
                                type="text"
                                className="input wp100"
                                ref={inputSpecialized}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>관리자메모</th>
                        <td>
                            <textarea
                                className="input wp100"
                                ref={inputUserMemo}
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
                    <Link className="subbtn on" onClick={signupUser}>
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
        </>
    );
};

export default RegUserModal;
