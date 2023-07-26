import React from "react";
import { Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import $ from "jquery";

const HotelDetailModalMain = (props) => {
    const dispatch = useDispatch();

    const modalOption = {
        isOpen: props.isOpen,
        title: props.title,
        handleModalClose: props.handleModalClose,
    };

    const starClick = (e) => {
        //호텔신규등록 - 등급 별 스타일
        $(".star").removeClass("on");
        $(e.currentTarget).addClass("on");
        $(e.currentTarget).prevAll().addClass("on");
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
                    <div className="modal w1400">
                        <div
                            className="modal_close"
                            onClick={modalOption.handleModalClose}
                        >
                            <img src="img/common/modal_close.png" alt="" />
                        </div>
                        <div
                            className="modal_content form hotel"
                            id="hotelInsert"
                        >
                            <div className="mo_title">
                                <h4>호텔 신규 등록</h4>
                            </div>
                            <div className="hotel_box">
                                <h4 className="mo_subtitle">호텔 필수 정보</h4>
                                <table className="table_bb">
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
                                                    className="w120"
                                                >
                                                    <option defaultValue="">
                                                        국내
                                                    </option>
                                                    <option defaultValue="">
                                                        해외
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                호텔명(국문){" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td>
                                                <input
                                                    type="email"
                                                    className="input w370"
                                                    autoFocus
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                호텔명(영문){" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td>
                                                <input
                                                    type="password"
                                                    className="input w370"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                고유번호{" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td>
                                                <input
                                                    type="password"
                                                    className="input w180"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                썸네일 이미지{" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td>
                                                <div className="hotel_thumb_wrap">
                                                    <span className="hotel_thumb">
                                                        <img
                                                            src="img/hotel/hotel01.png"
                                                            alt=""
                                                        />
                                                    </span>
                                                </div>
                                                <input type="file" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                호텔 이미지{" "}
                                                <span className="red">*</span>
                                                <br />
                                                (최대 5개)
                                            </th>
                                            <td>
                                                <div className="hotel_img_wrap">
                                                    <span className="hotel_img"></span>
                                                    <span className="hotel_img"></span>
                                                    <span className="hotel_img"></span>
                                                    <span className="hotel_img"></span>
                                                    <span className="hotel_img"></span>
                                                </div>
                                                <input type="file" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                주소(국문){" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td className="hotel_add_wrap">
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="input w120"
                                                    />
                                                    <a
                                                        href=""
                                                        className="tablebtn"
                                                    >
                                                        우편번호찾기
                                                    </a>
                                                </div>
                                                <div>
                                                    <input
                                                        type="name"
                                                        className="input w370"
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="name"
                                                        className="input w370"
                                                        placeholder="상세 주소"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                주소(영문){" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td className="hotel_add_wrap">
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="input w120"
                                                    />
                                                    <a
                                                        href=""
                                                        className="tablebtn"
                                                    >
                                                        우편번호찾기
                                                    </a>
                                                </div>
                                                <div>
                                                    <input
                                                        type="name"
                                                        className="input w370"
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="name"
                                                        className="input w370"
                                                        placeholder="상세 주소"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                전화번호{" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td>
                                                <div
                                                    id="phone_num"
                                                    className="m0"
                                                >
                                                    <input
                                                        type="tel"
                                                        className="input w120"
                                                        id="phone_num1"
                                                        defaultValue="010"
                                                        readOnly
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
                                        </tr>
                                        <tr>
                                            <th>전화번호 (해외)</th>
                                            <td>
                                                <div
                                                    id="phone_num"
                                                    className="m0"
                                                >
                                                    <select
                                                        name=""
                                                        id=""
                                                        className="w100"
                                                    >
                                                        <option defaultValue="">
                                                            +82
                                                        </option>
                                                    </select>
                                                    <input
                                                        type="tel"
                                                        className="input w100"
                                                        id="inter_phone_num1"
                                                        defaultValue="010"
                                                        readOnly
                                                    />
                                                    <input
                                                        type="tel"
                                                        className="input w120"
                                                        id="inter_phone_num2"
                                                    />
                                                    <input
                                                        type="tel"
                                                        className="input w120"
                                                        id="inter_phone_num3"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="subbtn_box">
                                    <a
                                        // href="javascript:alert('저장되었습니다.');"
                                        className="subbtn off"
                                    >
                                        저장
                                    </a>
                                </div>
                            </div>
                            <div className="hotel_box">
                                <h4 className="mo_subtitle">호텔 기본 정보</h4>
                                <table className="table_bb">
                                    <colgroup>
                                        <col width="20%" />
                                        <col width="*" />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>서비스상태</th>
                                            <td>
                                                <select
                                                    name=""
                                                    id=""
                                                    className="w180"
                                                >
                                                    <option defaultValue="">
                                                        영업중
                                                    </option>
                                                    <option defaultValue="">
                                                        휴업
                                                    </option>
                                                    <option defaultValue="">
                                                        폐업
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>지점타입</th>
                                            <td>
                                                <select
                                                    name=""
                                                    id=""
                                                    className="w180"
                                                >
                                                    <option defaultValue="">
                                                        서울
                                                    </option>
                                                    <option defaultValue="">
                                                        부산
                                                    </option>
                                                    <option defaultValue="">
                                                        여수
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>건물타입</th>
                                            <td>
                                                <select
                                                    name=""
                                                    id=""
                                                    className="w180"
                                                >
                                                    <option defaultValue="">
                                                        콘도
                                                    </option>
                                                    <option defaultValue="">
                                                        호텔
                                                    </option>
                                                    <option defaultValue="">
                                                        리조트
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>위치타입</th>
                                            <td>
                                                <select
                                                    name=""
                                                    id=""
                                                    className="w180"
                                                >
                                                    <option defaultValue="">
                                                        ???
                                                    </option>
                                                    <option defaultValue="">
                                                        ???
                                                    </option>
                                                    <option defaultValue="">
                                                        ???
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>홈페이지</th>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input w370"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>홈페이지 노출 여부</th>
                                            <td>
                                                <div className="hotel_radio_box">
                                                    <input
                                                        type="radio"
                                                        id="homepage_Y"
                                                        name="homepage"
                                                    />
                                                    <label htmlFor="homepage_Y">
                                                        노출
                                                    </label>
                                                </div>
                                                <div className="hotel_radio_box">
                                                    <input
                                                        type="radio"
                                                        id="homepage_N"
                                                        name="homepage"
                                                    />
                                                    <label htmlFor="homepage_N">
                                                        미노출
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>등급</th>
                                            <td>
                                                <div className="hotel_star_wrap">
                                                    <span
                                                        className="star"
                                                        onClick={(e) =>
                                                            starClick(e)
                                                        }
                                                    >
                                                        <svg
                                                            version="1.1"
                                                            id="Layer_1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            x="0px"
                                                            y="0px"
                                                            viewBox="0 0 48 48"
                                                            // style="enable-background:new 0 0 48 48;fill:#ddd;width:26px;"
                                                            style={{
                                                                enableBackground:
                                                                    "new 0 0 48 48",
                                                                fill: "#ddd",
                                                                width: "26px",
                                                            }}
                                                            xmlSpace="preserve"
                                                        >
                                                            <path
                                                                d="M41.8,21.2c-0.1-0.3-0.2-0.5-0.5-0.7c-0.2-0.2-0.5-0.3-0.8-0.3l-10.9-1l-4.2-10c-0.1-0.3-0.3-0.5-0.6-0.7
                                                c-0.3-0.2-0.5-0.2-0.8-0.2s-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.4-0.6,0.7l-4.2,10l-10.9,1c-0.3,0-0.6,0.1-0.8,0.3
                                                c-0.2,0.2-0.4,0.4-0.5,0.7s-0.1,0.5,0,0.8c0.1,0.3,0.2,0.5,0.5,0.8l8.2,7.2l-2.5,10.6c-0.1,0.3,0,0.6,0.1,0.9
                                                c0.1,0.3,0.3,0.5,0.5,0.6c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.9-0.2l9.3-5.6l9.3,5.6c0.3,0.2,0.5,0.2,0.9,0.2
                                                c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.3,0.1-0.6,0.1-0.9L33.1,30l8.2-7.2c0.3-0.2,0.4-0.5,0.5-0.8
                                                C41.8,21.7,41.8,21.5,41.8,21.2z"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className="star"
                                                        onClick={(e) =>
                                                            starClick(e)
                                                        }
                                                    >
                                                        <svg
                                                            version="1.1"
                                                            id="Layer_1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            x="0px"
                                                            y="0px"
                                                            viewBox="0 0 48 48"
                                                            // style="enable-background:new 0 0 48 48;fill:#ddd;width:26px;"
                                                            style={{
                                                                enableBackground:
                                                                    "new 0 0 48 48",
                                                                fill: "#ddd",
                                                                width: "26px",
                                                            }}
                                                            xmlSpace="preserve"
                                                        >
                                                            <path
                                                                d="M41.8,21.2c-0.1-0.3-0.2-0.5-0.5-0.7c-0.2-0.2-0.5-0.3-0.8-0.3l-10.9-1l-4.2-10c-0.1-0.3-0.3-0.5-0.6-0.7
                                                c-0.3-0.2-0.5-0.2-0.8-0.2s-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.4-0.6,0.7l-4.2,10l-10.9,1c-0.3,0-0.6,0.1-0.8,0.3
                                                c-0.2,0.2-0.4,0.4-0.5,0.7s-0.1,0.5,0,0.8c0.1,0.3,0.2,0.5,0.5,0.8l8.2,7.2l-2.5,10.6c-0.1,0.3,0,0.6,0.1,0.9
                                                c0.1,0.3,0.3,0.5,0.5,0.6c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.9-0.2l9.3-5.6l9.3,5.6c0.3,0.2,0.5,0.2,0.9,0.2
                                                c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.3,0.1-0.6,0.1-0.9L33.1,30l8.2-7.2c0.3-0.2,0.4-0.5,0.5-0.8
                                                C41.8,21.7,41.8,21.5,41.8,21.2z"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className="star"
                                                        onClick={(e) =>
                                                            starClick(e)
                                                        }
                                                    >
                                                        <svg
                                                            version="1.1"
                                                            id="Layer_1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            x="0px"
                                                            y="0px"
                                                            viewBox="0 0 48 48"
                                                            // style="enable-background:new 0 0 48 48;fill:#ddd;width:26px;"
                                                            style={{
                                                                enableBackground:
                                                                    "new 0 0 48 48",
                                                                fill: "#ddd",
                                                                width: "26px",
                                                            }}
                                                            xmlSpace="preserve"
                                                        >
                                                            <path
                                                                d="M41.8,21.2c-0.1-0.3-0.2-0.5-0.5-0.7c-0.2-0.2-0.5-0.3-0.8-0.3l-10.9-1l-4.2-10c-0.1-0.3-0.3-0.5-0.6-0.7
                                                c-0.3-0.2-0.5-0.2-0.8-0.2s-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.4-0.6,0.7l-4.2,10l-10.9,1c-0.3,0-0.6,0.1-0.8,0.3
                                                c-0.2,0.2-0.4,0.4-0.5,0.7s-0.1,0.5,0,0.8c0.1,0.3,0.2,0.5,0.5,0.8l8.2,7.2l-2.5,10.6c-0.1,0.3,0,0.6,0.1,0.9
                                                c0.1,0.3,0.3,0.5,0.5,0.6c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.9-0.2l9.3-5.6l9.3,5.6c0.3,0.2,0.5,0.2,0.9,0.2
                                                c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.3,0.1-0.6,0.1-0.9L33.1,30l8.2-7.2c0.3-0.2,0.4-0.5,0.5-0.8
                                                C41.8,21.7,41.8,21.5,41.8,21.2z"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className="star"
                                                        onClick={(e) =>
                                                            starClick(e)
                                                        }
                                                    >
                                                        <svg
                                                            version="1.1"
                                                            id="Layer_1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            x="0px"
                                                            y="0px"
                                                            viewBox="0 0 48 48"
                                                            // style="enable-background:new 0 0 48 48;fill:#ddd;width:26px;"
                                                            style={{
                                                                enableBackground:
                                                                    "new 0 0 48 48",
                                                                fill: "#ddd",
                                                                width: "26px",
                                                            }}
                                                            xmlSpace="preserve"
                                                        >
                                                            <path
                                                                d="M41.8,21.2c-0.1-0.3-0.2-0.5-0.5-0.7c-0.2-0.2-0.5-0.3-0.8-0.3l-10.9-1l-4.2-10c-0.1-0.3-0.3-0.5-0.6-0.7
                                                c-0.3-0.2-0.5-0.2-0.8-0.2s-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.4-0.6,0.7l-4.2,10l-10.9,1c-0.3,0-0.6,0.1-0.8,0.3
                                                c-0.2,0.2-0.4,0.4-0.5,0.7s-0.1,0.5,0,0.8c0.1,0.3,0.2,0.5,0.5,0.8l8.2,7.2l-2.5,10.6c-0.1,0.3,0,0.6,0.1,0.9
                                                c0.1,0.3,0.3,0.5,0.5,0.6c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.9-0.2l9.3-5.6l9.3,5.6c0.3,0.2,0.5,0.2,0.9,0.2
                                                c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.3,0.1-0.6,0.1-0.9L33.1,30l8.2-7.2c0.3-0.2,0.4-0.5,0.5-0.8
                                                C41.8,21.7,41.8,21.5,41.8,21.2z"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className="star"
                                                        onClick={(e) =>
                                                            starClick(e)
                                                        }
                                                    >
                                                        <svg
                                                            version="1.1"
                                                            id="Layer_1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            x="0px"
                                                            y="0px"
                                                            viewBox="0 0 48 48"
                                                            // style="enable-background:new 0 0 48 48;fill:#ddd;width:26px;"
                                                            style={{
                                                                enableBackground:
                                                                    "new 0 0 48 48",
                                                                fill: "#ddd",
                                                                width: "26px",
                                                            }}
                                                            xmlSpace="preserve"
                                                        >
                                                            <path
                                                                d="M41.8,21.2c-0.1-0.3-0.2-0.5-0.5-0.7c-0.2-0.2-0.5-0.3-0.8-0.3l-10.9-1l-4.2-10c-0.1-0.3-0.3-0.5-0.6-0.7
                                                c-0.3-0.2-0.5-0.2-0.8-0.2s-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.4-0.6,0.7l-4.2,10l-10.9,1c-0.3,0-0.6,0.1-0.8,0.3
                                                c-0.2,0.2-0.4,0.4-0.5,0.7s-0.1,0.5,0,0.8c0.1,0.3,0.2,0.5,0.5,0.8l8.2,7.2l-2.5,10.6c-0.1,0.3,0,0.6,0.1,0.9
                                                c0.1,0.3,0.3,0.5,0.5,0.6c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.9-0.2l9.3-5.6l9.3,5.6c0.3,0.2,0.5,0.2,0.9,0.2
                                                c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.3,0.1-0.6,0.1-0.9L33.1,30l8.2-7.2c0.3-0.2,0.4-0.5,0.5-0.8
                                                C41.8,21.7,41.8,21.5,41.8,21.2z"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className="star"
                                                        onClick={(e) =>
                                                            starClick(e)
                                                        }
                                                    >
                                                        <svg
                                                            version="1.1"
                                                            id="Layer_1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            x="0px"
                                                            y="0px"
                                                            viewBox="0 0 48 48"
                                                            // style="enable-background:new 0 0 48 48;fill:#ddd;width:26px;"
                                                            style={{
                                                                enableBackground:
                                                                    "new 0 0 48 48",
                                                                fill: "#ddd",
                                                                width: "26px",
                                                            }}
                                                            xmlSpace="preserve"
                                                        >
                                                            <path
                                                                d="M41.8,21.2c-0.1-0.3-0.2-0.5-0.5-0.7c-0.2-0.2-0.5-0.3-0.8-0.3l-10.9-1l-4.2-10c-0.1-0.3-0.3-0.5-0.6-0.7
                                                c-0.3-0.2-0.5-0.2-0.8-0.2s-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.4-0.6,0.7l-4.2,10l-10.9,1c-0.3,0-0.6,0.1-0.8,0.3
                                                c-0.2,0.2-0.4,0.4-0.5,0.7s-0.1,0.5,0,0.8c0.1,0.3,0.2,0.5,0.5,0.8l8.2,7.2l-2.5,10.6c-0.1,0.3,0,0.6,0.1,0.9
                                                c0.1,0.3,0.3,0.5,0.5,0.6c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.9-0.2l9.3-5.6l9.3,5.6c0.3,0.2,0.5,0.2,0.9,0.2
                                                c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.3,0.1-0.6,0.1-0.9L33.1,30l8.2-7.2c0.3-0.2,0.4-0.5,0.5-0.8
                                                C41.8,21.7,41.8,21.5,41.8,21.2z"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className="star"
                                                        onClick={(e) =>
                                                            starClick(e)
                                                        }
                                                    >
                                                        <svg
                                                            version="1.1"
                                                            id="Layer_1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            x="0px"
                                                            y="0px"
                                                            viewBox="0 0 48 48"
                                                            // style="enable-background:new 0 0 48 48;fill:#ddd;width:26px;"
                                                            style={{
                                                                enableBackground:
                                                                    "new 0 0 48 48",
                                                                fill: "#ddd",
                                                                width: "26px",
                                                            }}
                                                            xmlSpace="preserve"
                                                        >
                                                            <path
                                                                d="M41.8,21.2c-0.1-0.3-0.2-0.5-0.5-0.7c-0.2-0.2-0.5-0.3-0.8-0.3l-10.9-1l-4.2-10c-0.1-0.3-0.3-0.5-0.6-0.7
                                                c-0.3-0.2-0.5-0.2-0.8-0.2s-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.4-0.6,0.7l-4.2,10l-10.9,1c-0.3,0-0.6,0.1-0.8,0.3
                                                c-0.2,0.2-0.4,0.4-0.5,0.7s-0.1,0.5,0,0.8c0.1,0.3,0.2,0.5,0.5,0.8l8.2,7.2l-2.5,10.6c-0.1,0.3,0,0.6,0.1,0.9
                                                c0.1,0.3,0.3,0.5,0.5,0.6c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.9-0.2l9.3-5.6l9.3,5.6c0.3,0.2,0.5,0.2,0.9,0.2
                                                c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.3,0.1-0.6,0.1-0.9L33.1,30l8.2-7.2c0.3-0.2,0.4-0.5,0.5-0.8
                                                C41.8,21.7,41.8,21.5,41.8,21.2z"
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>정렬순서</th>
                                            <td>
                                                <select
                                                    name=""
                                                    id=""
                                                    className="w120"
                                                >
                                                    <option defaultValue="">
                                                        1
                                                    </option>
                                                    <option defaultValue="">
                                                        2
                                                    </option>
                                                    <option defaultValue="">
                                                        3
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>체크인시간</th>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input w120"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>체크아웃시간</th>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input w120"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="subbtn_box">
                                    <a
                                        // href="javascript:alert('저장되었습니다.');"
                                        className="subbtn off"
                                    >
                                        저장
                                    </a>
                                </div>
                            </div>
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
                                                    id=""
                                                    className="hotel_info"
                                                ></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>소개(영문)</th>
                                            <td>
                                                <textarea
                                                    name=""
                                                    id=""
                                                    className="hotel_info"
                                                ></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>규정(국문)</th>
                                            <td>
                                                <textarea
                                                    name=""
                                                    id=""
                                                    className="hotel_info"
                                                ></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>규정(영문)</th>
                                            <td>
                                                <textarea
                                                    name=""
                                                    id=""
                                                    className="hotel_info"
                                                ></textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="subbtn_box">
                                    <a
                                        // href="javascript:alert('저장되었습니다.');"
                                        className="subbtn on"
                                    >
                                        저장
                                    </a>
                                </div>
                            </div>
                            <div className="hotel_box">
                                <h4 className="mo_subtitle">담당자 정보 </h4>
                                <table className="table_bb">
                                    <colgroup>
                                        <col width="20%" />
                                        <col width="30%" />
                                        <col width="20%" />
                                        <col width="30%" />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>이름</th>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input wp100"
                                                />
                                            </td>
                                            <th>직급·직책</th>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input wp100"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이메일</th>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input wp100"
                                                />
                                            </td>
                                            <th>연락처</th>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input wp100"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>메모</th>
                                            <td colSpan="3">
                                                <input
                                                    type="text"
                                                    className="input wp100"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="subbtn_box">
                                    <a href="" className="subbtn off">
                                        담당자 추가
                                    </a>
                                    <a href="" className="subbtn del">
                                        삭제
                                    </a>
                                    <a
                                        // href="javascript:alert('저장되었습니다.');"
                                        className="subbtn on"
                                    >
                                        저장
                                    </a>
                                </div>
                            </div>
                            <div className="hotel_box hotel_service">
                                <h4 className="mo_subtitle">부대시설 설정</h4>
                                <table className="table_bb">
                                    <colgroup>
                                        <col width="20%" />
                                        <col width="30%" />
                                        <col width="20%" />
                                        <col width="30%" />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="fitness"
                                                    />
                                                    피트니스
                                                </label>
                                            </th>
                                            <td>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessY"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessY">
                                                        있음
                                                    </label>
                                                </div>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessN"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessN">
                                                        없음
                                                    </label>
                                                </div>
                                                <div className="hotel_pay_box">
                                                    <input
                                                        type="checkbox"
                                                        id="fitnessPay"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessPay">
                                                        유료
                                                    </label>
                                                </div>
                                            </td>
                                            <th>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="fitness"
                                                    />
                                                    피트니스
                                                </label>
                                            </th>
                                            <td>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessY"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessY">
                                                        있음
                                                    </label>
                                                </div>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessN"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessN">
                                                        없음
                                                    </label>
                                                </div>
                                                <div className="hotel_pay_box">
                                                    <input
                                                        type="checkbox"
                                                        id="fitnessPay"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessPay">
                                                        유료
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="fitness"
                                                    />
                                                    피트니스
                                                </label>
                                            </th>
                                            <td>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessY"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessY">
                                                        있음
                                                    </label>
                                                </div>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessN"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessN">
                                                        없음
                                                    </label>
                                                </div>
                                                <div className="hotel_pay_box">
                                                    <input
                                                        type="checkbox"
                                                        id="fitnessPay"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessPay">
                                                        유료
                                                    </label>
                                                </div>
                                            </td>
                                            <th>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="fitness"
                                                    />
                                                    피트니스
                                                </label>
                                            </th>
                                            <td>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessY"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessY">
                                                        있음
                                                    </label>
                                                </div>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessN"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessN">
                                                        없음
                                                    </label>
                                                </div>
                                                <div className="hotel_pay_box">
                                                    <input
                                                        type="checkbox"
                                                        id="fitnessPay"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessPay">
                                                        유료
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="fitness"
                                                    />
                                                    피트니스
                                                </label>
                                            </th>
                                            <td>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessY"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessY">
                                                        있음
                                                    </label>
                                                </div>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessN"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessN">
                                                        없음
                                                    </label>
                                                </div>
                                                <div className="hotel_pay_box">
                                                    <input
                                                        type="checkbox"
                                                        id="fitnessPay"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessPay">
                                                        유료
                                                    </label>
                                                </div>
                                            </td>
                                            <th>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="fitness"
                                                    />
                                                    피트니스
                                                </label>
                                            </th>
                                            <td>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessY"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessY">
                                                        있음
                                                    </label>
                                                </div>
                                                <div className="hotel_service_radio">
                                                    <input
                                                        type="radio"
                                                        id="fitnessN"
                                                        className="hide"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessN">
                                                        없음
                                                    </label>
                                                </div>
                                                <div className="hotel_pay_box">
                                                    <input
                                                        type="checkbox"
                                                        id="fitnessPay"
                                                        name="FITNESS"
                                                    />
                                                    <label htmlFor="fitnessPay">
                                                        유료
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="subbtn_box">
                                    <a
                                        // href="javascript:void(0);"
                                        className="modal_btn subbtn off"
                                        title="#hotelPreview"
                                        // onClick="modal_open(hotelPreview);"
                                    >
                                        미리보기
                                    </a>
                                    {/* <a href="javascript:void(0);" className="subbtn off" onClick="console.log(hotelPreview)">미리보기</a> */}
                                    <a
                                        // href="javascript:alert('저장되었습니다.');"
                                        className="subbtn on"
                                    >
                                        저장
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* <!-- modal Content - 호텔신규등록 //E -->
            <!-- modal content - 호텔미리보기 //S --> */}
                        <div className="modal_content hotel" id="hotelPreview">
                            <div className="mo_title">
                                <h4>호텔 미리보기</h4>
                            </div>
                            <div className="hotel_preview_wrap">
                                <span className="hotel_preview_thumb">
                                    <img src="" alt="" />
                                </span>
                            </div>
                            <div className="subbtn_box">
                                <a
                                    // href="javascript:void(0);"
                                    className="subbtn off"
                                >
                                    미리보기 닫기
                                </a>
                                <a
                                    // href="javascript:alert('저장되었습니다.');"
                                    className="subbtn on"
                                >
                                    저장
                                </a>
                            </div>
                        </div>
                        {/* <!-- modal Content - 호텔미리보기 //E --> */}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default HotelDetailModalMain;
