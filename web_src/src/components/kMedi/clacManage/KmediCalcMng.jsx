import { Link } from "react-router-dom";

const KmediCalcMng = (props) => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>정산관리</h3>
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
                                <h5>정산상태</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="charge_status1"
                                        name="charge_status"
                                    />
                                    <label for="charge_status1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="charge_status2"
                                        name="charge_status"
                                    />
                                    <label for="charge_status2">구독권</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="charge_status3"
                                        name="charge_status"
                                    />
                                    <label for="charge_status3">유료영상</label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">회원이름</option>
                                    <option value="">병원이름</option>
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
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="adm_statistics">
                        <div>
                            <ul>
                                <li>
                                    <Link href="">
                                        전체 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        정산대기 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        정산예정금액 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        정산완료 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        정산금액 <strong>00개</strong>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="kmedi_add_btn">
                        <div>
                            <Link href="" className="subbtn del">
                                정산대기
                            </Link>
                            <Link href="" className="subbtn on">
                                정산완료
                            </Link>
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
                                        <th>정산 요청일</th>
                                        <th>정산상태</th>
                                        <th>회원이름</th>
                                        <th>실판매금액</th>
                                        <th>수수료</th>
                                        <th>부가세</th>
                                        <th>정산금액</th>
                                        <th>예금주</th>
                                        <th>은행</th>
                                        <th>계좌번호</th>
                                        <th>상세보기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>23.05.30</td>
                                        <td>
                                            <span className="red">
                                                정산대기
                                            </span>
                                        </td>
                                        <td>
                                            <Link href="" className="default_a">
                                                서지은
                                            </Link>
                                        </td>
                                        <td>83,000원</td>
                                        <td>-8,300원</td>
                                        <td>-830원</td>
                                        <td>75,530원</td>
                                        <td>서지은</td>
                                        <td>IBK기업</td>
                                        <td>213142366</td>
                                        <td>
                                            <Link
                                                href="kmedi_charge_detail.html"
                                                className="tablebtn"
                                            >
                                                상세보기
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>23.05.30</td>
                                        <td>
                                            <span className="red">
                                                정산대기
                                            </span>
                                        </td>
                                        <td>
                                            <Link href="" className="default_a">
                                                서지은
                                            </Link>
                                        </td>
                                        <td>83,000원</td>
                                        <td>-8,300원</td>
                                        <td>-830원</td>
                                        <td>75,530원</td>
                                        <td>서지은</td>
                                        <td>IBK기업</td>
                                        <td>213142366</td>
                                        <td>
                                            <Link
                                                href="kmedi_charge_detail.html"
                                                className="tablebtn"
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

export default KmediCalcMng;
