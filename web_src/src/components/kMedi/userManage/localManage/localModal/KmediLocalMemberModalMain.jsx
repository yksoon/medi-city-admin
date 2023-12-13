import { CommonErrModule, CommonNotify, CommonRest } from "common/js/Common";
import { numberPattern } from "common/js/Pattern";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import useConfirm from "hook/useConfirm";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { countryBankAtom, isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import CountrySelect from "components/common/CountrySelect";

const memberTypeCdOption = [
    { value: "100", label: "개인의사" },
    { value: "300", label: "영업사원" },
];
const KmediLocalMemberModalMain = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const handleModalClose = props.handleModalClose;
    const handleNeedUpdate = props.handleNeedUpdate;

    const countryBank = useRecoilValue(countryBankAtom);

    // References
    const memberId = useRef(null);
    const memberTypeCd = useRef(null);
    const memberNm = useRef(null);
    const memberPwd = useRef(null);
    const memberEmailAddr = useRef(null);
    const memberCompanyNm = useRef(null);
    const memberDeptNm = useRef(null);
    const selectCountry = useRef(null);

    const memberRewardHistoryTypeCd = useRef(null);
    const memberRewardHistoryAmt = useRef(null);
    const memberRewardHistoryDesc = useRef(null);

    const [selectCountryOptions, setSelectCountryOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("62");

    const [rewardInfo, setRewardInfo] = useState([]);
    const [totalReward, setTotalReward] = useState(0);

    useEffect(() => {
        // 국가번호
        setSelectboxCountry();
    }, []);

    useEffect(() => {
        // mod인경우
        if (isModData) {
            setDefaultValue();
        }
    }, [selectCountryOptions]);

    // 수정일 경우 기본 세팅
    const setDefaultValue = () => {
        memberId.current.value = modData.member_id;
        memberTypeCd.current.value = modData.member_type_cd;
        memberNm.current.value = modData.member_nm;
        memberEmailAddr.current.value = modData.member_email_addr;
        memberCompanyNm.current.value = modData.member_company_nm;
        memberDeptNm.current.value = modData.member_dept_nm;

        getReward()
    };

    // 국가번호 세팅
    const setSelectboxCountry = () => {
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

    const getReward = () => {
        setIsSpinner(true);

        // K-MEDI 회원 리워드 목록 (관리자)
        // mng/v1/kmedi/member-rewards
        // POST
        const url = apiPath.api_admin_kmedi_member_reward_list;

        const data = {
            page_num: 1,
            page_size: 10,
            member_sq: modData.member_sq
        }

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
            if (res.headers.result_code === successCode.success || res.headers.result_code === successCode.noData) {
                const result_info = res.data.result_info;

                setIsSpinner(false);

                setRewardInfo(result_info.reward_info)
                setTotalReward(result_info.total_amt)
            } else {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                });
            }
        };
    }

    // 등록
    const regUser = () => {
        if (validation()) {
            setIsSpinner(true);

            // 현지 회원 등록
            // mng/v1/kmedi/member
            // post
            const url = apiPath.api_admin_kmedi_member_reg;

            const data = {
                // 회원 아이디
                member_id: `+${selectedCountry}${memberId.current.value}`,

                // 회원타입 코드
                // 100 : 개인의사
                // 300 : 영업사원
                member_type_cd: memberTypeCd.current.value,

                // 회원 이름
                member_nm: memberNm.current.value,

                // 회원 비밀번호
                member_pwd: memberPwd.current.value,

                // 이메일
                member_email_addr: memberEmailAddr.current.value,

                // 기관명 (소속병원)
                member_company_nm: memberCompanyNm.current.value,

                // 소속명 (전공과)
                member_dept_nm: memberDeptNm.current.value,
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
                if (res.headers.result_code === successCode.success) {
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: "등록이 완료 되었습니다",
                        callback: () => handleNeedUpdate(),
                    });
                } else {
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.result_message_ko,
                    });
                }
            };
        }
    };

    // 강제 탈퇴 처리
    const clickRemove = () => {
        //선택여부 확인
        CommonNotify({
            type: "confirm",
            hook: confirm,
            message: "강제 탈퇴 처리 하시겠습니까?",
            callback: () => removeUser(),
        });
    };

    // 삭제 버튼
    const removeUser = async () => {
        setIsSpinner(true);

        const url = `${apiPath.api_admin_kmedi_member_remove}${modData.member_sq}`;

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
                    message: "강제 탈퇴 처리가 완료 되었습니다",
                    callback: () => handleNeedUpdate(),
                });
            } else {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "잠시 후 다시 시도해주세요",
                });
            }
        };
    };

    // 필수항목 체크
    const validation = () => {
        if (!memberTypeCd.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "회원 구분을 선택해 주세요",
            });

            return false;
        }

        if (!memberId.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "아이디를 입력해주세요",
            });

            return false;
        }

        if (!isModData) {
            if (!memberPwd.current.value) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "비밀번호를 입력해주세요",
                });

                return false;
            }
        }

        if (!memberNm.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "성명을 입력해주세요",
            });

            return false;
        }

        return true;
    };

    const doReward = () => {
        if (rewardValidation()) {
            setIsSpinner(true)

            // K-MEDI 회원 리워드 등록 (관리자)
            // mng/v1/kmedi/member-reward
            // POST
            const url = apiPath.api_admin_kmedi_member_reward_reg

            const data = {
                member_sq: modData.member_sq,
                member_reward_history_type_cd: memberRewardHistoryTypeCd.current.value,
                member_reward_history_amt: memberRewardHistoryAmt.current.value,
                member_reward_history_desc: memberRewardHistoryDesc.current.value,
            }

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
                if (result_code === successCode.success) {
                    setIsSpinner(false);

                    getReward()
                } else {
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.result_message_ko,
                    });
                }
            };
        }
    }

    const rewardValidation = () => {
        const noti = (ref, msg) => {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: msg,
                callback: () => focus(),
            });

            const focus = () => {
                ref.current.focus();
            };
        };

        if (!memberRewardHistoryTypeCd.current.value) {
            noti(memberRewardHistoryTypeCd, "지급/차감을 선택해주세요");

            return false;
        }

        if (!memberRewardHistoryAmt.current.value) {
            noti(memberRewardHistoryAmt, "수량을 입력해주세요");

            return false;
        }

        if (!memberRewardHistoryDesc.current.value) {
            noti(memberRewardHistoryDesc, "설명을 입력해주세요");

            return false;
        }

        return true
    }

    return (
        <>
            <table className="table_bb">
                <colgroup>
                    <col width="30%"/>
                    <col width="*"/>
                </colgroup>
                <tbody>
                <tr>
                    <th>
                        구분 <span className="red">*</span>
                    </th>
                    <td>
                        <select className="w180" ref={memberTypeCd} disabled={isModData}>
                            {memberTypeCdOption.length !== 0 &&
                                memberTypeCdOption.map((item) => (
                                    <option
                                        key={`member_type_cd_${item.value}`}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                        </select>
                    </td>
                </tr>
                {!isModData && (
                    <tr>
                        <th>
                            국적 <span className="red">*</span>
                        </th>
                        <td>
                            {/*<Select*/}
                            {/*    className="select"*/}
                            {/*    options={selectCountryOptions}*/}
                            {/*    defaultValue={*/}
                            {/*        isModData*/}
                            {/*            ? selectCountryOptions.find(*/}
                            {/*                (e) =>*/}
                            {/*                    e.value ===*/}
                            {/*                    modData.inter_phone_number*/}
                            {/*            )*/}
                            {/*            : selectCountryOptions.find(*/}
                            {/*                (e) => e.value === "62"*/}
                            {/*            )*/}
                            {/*    }*/}
                            {/*    key={*/}
                            {/*        isModData*/}
                            {/*            ? selectCountryOptions.find(*/}
                            {/*                (e) =>*/}
                            {/*                    e.value ===*/}
                            {/*                    modData.inter_phone_number*/}
                            {/*            )*/}
                            {/*            : selectCountryOptions.find(*/}
                            {/*                (e) => e.value === "62"*/}
                            {/*            )*/}
                            {/*    }*/}
                            {/*    styles={customStyles}*/}
                            {/*    onChange={(e) => {*/}
                            {/*        setSelectedCountry(e.value);*/}
                            {/*    }}*/}
                            {/*    ref={selectCountry}*/}
                            {/*/>*/}
                            <CountrySelect
                                onChange={(e, value) =>
                                    setSelectedCountry(value)
                                }
                                defaultValue={selectedCountry}
                                mode={"full"}
                            />
                        </td>
                    </tr>
                )}

                <tr>
                    <th>
                        아이디
                        <br/>
                        (전화번호) <span className="red">*</span>
                    </th>
                    <td>
                        <input
                            type="text"
                            className={`input wp100 ${isModData && "hold"}`}
                            placeholder="아이디 (전화번호)"
                            disabled={isModData && true}
                            // onChange={patternCheck}
                            onKeyDown={(evt) =>
                                // ["e", "E", "+", "-"].includes(evt.key) &&
                                !numberPattern.test(evt.key) &&
                                evt.preventDefault()
                            }
                            ref={memberId}
                            autoComplete="off"
                        ></input>
                    </td>
                </tr>
                {!isModData && (
                    <tr>
                        <th>
                            비밀번호 <span className="red">*</span>
                        </th>
                        <td>
                            <input
                                type="password"
                                className="input w180"
                                placeholder="비밀번호"
                                ref={memberPwd}
                                autoComplete="new-password"
                            />
                        </td>
                    </tr>
                )}
                <tr>
                    <th>
                        성명 <span className="red">*</span>
                    </th>
                    <td>
                        <input
                            type="text"
                            className="input w180"
                            placeholder="이름"
                            ref={memberNm}
                            disabled={isModData}
                        />
                    </td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>
                        <input
                            type="email"
                            className="input w180"
                            placeholder="이메일"
                            ref={memberEmailAddr}
                            disabled={isModData}
                        />
                    </td>
                </tr>

                {/* <tr>
                        <th>휴대전화</th>
                        <td>
                            <div id="phone_num" className="m0">
                                <input
                                    type="tel"
                                    className="input w120"
                                    id="phone_num1"
                                    value="010"
                                    readonly
                                />
                                <input
                                    type="tel"
                                    className="input w120"
                                    id="phone_num2"
                                />
                                <input
                                    type="tel"
                                    className="input w120"
                                    id="phone_num3"
                                />
                            </div>
                        </td>
                    </tr> */}
                <tr>
                    <th>소속병원</th>
                    <td>
                        <input
                            type="text"
                            className="input w180"
                            ref={memberCompanyNm}
                            disabled={isModData}
                        />
                    </td>
                </tr>
                <tr>
                    <th>전공과</th>
                    <td>
                        <input
                            type="text"
                            className="input w180"
                            ref={memberDeptNm}
                            disabled={isModData}
                        />
                    </td>
                </tr>
                </tbody>
            </table>

            {isModData && (
                <>
                    <h4 className="mo_subtitle">리워드 정보</h4>
                    <table className="table_bb">
                        <colgroup>
                            <col width="30%"/>
                            <col width="*"/>
                        </colgroup>
                        <tbody>
                        <tr>
                            <th>리워드 지급</th>
                            <td>
                                <select className="input w100" ref={memberRewardHistoryTypeCd}>
                                    <option value="">- 선택 -</option>
                                    <option value="100">지급</option>
                                    <option value="200">차감</option>
                                </select>
                                <input
                                    type="text"
                                    className="input w100"
                                    placeholder="수량"
                                    ref={memberRewardHistoryAmt}
                                />
                                <br/>
                                <input
                                    type="text"
                                    className="input w180"
                                    placeholder="설명"
                                    ref={memberRewardHistoryDesc}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>총 리워드</th>
                            <td>
                                {totalReward}
                            </td>
                        </tr>
                            {rewardInfo.length !== 0 && rewardInfo.map((item, idx) => (
                                <tr>
                                    {idx === 0 && (
                                        <th rowSpan={rewardInfo.length}>리워드 지급/차감 목록</th>
                                    )}
                                    <td>
                                        {item.member_reward_history_type_cd === "100" ? "+" : item.member_reward_history_type_cd === "200" ? "-" : ""}
                                        {" "}
                                        {item.member_reward_history_amt}
                                        {" : "}
                                        {item.member_reward_history_desc}
                                    </td>
                                </tr>
                                ))}
                        </tbody>
                    </table>
                </>
            )}

            {isModData && (
                <div className="subbtn_box">
                    <Link to="" className="subbtn on" onClick={doReward}>
                        리워드 적용
                    </Link>
                </div>
            )}

            <div className="subbtn_box">
                {isModData ? (
                    <>
                        <Link to="" className="subbtn del" onClick={clickRemove}>
                            강제탈퇴
                        </Link>
                        {/* <Link className="subbtn on" onClick={modUser}>
                            수정
                        </Link> */}
                    </>
                ) : (
                    <Link to="" className="subbtn on" onClick={regUser}>
                        등록
                    </Link>
                )}
                <Link to="" className="subbtn off" onClick={handleModalClose}>
                    취소
                </Link>
            </div>
        </>
    );
};

export default KmediLocalMemberModalMain;
