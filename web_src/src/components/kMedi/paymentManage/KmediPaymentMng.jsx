const { Link } = require("react-router-dom");

const KmediPaymentMng = (props) => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>결제내역</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_top_wrap">
                        <div className="kmedi_top_box">
                            <div className="kmedi_top">
                                <h5>기간조회</h5>
                                <Link href="" className="kmedi_top_btn">
                                    7일
                                </Link>
                                <Link href="" className="kmedi_top_btn">
                                    14일
                                </Link>
                                <Link href="" className="kmedi_top_btn">
                                    30일
                                </Link>
                                <Link href="" className="kmedi_top_btn">
                                    3개월
                                </Link>
                                <input type="date" className="input" /> ~{" "}
                                <input type="date" className="input" />
                            </div>
                            <div className="kmedi_top">
                                <h5>구매상품</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="payment_product1"
                                        name="payment_product"
                                    />
                                    <label for="payment_product1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="payment_product2"
                                        name="payment_product"
                                    />
                                    <label for="payment_product2">구독권</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="payment_product3"
                                        name="payment_product"
                                    />
                                    <label for="payment_product3">
                                        유료영상
                                    </label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <h5>결제구분</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="payment_gubun1"
                                        name="payment_gubun"
                                    />
                                    <label for="payment_gubun1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="payment_gubun2"
                                        name="payment_gubun"
                                    />
                                    <label for="payment_gubun2">정상결제</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="payment_gubun3"
                                        name="payment_gubun"
                                    />
                                    <label for="payment_gubun3">결제취소</label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">회원이름</option>
                                    <option value="">상품명</option>
                                    <option value="">주문번호</option>
                                </select>
                                <input type="text" className="input" />
                                <Link href="" className="subbtn off">
                                    검색
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="adm_statistics">
                        <table className="table_a inner_table">
                            <tbody>
                                <tr>
                                    <th>총 주문 금액 (건 수)</th>
                                    <th>총 정산 금액 (건 수)</th>
                                    <th>총 결제취소 금액 (건 수)</th>
                                    <th>수수료 (마진)</th>
                                    <th>부가세</th>
                                    <th>누적 매출 금액</th>
                                    <th>누적 순 이익</th>
                                </tr>
                                <tr>
                                    <td>
                                        <Link href="">000</Link>
                                    </td>
                                    <td>
                                        <Link href="">000</Link>
                                    </td>
                                    <td>
                                        <Link href="">000</Link>
                                    </td>
                                    <td>
                                        <Link href="">000</Link>
                                    </td>
                                    <td>
                                        <Link href="">000</Link>
                                    </td>
                                    <td>
                                        <Link href="">000</Link>
                                    </td>
                                    <td>
                                        <Link href="">000</Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="kmedi_add_btn">
                        <div>
                            <Link href="" className="subbtn on">
                                엑셀 다운로드
                            </Link>
                        </div>
                    </div>
                    <div className="kmedi_content">
                        <div className="adm_table">
                            <table className="table_a">
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" />
                                        </th>
                                        <th>결제일시</th>
                                        <th>상품금액</th>
                                        <th>주문번호</th>
                                        <th>상품금액</th>
                                        <th>결제상품명</th>
                                        <th>구매자</th>
                                        <th>상품금액</th>
                                        <th>사용포인트</th>
                                        <th>실 결제금액</th>
                                        <th>상세보기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>23.05.30 18:31</td>
                                        <td>구독권</td>
                                        <td>AC4532</td>
                                        <td>정상결제</td>
                                        <td>
                                            <Link href="" className="default_a">
                                                3개월 구독권
                                            </Link>
                                        </td>
                                        <td>
                                            <Link href="" className="default_a">
                                                sopia
                                            </Link>
                                        </td>
                                        <td>Rp450,000</td>
                                        <td>-1,000</td>
                                        <td>Rp440,000</td>
                                        <td>
                                            <Link
                                                href="javascript:void(0)"
                                                className="tablebtn"
                                                onclick="modal_open(1)"
                                            >
                                                상세보기
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>23.05.30 18:31</td>
                                        <td>구독권</td>
                                        <td>AC4532</td>
                                        <td>정상결제</td>
                                        <td>
                                            <Link href="" className="default_a">
                                                3개월 구독권
                                            </Link>
                                        </td>
                                        <td>
                                            <Link href="" className="default_a">
                                                sopia
                                            </Link>
                                        </td>
                                        <td>Rp450,000</td>
                                        <td>-1,000</td>
                                        <td>Rp440,000</td>
                                        <td>
                                            <Link
                                                href="javascript:void(0)"
                                                className="tablebtn"
                                                onclick="modal_open(1)"
                                            >
                                                상세보기
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="pagenation"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KmediPaymentMng;
