/*global kakao*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";

const KakaoTest = () => {
    const [openPostcode, setOpenPostcode] = useState(false);
    let geocoder = new kakao.maps.services.Geocoder();

    const handle = {
        // 버튼 클릭 이벤트
        clickButton: () => {
            setOpenPostcode((current) => !current);
        },

        // 주소 선택 이벤트
        selectAddress: (data) => {
            console.log(`
                주소: ${data.address},
                우편번호: ${data.zonecode}
            `);
            console.log(data);
            console.log(data.address);

            geocoder.addressSearch(data.address, callback);
            setOpenPostcode(false);
        },
    };

    const callback = (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            console.log(result);
        }
    };

    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>호텔리스트</h3>
                </div>
                <div>
                    <h3>호텔리스트</h3>
                    <button onClick={handle.clickButton}>테스트야</button>
                </div>
            </div>
            {openPostcode && (
                <DaumPostcode
                    onComplete={handle.selectAddress} // 값을 선택할 경우 실행되는 이벤트
                    autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                    defaultQuery="" // 팝업을 열때 기본적으로 입력되는 검색어
                    width={600}
                />
            )}
        </>
    );
};

export default KakaoTest;
