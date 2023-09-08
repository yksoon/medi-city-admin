import { forwardRef, useEffect } from "react";

const HotelDetailEtc = forwardRef((props, ref) => {
    const { infoKo, infoEn, ruleKo, ruleEn } = ref;

    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    useEffect(() => {
        // 수정일 경우 세팅
        isModData && setDefaultValue();
    }, []);

    // 수정일 경우 세팅
    const setDefaultValue = () => {
        infoKo.current.value = modData.info_ko;
        infoEn.current.value = modData.info_en;
        ruleKo.current.value = modData.rule_ko;
        ruleEn.current.value = modData.rule_en;
    };

    return (
        <>
            <div className="hotel_box">
                <h4 className="mo_subtitle">호텔 기타 정보</h4>
                <table className="table_bb">
                    <colgroup>
                        <col width="20%" />
                        <col width="*" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>소개(국문)</th>
                            <td>
                                <textarea
                                    name=""
                                    id="infoKo"
                                    ref={infoKo}
                                    className="hotel_info"
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>소개(영문)</th>
                            <td>
                                <textarea
                                    name=""
                                    id="infoEn"
                                    ref={infoEn}
                                    className="hotel_info"
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>규정(국문)</th>
                            <td>
                                <textarea
                                    name=""
                                    id="ruleKo"
                                    ref={ruleKo}
                                    className="hotel_info"
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>규정(영문)</th>
                            <td>
                                <textarea
                                    name=""
                                    id="ruleEn"
                                    ref={ruleEn}
                                    className="hotel_info"
                                ></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* <div className="subbtn_box">
                    <a
                        // href="javascript:alert('저장되었습니다.');"
                        className="subbtn on"
                    >
                        저장
                    </a>
                </div> */}
            </div>
        </>
    );
});

export default HotelDetailEtc;
