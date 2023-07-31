import React, { useEffect, useRef, useState } from "react";
import { Modal } from "@mui/material";
import { Link } from "react-router-dom";
import { CommonErrorCatch, CommonNotify } from "common/js/Common";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { pwPattern } from "common/js/Pattern";
import { set_spinner } from "redux/actions/commonAction";
import { apiPath } from "webPath";
import { RestServer } from "common/js/Rest";
import useAlert from "hook/useAlert";

const RegUserModal = (props) => {
    // { isOpen, title, content, btn, handleModalClose }
    const dispatch = useDispatch();
    const { alert } = useAlert();

    let modalOption = {
        isOpen: props.isOpen,
        title: props.title,
        content: props.content,
        handleModalClose: props.handleModalClose,
    };

    let modUserData = props.modUserData ? props.modUserData : null;

    const handleNeedUpdate = props.handleNeedUpdate;

    const [selectCountryOptions, setSelectCountryOptions] = useState([]);
    const [selectUserRoleOptions, setSelectUserRoleOptions] = useState([]);
    const [selectUserStatusOptions, setSelectUserStatusOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("82");
    const [idStatus, setIdStatus] = useState(false);

    const countryBank = useSelector((state) => state.codes.countryBank);
    const codes = useSelector((state) => state.codes.codes);
    const userInfo = useSelector((state) => state.userInfo.userInfo);

    const selectUserRole = useRef(null);
    const selectUserStatus = useRef(null);
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
        // 국가번호
        selectboxCountry();

        // 권한
        selectboxUserRole();

        // 상태
        selectboxUserStatus();
    }, []);

    useEffect(() => {
        modUserData && setSelectedCountry(modUserData.interPhoneNumber);
    }, [modUserData]);

    // 국가번호 SELECT 가공
    const selectboxCountry = () => {
        let options = [];
        const country = countryBank.filter(
            (e) => e.codeType === "COUNTRY_TYPE"
        );

        for (let i = 0; i < country.length; i++) {
            let newObj = {
                value: country[i].codeKey,
                label: country[i].codeValue,
            };

            options.push(newObj);
        }

        setSelectCountryOptions(options);
    };

    // 유저권한 SELECT 가공
    const selectboxUserRole = () => {
        let options = [];
        const userRole = codes.filter((e) => e.codeType === "USER_ROLE");

        for (let i = 0; i < userRole.length; i++) {
            let newObj = {
                value: userRole[i].codeKey,
                label: userRole[i].codeValue,
            };

            // 로그인유저가 시스템 관리자가 아닌경우 시스템관리자 빼고 담어
            if (userInfo.userRoleCd !== "000") {
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
        const userStatus = codes.filter((e) => e.codeType === "USER_STATUS");

        for (let i = 0; i < userStatus.length; i++) {
            let newObj = {
                value: userStatus[i].codeKey,
                label: userStatus[i].codeValue,
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

    // 회원등록
    const signupUser = () => {
        if (checkValidation("signup")) {
            idDuplicateCheck();
        }
    };

    // 아이디 중복 체크
    const idDuplicateCheck = () => {
        dispatch(
            set_spinner({
                isLoading: true,
            })
        );

        // /user/_check
        // POST
        const user_chk_url = apiPath.api_user_check;
        let data = {
            signupType: "000",
            userId: `${inputID.current.value}`,
        };

        RestServer("post", user_chk_url, data)
            .then((response) => {
                let res = response;

                console.log(res);

                if (res.headers.resultCode === "0000") {
                    // setIdStatus(true);
                    console.log(res);

                    regUser();
                } else if (res.headers.resultCode === "1000") {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.resultMessageKo,
                    });

                    // setIdStatus(false);
                    console.log(res);
                }
            })
            .catch((error) => {
                CommonErrorCatch(error, dispatch, alert);
            });
    };

    const regUser = () => {
        let signupData = {
            signupType: "000",
            userId: inputID.current.value,
            userPwd: inputPW.current.value,
            userNameFirstKo: inputFirstNameKo.current.value,
            userNameLastKo: inputLastNameKo.current.value,
            userNameFirstEn: inputFirstNameEn.current.value,
            userNameLastEn: inputLastNameEn.current.value,
            interPhoneNumber: selectedCountry,
            mobile1: inputMobile1.current.value,
            mobile2: inputMobile2.current.value,
            mobile3: inputMobile3.current.value,
            mdLicensesNumber: inputLisenceNum.current.value,
            organizationNameKo: inputOrganization.current.value,
            departmentNameKo: inputDepartment.current.value,
            specializedNameKo: inputSpecialized.current.value,
            userRole: selectUserRole.current.value,
            userStatus: selectUserStatus.current.value,
        };

        // 등록
        // /v1/user
        // POST
        const url = apiPath.api_admin_user_reg;
        const data = signupData;

        RestServer("post", url, data)
            .then((response) => {
                let res = response;

                console.log(res);

                if (res.headers.resultCode === "0000") {
                    dispatch(
                        set_spinner({
                            isLoading: false,
                        })
                    );

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.resultMessageKo,
                    });

                    handleNeedUpdate();
                    modalOption.handleModalClose();
                }
            })
            .catch((error) => {
                CommonErrorCatch(error, dispatch, alert);
            });
    };

    // 회원수정
    const modUser = () => {
        let modData = {
            signupType: "000",
            userIdx: modUserData.userIdx,
            userId: inputID.current.value,
            userPwd: inputPW.current.value,
            userNameFirstKo: inputFirstNameKo.current.value,
            userNameLastKo: inputLastNameKo.current.value,
            userNameFirstEn: inputFirstNameEn.current.value,
            userNameLastEn: inputLastNameEn.current.value,
            interPhoneNumber: selectedCountry,
            mobile1: inputMobile1.current.value,
            mobile2: inputMobile2.current.value,
            mobile3: inputMobile3.current.value,
            mdLicensesNumber: inputLisenceNum.current.value,
            organizationNameKo: inputOrganization.current.value,
            departmentNameKo: inputDepartment.current.value,
            specializedNameKo: inputSpecialized.current.value,
            userRole: selectUserRole.current.value,
            userStatus: selectUserStatus.current.value,
        };

        if (checkValidation("mod")) {
            dispatch(
                set_spinner({
                    isLoading: true,
                })
            );

            // 수정
            // /v1/user
            // PUT
            const url = apiPath.api_admin_user_mod;
            const data = modData;

            console.log(data);
            RestServer("put", url, data)
                .then((response) => {
                    let res = response;

                    console.log(res);

                    if (res.headers.resultCode === "0000") {
                        dispatch(
                            set_spinner({
                                isLoading: false,
                            })
                        );

                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: res.headers.resultMessageKo,
                        });

                        handleNeedUpdate();
                        modalOption.handleModalClose();
                    } else {
                        dispatch(
                            set_spinner({
                                isLoading: false,
                            })
                        );

                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: "잠시후 다시 시도해주세요",
                        });

                        handleNeedUpdate();
                        modalOption.handleModalClose();
                    }
                })
                .catch((error) => {
                    CommonErrorCatch(error, dispatch, alert);
                });
        }
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

            // 비밀번호 패턴체크
            if (
                !pwPattern.test(inputPW.current.value) ||
                !pwPattern.test(inputPWChk.current.value)
            ) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message:
                        "비밀번호는 특수문자, 문자, 숫자 포함 형태의 6~16자리로 입력해주세요",
                });

                inputPW.current.focus();
                return false;
            }

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
                // 비밀번호 패턴체크
                if (
                    !pwPattern.test(inputPW.current.value) ||
                    !pwPattern.test(inputPWChk.current.value)
                ) {
                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message:
                            "비밀번호는 특수문자, 문자, 숫자 포함 형태의 6~16자리로 입력해주세요",
                    });

                    inputPW.current.focus();
                    return false;
                }

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
                        <div
                            className="modal_close"
                            onClick={modalOption.handleModalClose}
                        >
                            <img src="img/common/modal_close.png" alt="" />
                        </div>
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
                                                modUserData.userRoleCd
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
                                    <th>상태</th>
                                    <td>
                                        <select
                                            name=""
                                            id=""
                                            className="w180"
                                            ref={selectUserStatus}
                                            defaultValue={
                                                modUserData &&
                                                modUserData.userStatusCd
                                            }
                                        >
                                            {selectUserStatusOptions &&
                                                selectUserStatusOptions.map(
                                                    (item, idx) => (
                                                        <option
                                                            key={`selectUserStatus_${idx}`}
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
                                                        ? modUserData.userId
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
                                                    ? modUserData.userNameFirstKo
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
                                                    ? modUserData.userNameLastKo
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
                                                    ? modUserData.userNameFirstEn
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
                                                    ? modUserData.userNameLastEn
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
                                                modUserData
                                                    ? selectCountryOptions.find(
                                                          (e) =>
                                                              e.value ===
                                                              modUserData.interPhoneNumber
                                                      )
                                                    : selectCountryOptions.find(
                                                          (e) =>
                                                              e.value === "82"
                                                      )
                                            }
                                            key={
                                                modUserData
                                                    ? modUserData.interPhoneNumber
                                                    : "82"
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
                                                defaultValue={
                                                    modUserData
                                                        ? modUserData.mobile1
                                                        : "010"
                                                }
                                                ref={inputMobile1}
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
                                                    ? modUserData.mdLicensesNumber
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
                                                    ? modUserData.organizationNameKo
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
                                                    ? modUserData.departmentNameKo
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
                                                    ? modUserData.specializedNameKo
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
