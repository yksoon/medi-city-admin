const HotelPreview = (props) => {
    const previewData = props.previewData;

    console.log(previewData);
    return (
        <>
            {Object.keys(previewData).length !== 0 && (
                <>
                    {/* <div>
                        <div>이미지</div>
                        <div>
                            <img src={previewData.previewImg} alt="" />
                        </div>
                        <br />
                        <div>호텔명(국문)</div>
                        <div>{previewData.nameKo}</div>
                        <div>호텔명(영문)</div>
                        <div>{previewData.nameEn}</div>
                        <div>주소(국문)</div>
                        <div>{`${previewData.addr1Ko} ${previewData.addr2Ko}`}</div>
                        <div>주소(국문)</div>
                        <div>{`${previewData.addr1En} ${previewData.addr2En}`}</div>
                        <div>연락처 (국내)</div>
                        <div>{`${previewData.phone1}-${previewData.phone2}-${previewData.phone3}`}</div>
                    </div> */}
                    <div className="hotel_preview">
                        <ul>
                            <li>
                                <span className="hotel_preview_thumb">
                                    {previewData.previewImg && (
                                        <img
                                            src={previewData.previewImg}
                                            alt=""
                                        />
                                    )}
                                </span>
                                <div className="hotel_preview_txt">
                                    <div className="event">
                                        <img
                                            src="img/common/label_event.png"
                                            alt=""
                                        />
                                    </div>
                                    {previewData.nameKo && (
                                        <h3>{previewData.nameKo}</h3>
                                    )}

                                    {previewData.nameEn && (
                                        <h5>{previewData.nameEn}</h5>
                                    )}

                                    <div className="hotel_venue">
                                        <p>
                                            {previewData.addr1Ko &&
                                                previewData.addr2Ko && (
                                                    <>
                                                        <span>
                                                            <img
                                                                src="img/sub/hotel_venue.png"
                                                                alt=""
                                                            />
                                                        </span>
                                                        {previewData.addr1Ko}{" "}
                                                        {previewData.addr2Ko}
                                                    </>
                                                )}
                                        </p>
                                        <p>
                                            {previewData.phone1 &&
                                                previewData.phone2 &&
                                                previewData.phone3 && (
                                                    <>
                                                        <span>
                                                            <img
                                                                src="img/sub/hotel_tel.png"
                                                                alt=""
                                                            />
                                                        </span>
                                                        +(
                                                        {previewData.interPhoneNumber
                                                            ? previewData.interPhoneNumber
                                                            : "82"}
                                                        ){" "}
                                                        {previewData
                                                            .phone1[0] === "0"
                                                            ? previewData.phone1.substr(
                                                                  1
                                                              )
                                                            : previewData.phone1}{" "}
                                                        - {previewData.phone2} -{" "}
                                                        {previewData.phone3}
                                                    </>
                                                )}
                                        </p>
                                    </div>
                                    {previewData.infoKo && (
                                        <div className="hotel_intro">
                                            {previewData.infoKo}
                                        </div>
                                    )}

                                    {/* <div class="hotel_btn">
                                        <a href="" class="hotel_preview_btn on">
                                            예약 바로가기
                                        </a>
                                        <a href="" class="hotel_preview_btn">
                                            호텔 상세보기
                                        </a>
                                    </div> */}
                                </div>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </>
    );
};

export default HotelPreview;
