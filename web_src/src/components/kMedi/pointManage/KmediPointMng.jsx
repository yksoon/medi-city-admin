import { Link } from "react-router-dom";

const KmediPointMng = (props) => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>포인트 관리</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_add_btn">
                        <div>
                            <Link
                                href="javascipt:void(0)"
                                className="subbtn on"
                                onclick="modal_open(1)"
                            >
                                포인트 정책 등록
                            </Link>
                            {/* <Link href="" className="subbtn on">엑셀 다운로드</Link> */}
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
                                        <th>항목</th>
                                        <th>대상</th>
                                        <th>포인트 적립(%)</th>
                                        <th>수정</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>구매금액</td>
                                        <td>현지의사회원</td>
                                        <td>
                                            <span className="green">+ 10%</span>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascipt:void(0)"
                                                className="tablebtn"
                                                onclick="modal_open(1)"
                                            >
                                                수정
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>회원 추가정보 입력</td>
                                        <td>현지의사회원</td>
                                        <td>
                                            <span className="green">
                                                + 100P
                                            </span>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascipt:void(0)"
                                                className="tablebtn"
                                                onclick="modal_open(1)"
                                            >
                                                수정
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>
                                            친구초대 가입 후 결제 시 결제금액
                                        </td>
                                        <td>현지의사회원 / 영업사원</td>
                                        <td>
                                            <span className="green">+ 10%</span>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascipt:void(0)"
                                                className="tablebtn"
                                                onclick="modal_open(1)"
                                            >
                                                수정
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>의료질문 등록</td>
                                        <td>현지의사회원</td>
                                        <td>
                                            <span className="red">- 100P</span>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascipt:void(0)"
                                                className="tablebtn"
                                                onclick="modal_open(1)"
                                            >
                                                수정
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

export default KmediPointMng;
