import { CommonErrModule, CommonNotify, CommonRest } from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import useConfirm from "hook/useConfirm";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";

const memberTypeCdOption = [
    { value: "100", label: "개인의사" },
    { value: "300", label: "영업사원" },
];
const KmediLocalUserModalMain = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const handleModalClose = props.handleModalClose;
    const handleNeedUpdate = props.handleNeedUpdate;

    // References
    const memberId = useRef(null);
    const memberTypeCd = useRef(null);
    const memberNm = useRef(null);
    const memberPwd = useRef(null);
    const memberEmailAddr = useRef(null);
    const memberCompanyNm = useRef(null);
    const memberDeptNm = useRef(null);

    useEffect(() => {
        isModData && setDefaultValue();
    }, []);

    // 수정일 경우 기본 세팅
    const setDefaultValue = () => {
        memberId.current.value = modData.member_id;
        memberTypeCd.current.value = modData.member_type_cd;
        memberNm.current.value = modData.member_nm;
        memberEmailAddr.current.value = modData.member_email_addr;
        memberCompanyNm.current.value = modData.member_company_nm;
        memberDeptNm.current.value = modData.member_dept_nm;
    };

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
                member_id: memberId.current.value,

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

    return (
        <>
            <table className="table_bb">
                <colgroup>
                    <col width="30%" />
                    <col width="*" />
                </colgroup>
                <tbody>
                    <tr>
                        <th>
                            구분 <span className="red">*</span>
                        </th>
                        <td>
                            <select className="w180" ref={memberTypeCd}>
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
                    <tr>
                        <th>
                            아이디 <span className="red">*</span>
                        </th>
                        <td>
                            <input
                                type="text"
                                className="input w180"
                                placeholder="아이디"
                                ref={memberId}
                            />
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
                                placeholder="비밀번호"
                                ref={memberPwd}
                            />
                        </td>
                    </tr>
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
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="subbtn_box">
                {isModData ? (
                    <>
                        <Link className="subbtn del" onClick={clickRemove}>
                            강제탈퇴
                        </Link>
                        {/* <Link className="subbtn on" onClick={modUser}>
                            수정
                        </Link> */}
                    </>
                ) : (
                    <Link className="subbtn on" onClick={regUser}>
                        등록
                    </Link>
                )}
                <Link className="subbtn off" onClick={handleModalClose}>
                    취소
                </Link>
            </div>
        </>
    );
};

export default KmediLocalUserModalMain;
