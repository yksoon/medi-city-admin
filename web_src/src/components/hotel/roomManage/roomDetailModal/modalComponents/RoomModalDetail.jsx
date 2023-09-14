import { CommonErrModule } from "common/js/Common";
import useAlert from "hook/useAlert";
import { forwardRef } from "react";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";

const RoomModalDetail = forwardRef((props, ref) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const { infoKo, infoEn, ruleKo, ruleEn } = ref;

    return (
        <>
            <div className="hotel_box">
                <h4 className="mo_subtitle">객실 상세 정보</h4>
                <table className="table_bb">
                    <colgroup>
                        <col width="20%" />
                        <col width="*" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>객실정보 (국문)</th>
                            <td>
                                <textarea
                                    name=""
                                    id="infoKo"
                                    className="hotel_info"
                                    ref={infoKo}
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>객실정보 (영문)</th>
                            <td>
                                <textarea
                                    name=""
                                    id="infoEn"
                                    className="hotel_info"
                                    ref={infoEn}
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>이용안내 (국문)</th>
                            <td>
                                <textarea
                                    name=""
                                    id="ruleKo"
                                    className="hotel_info"
                                    ref={ruleKo}
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>이용안내 (영문)</th>
                            <td>
                                <textarea
                                    name=""
                                    id="ruleEn"
                                    className="hotel_info"
                                    ref={ruleEn}
                                ></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* <div className="subbtn_box"><a href="javascript:alert('저장되었습니다.');" className="subbtn off">저장</a></div> */}
            </div>
        </>
    );
});

export default RoomModalDetail;
