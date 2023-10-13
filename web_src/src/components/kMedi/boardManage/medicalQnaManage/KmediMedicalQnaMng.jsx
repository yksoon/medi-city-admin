import { Link } from "react-router-dom";

const KmediMedicalQnaMng = (props) => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>의료Q&A</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_top_wrap">
                        <div className="kmedi_top_box">
                            <div className="kmedi_top">
                                <h5>상태</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="inquiry_status1"
                                        name="inquiry_status"
                                    />
                                    <label for="inquiry_status1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="inquiry_status2"
                                        name="inquiry_status"
                                    />
                                    <label for="inquiry_status2">
                                        답변대기
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="inquiry_status3"
                                        name="inquiry_status"
                                    />
                                    <label for="inquiry_status3">
                                        답변완료
                                    </label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">제목</option>
                                    <option value="">질문자</option>
                                    <option value="">담당 크리에이터</option>
                                </select>
                                <input type="text" className="input" />
                                <Link href="" className="subbtn off">
                                    검색
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="adm_statistics">
                        <div>
                            <h5>의료Q&A</h5>
                            <ul>
                                <li>
                                    <Link href="">
                                        전체 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        답변대기 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        답변완료 <strong>00개</strong>
                                    </Link>
                                </li>
                            </ul>
                        </div>
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
                                        <th>등록일시</th>
                                        <th>상태</th>
                                        <th>답변완료 일시</th>
                                        <th>질문자</th>
                                        <th>질문제목</th>
                                        <th>담당 크리에이터</th>
                                        <th>컨텐츠 제목</th>
                                        <th>상세보기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>23.05.30 18:31</td>
                                        <td>
                                            <span className="red">
                                                답변대기
                                            </span>
                                        </td>
                                        <td>-</td>
                                        <td>구나완</td>
                                        <td>
                                            수술 영상에 대해서 문의드립니다.
                                        </td>
                                        <td>
                                            <Link
                                                href="kmedi_member_creator_detail.html"
                                                className="default_a"
                                            >
                                                원유철 원장
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href="kmedi_content_modify.html"
                                                className="default_a"
                                            >
                                                치과치료 방법
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascript:void(0)"
                                                className="tablebtn blue"
                                                onclick="modal_open(1)"
                                            >
                                                답변하기
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>23.05.30 18:31</td>
                                        <td>답변완료</td>
                                        <td>-</td>
                                        <td>구나완</td>
                                        <td>
                                            수술 영상에 대해서 문의드립니다.
                                        </td>
                                        <td>
                                            <Link
                                                href="kmedi_member_creator_detail.html"
                                                className="default_a"
                                            >
                                                원유철 원장
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href="kmedi_content_modify.html"
                                                className="default_a"
                                            >
                                                치과치료 방법
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascript:void(0)"
                                                className="tablebtn blue"
                                                onclick="modal_open(1)"
                                            >
                                                답변하기
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

export default KmediMedicalQnaMng;
