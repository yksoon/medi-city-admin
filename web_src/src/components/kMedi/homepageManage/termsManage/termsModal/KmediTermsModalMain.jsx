import { CommonErrModule, CommonNotify, CommonRest } from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";

const langOption = [
    { value: "en", label: "영어" },
    { value: "id", label: "인도네시아어" },
];

const termsTypeOption = [
    { value: "100", label: "Terms and Conditions" },
    { value: "200", label: "Private Policy" },
];

const KmediTermsModalMain = (props) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const handleModalClose = props.handleModalClose;
    const handleNeedUpdate = props.handleNeedUpdate;

    // References
    const langCd = useRef(null);
    const termsTypeCd = useRef(null);
    const termsDesc = useRef(null);

    useEffect(() => {
        isModData && setDefaultValue();
    }, [langOption, termsTypeOption]);

    // 수정일 경우 기본 세팅
    const setDefaultValue = () => {
        langCd.current.value = modData.lang_cd;
        termsTypeCd.current.value = modData.terms_type_cd;
        termsDesc.current.value = modData.terms_desc;
    };

    // 등록
    const regTerms = () => {
        if (validation()) {
            setIsSpinner(true);

            // 약관 등록
            // mng/v1/kmedi/term
            // post
            const url = apiPath.api_admin_kmedi_terms_reg;

            const data = {
                // 언어구분
                // en : 영어
                // id : 인도네시아어
                lang_cd: langCd.current.value,

                // 약관 타입 구분
                // 100 : Terms and Conditions.
                // 200 : Private Policy
                terms_type_cd: termsTypeCd.current.value,

                // 약관내용
                terms_desc: termsDesc.current.value,
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

    // 수정
    const modTerms = () => {
        if (validation()) {
            setIsSpinner(true);

            // 약관 수정
            // mng/v1/kmedi/term
            // put
            const url = apiPath.api_admin_kmedi_terms_mod;

            const data = {
                terms_sq: modData.terms_sq,

                // 언어구분
                // en : 영어
                // id : 인도네시아어
                lang_cd: langCd.current.value,

                // 약관 타입 구분
                // 100 : Terms and Conditions.
                // 200 : Private Policy
                terms_type_cd: termsTypeCd.current.value,

                // 약관내용
                terms_desc: termsDesc.current.value,
            };

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
                        message: "수정이 완료 되었습니다",
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

    const validation = () => {
        if (!termsDesc.current.value) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "내용을 입력해 주세요",
            });

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
                        <th>언어</th>
                        <td>
                            <select id="langCd" className="w180" ref={langCd}>
                                {langOption.length !== 0 &&
                                    langOption.map((item, idx) => (
                                        <option
                                            key={`langOption_${item.value}`}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>약관 타입</th>
                        <td>
                            <select
                                id="langCd"
                                className="w180"
                                ref={termsTypeCd}
                            >
                                {termsTypeOption.length !== 0 &&
                                    termsTypeOption.map((item, idx) => (
                                        <option
                                            key={`termsTypeOption_${item.value}`}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>약관내용</th>
                        <td>
                            <textarea
                                className="hotel_info"
                                ref={termsDesc}
                            ></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="subbtn_box">
                {isModData ? (
                    <Link className="subbtn on" onClick={modTerms}>
                        수정
                    </Link>
                ) : (
                    <Link className="subbtn on" onClick={regTerms}>
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

export default KmediTermsModalMain;
