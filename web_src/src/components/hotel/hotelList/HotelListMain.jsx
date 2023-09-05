import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CommonConsole,
    CommonErrModule,
    CommonModal,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import { successCode } from "common/js/resultCode";
import { hotel_static } from "models/hotel/hotel";
import { Pagination } from "@mui/material";

const HotelListMain = () => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    const [hotelList, setHotelList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    useEffect(() => {
        getHotelList(1, 10, "");
    }, [isNeedUpdate]);

    // 호텔 신규 등록
    const regHotel = () => {
        setModalTitle("호텔 신규 등록");
        setIsOpen(true);
    };

    // 모달창 닫기
    const handleModalClose = () => {
        CommonNotify({
            type: "confirm",
            hook: confirm,
            message: "입력된 정보가 초기화 됩니다. 창을 닫으시겠습니까?",
            callback: () => close(),
        });

        const close = () => {
            setModalTitle("");
            setIsOpen(false);
        };
    };

    // 리스트 새로고침
    const handleNeedUpdate = () => {
        setModalTitle("");
        setIsOpen(false);
        setIsNeedUpdate(!isNeedUpdate);
    };

    // 리스트 가져오기
    const getHotelList = (pageNum, pageSize, searchKeyword) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_hotel_list;
        const data = {
            page_num: pageNum,
            page_size: pageSize,
            search_keyword: searchKeyword,
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
            const result_code = res.headers.result_code;

            // 성공
            if (
                result_code === successCode.success ||
                result_code === successCode.noData
            ) {
                const result_info = res.data.result_info;
                const page_info = res.data.page_info;

                setHotelList(result_info);
                setPageInfo(page_info);

                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getHotelList(value, 10, "");
    };

    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>호텔 리스트</h3>
                </div>
                <div className="con_area">
                    <div>
                        <div className="adm_search">
                            <div>
                                {/* <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">이름</option>
                                    <option value="">소속</option>
                                </select>{" "} */}
                                <input type="text" className="input" />
                                <Link href="" className="subbtn off">
                                    검색
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="modal_btn subbtn on"
                                    title="#hotelInsert"
                                    onClick={(e) => regHotel()}
                                >
                                    호텔신규등록
                                </Link>{" "}
                                <Link href="" className="subbtn on">
                                    엑셀 다운로드
                                </Link>{" "}
                                <Link href="" className="subbtn on">
                                    일괄 업로드
                                </Link>
                            </div>
                        </div>
                        <div className="adm_table">
                            <table className="table_a">
                                <colgroup>
                                    <col width="3%" />
                                    <col width="8%" />
                                    <col width="5%" />
                                    <col width="5%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="16%" />
                                    <col width="10%" />
                                    {/* <col width="10%" /> */}
                                    <col width="5%" />
                                    <col width="5%" />
                                    <col width="5%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" />
                                        </th>
                                        <th>대표이미지</th>
                                        <th>고유번호</th>
                                        <th>구분</th>
                                        <th colSpan="2">호텔명</th>
                                        <th>주소</th>
                                        <th>연락처</th>
                                        {/* <th>담당자</th> */}
                                        <th>상세보기</th>
                                        <th>미리보기</th>
                                        <th>객실리스트</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotelList.length !== 0 ? (
                                        hotelList.map((item, idx) => (
                                            <tr key={`hotel_list_${idx}`}>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                                <td className="hotel_thumb_td">
                                                    <img
                                                        src={`${apiPath.api_admin_hotel_list_thumb}${item.file_path_enc}`}
                                                        alt=""
                                                    />
                                                </td>
                                                <td>{item.name_key}</td>
                                                <td>
                                                    {
                                                        hotel_static.NATION_TYPE
                                                            .convertKo[
                                                            item.nation_type_cd
                                                        ]
                                                    }
                                                </td>
                                                <td>{item.name_ko}</td>
                                                <td>{item.name_en}</td>
                                                <td>
                                                    {`${item.addr1_ko} ${item.addr2_ko}`}
                                                </td>
                                                <td>{`${item.phone1}-${item.phone2}-${item.phone3}`}</td>
                                                {/* <td className="person_td">
                                                    임은지{" "}
                                            <button className="person_btn">
                                                <img
                                                    src="img/common/user_icon.png"
                                                    alt=""
                                                />
                                            </button>
                                            <div className="person_box">
                                                <table className="table_b inner_table">
                                                    <colgroup>
                                                        <col width="20%" />
                                                        <col width="*" />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th>연락처</th>
                                                            <td>
                                                                010-0000-0000
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>이메일</th>
                                                            <td>
                                                                ej.lim@hicomp.net
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>메모</th>
                                                            <td>
                                                                담당자 메모를
                                                                작성하면 여기에
                                                                보여집니다. 해당
                                                                내용은 당사
                                                                담당자만 확인이
                                                                가능합니다.
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                                </td> */}
                                                <td>
                                                    <Link className="tablebtn">
                                                        상세보기
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link className="tablebtn">
                                                        미리보기
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link className="tablebtn">
                                                        객실리스트
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <>
                                            <tr>
                                                <td
                                                    colSpan="11"
                                                    style={{ height: "55px" }}
                                                >
                                                    <b>데이터가 없습니다.</b>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                    {/* <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td className="hotel_thumb_td">
                                            <img
                                                src="img/hotel/hotel01.png"
                                                alt=""
                                            />
                                        </td>
                                        <td>STGN</td>
                                        <td>국내</td>
                                        <td>강릉세인트존스호텔</td>
                                        <td>St.JOHN’S HOTEL</td>
                                        <td>
                                            강원도 강릉 창해로 307(강문동
                                            1-1번지)
                                        </td>
                                        <td>033-660-9000</td>
                                        <td className="person_td">
                                            임은지{" "}
                                            <button className="person_btn">
                                                <img
                                                    src="img/common/user_icon.png"
                                                    alt=""
                                                />
                                            </button>
                                            <div className="person_box">
                                                <table className="table_b inner_table">
                                                    <colgroup>
                                                        <col width="20%" />
                                                        <col width="*" />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th>연락처</th>
                                                            <td>
                                                                010-0000-0000
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>이메일</th>
                                                            <td>
                                                                ej.lim@hicomp.net
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>메모</th>
                                                            <td>
                                                                담당자 메모를
                                                                작성하면 여기에
                                                                보여집니다. 해당
                                                                내용은 당사
                                                                담당자만 확인이
                                                                가능합니다.
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                        <td>
                                            <Link className="tablebtn">
                                                상세보기
                                            </Link>
                                        </td>
                                        <td>
                                            <Link className="tablebtn">
                                                미리보기
                                            </Link>
                                        </td>
                                        <td>
                                            <Link className="tablebtn">
                                                객실리스트
                                            </Link>
                                        </td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                        {pageInfo && (
                            <div className="pagenation">
                                <Pagination
                                    count={pageInfo.pages}
                                    onChange={handleChange}
                                    shape="rounded"
                                    color="primary"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CommonModal
                isOpen={isOpen}
                title={modalTitle}
                width={"1400"}
                handleModalClose={handleModalClose}
                component={"HotelDetailModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                // modUserData={modUserData}
            />
        </>
    );
};

export default HotelListMain;
