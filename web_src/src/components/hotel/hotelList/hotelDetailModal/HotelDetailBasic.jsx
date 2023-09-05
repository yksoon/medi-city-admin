import $ from "jquery";
import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { codesAtom } from "recoils/atoms";

const HotelDetailBasic = forwardRef((props, ref) => {
    const codes = useRecoilValue(codesAtom);

    const [hotelStatusSelectList, setHotelStatusSelectList] = useState([]);
    const [positionTypeSelectList, setPositionTypeSelectList] = useState([]);
    // const [viewTypeSelectList, setViewTypeSelectList] = useState([]);

    const [showHomepage, setShowHomepage] = useState(false);

    const { hotelStatus, positionType, homePage, checkInTime, checkOutTime } =
        ref;

    // 라디오버튼 제어
    const handleRadioChange = props.handleRadioChange;
    const homePageShowYn = props.homePageShowYn;

    // 별 제어
    const handleStarChange = props.handleStarChange;

    useLayoutEffect(() => {
        setHotelStatusSelectList(
            codes.filter((e) => e.code_type === "HOTEL_STATUS")
        );

        setPositionTypeSelectList(
            codes.filter((e) => e.code_type === "POSITION_TYPE")
        );

        // setViewTypeSelectList(codes.filter((e) => e.code_type === "VIEW_TYPE"));
    }, []);

    // 홈페이지 노출/비노출 제어
    const handleShowHomepage = (e) => {
        if (e.currentTarget.value) {
            setShowHomepage(true);
        } else {
            setShowHomepage(false);
        }
    };

    // 별 DOM 생성
    const createStar = () => {
        let arr = [];

        for (let i = 0; i < 7; i++) {
            arr.push(
                <span
                    className="star"
                    onClick={(e) => starClick(e)}
                    key={`hotel_star_${i}`}
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
                            enableBackground: "new 0 0 48 48",
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
            );
        }

        return arr;
    };

    // 별 클릭 이벤트
    const starClick = (e) => {
        //호텔신규등록 - 등급 별 스타일
        $(".star").removeClass("on");
        $(e.currentTarget).addClass("on");
        $(e.currentTarget).prevAll().addClass("on");

        const starLength = $(".hotel_star_wrap").children(".on").length;

        handleStarChange(starLength);
    };

    return (
        <>
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
                                    id="hotelStatus"
                                    className="w180"
                                    ref={hotelStatus}
                                >
                                    {hotelStatusSelectList.length !== 0 &&
                                        hotelStatusSelectList.map(
                                            (item, idx) => (
                                                <option
                                                    key={`hotel_status_${idx}`}
                                                    value={item.code_key}
                                                >
                                                    {item.code_value}
                                                </option>
                                            )
                                        )}
                                </select>
                            </td>
                        </tr>
                        {/* <tr>
                            <th>지점타입</th>
                            <td>
                                <select name="" id="" className="w180">
                                    <option defaultValue="">서울</option>
                                    <option defaultValue="">부산</option>
                                    <option defaultValue="">여수</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>건물타입</th>
                            <td>
                                <select name="" id="" className="w180">
                                    <option defaultValue="">콘도</option>
                                    <option defaultValue="">호텔</option>
                                    <option defaultValue="">리조트</option>
                                </select>
                            </td>
                        </tr> */}
                        <tr>
                            <th>위치타입</th>
                            <td>
                                <select
                                    name=""
                                    id="positionType"
                                    className="w180"
                                    ref={positionType}
                                >
                                    {positionTypeSelectList.length !== 0 &&
                                        positionTypeSelectList.map(
                                            (item, idx) => (
                                                <option
                                                    key={`position_type_${idx}`}
                                                    value={item.code_key}
                                                >
                                                    {item.code_value}
                                                </option>
                                            )
                                        )}
                                </select>
                            </td>
                        </tr>
                        {/* <tr>
                            <th>전망타입</th>
                            <td>
                                <select name="" id="" className="w180">
                                    {viewTypeSelectList.length !== 0 &&
                                        viewTypeSelectList.map((item, idx) => (
                                            <option
                                                key={`view_type_${idx}`}
                                                value={item.code_key}
                                            >
                                                {item.code_value}
                                            </option>
                                        ))}
                                </select>
                            </td>
                        </tr> */}
                        <tr>
                            <th>홈페이지</th>
                            <td>
                                <input
                                    type="text"
                                    className="input w370"
                                    id="homePage"
                                    ref={homePage}
                                    onChange={(e) => {
                                        handleShowHomepage(e);
                                    }}
                                />
                            </td>
                        </tr>
                        {showHomepage && (
                            <tr>
                                <th>홈페이지 노출 여부</th>
                                <td>
                                    <div className="hotel_radio_box">
                                        <input
                                            type="radio"
                                            id="homepage_Y"
                                            name="homepage"
                                            value="Y"
                                            onChange={(e) => {
                                                handleRadioChange(e);
                                            }}
                                            checked={homePageShowYn === "Y"}
                                        />
                                        <label htmlFor="homepage_Y">노출</label>
                                    </div>
                                    <div className="hotel_radio_box">
                                        <input
                                            type="radio"
                                            id="homepage_N"
                                            name="homepage"
                                            value="N"
                                            onChange={(e) => {
                                                handleRadioChange(e);
                                            }}
                                            checked={homePageShowYn === "N"}
                                        />
                                        <label htmlFor="homepage_N">
                                            미노출
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        )}

                        <tr>
                            <th>등급</th>
                            <td>
                                <div className="hotel_star_wrap">
                                    {createStar()}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            {/* TODO: 백엔드 처리되면 ㄱㄱ */}
                            <th>정렬순서</th>
                            <td>
                                <select name="" id="" className="w120">
                                    <option defaultValue="">1</option>
                                    <option defaultValue="">2</option>
                                    <option defaultValue="">3</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>체크인시간</th>
                            <td>
                                <input
                                    type="time"
                                    className="input w120"
                                    id="checkInTime"
                                    ref={checkInTime}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>체크아웃시간</th>
                            <td>
                                <input
                                    type="time"
                                    className="input w120"
                                    id="checkOutTime"
                                    ref={checkOutTime}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* <div className="subbtn_box">
                    <Link
                        // href="javascript:alert('저장되었습니다.');"
                        className="subbtn off"
                    >
                        저장
                    </Link>
                </div> */}
            </div>
        </>
    );
});

export default HotelDetailBasic;
