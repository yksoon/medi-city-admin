import React from 'react';
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import {CommonErrModule} from "common/js/Common";
import {useSetRecoilState} from "recoil";
import {isSpinnerAtom} from "recoils/atoms";
import {Link} from "react-router-dom";

const KmediBoardNoticeModalMain = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const handleModalClose = props.handleModalClose;
    const handleNeedUpdate = props.handleNeedUpdate;


    return (
        <>
            <table className="table_b inner_table">
                <colgroup>
                    <col width="20%"/>
                    <col width="*"/>
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
                    <>
                        <Link className="subbtn del" onClick={clickRemove}>
                            삭제
                        </Link>
                        <Link className="subbtn on" onClick={modTerms}>
                            수정
                        </Link>
                    </>
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

export default KmediBoardNoticeModalMain;
