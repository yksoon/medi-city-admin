import React, { useState } from "react";
import { Link } from "react-router-dom";
import HotelDetailModalMain from "./hotelDetailModal/HotelDetailModalMain";

const HotelListMain = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");

    const regHotel = () => {
        setModalTitle("호텔 신규 등록");
        setIsOpen(true);

        console.log(isOpen);
        console.log(modalTitle);
    };

    const handleModalClose = () => {
        setModalTitle("");
        setIsOpen(false);
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
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">이름</option>
                                    <option value="">소속</option>
                                </select>{" "}
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
                                    <col width="10%" />
                                    <col width="10%" />
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
                                        <th>담당자</th>
                                        <th>상세보기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
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
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <HotelDetailModalMain
                isOpen={isOpen}
                title={modalTitle}
                handleModalClose={handleModalClose}
                // modUserData={modUserData}
                // handleNeedUpdate={handleNeedUpdate}
            />
        </>
    );
};

export default HotelListMain;
