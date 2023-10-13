import { Link } from "react-router-dom";

const KmediContentsMng = (props) => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>컨텐츠 관리</h3>
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
                                <h5>컨텐츠 구분</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_gubun1"
                                        name="content_gubun"
                                    />
                                    <label for="content_gubun1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_gubun2"
                                        name="content_gubun"
                                    />
                                    <label for="content_gubun2">무료</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_gubun3"
                                        name="content_gubun"
                                    />
                                    <label for="content_gubun3">유료</label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <h5>컨텐츠 상태</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_status1"
                                        name="content_status"
                                    />
                                    <label for="content_status1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_status2"
                                        name="content_status"
                                    />
                                    <label for="content_status2">
                                        판매승인 대기
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_status3"
                                        name="content_status"
                                    />
                                    <label for="content_status3">
                                        판매승인
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_status4"
                                        name="content_status"
                                    />
                                    <label for="content_status4">
                                        판매중단
                                    </label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <h5>추천영상</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_recommend1"
                                        name="content_recommend"
                                    />
                                    <label for="content_recommend1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_recommend2"
                                        name="content_recommend"
                                    />
                                    <label for="content_recommend2">입력</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="content_recommend3"
                                        name="content_recommend"
                                    />
                                    <label for="content_recommend3">
                                        미입력
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="kmedi_top_box">
                            <div className="kmedi_top">
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">컨텐츠 이름</option>
                                    <option value="">등록자</option>
                                </select>
                                <input type="text" className="input" />
                                <Link href="" className="subbtn off">
                                    검색
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="adm_notifi">
                        <div>
                            <p>
                                판매승인 대기가{" "}
                                <strong className="red">00</strong>건 있습니다.
                            </p>
                            <p>
                                원본영상이 수정된 컨텐츠가{" "}
                                <strong className="red">00</strong>건 있습니다.
                            </p>
                            <p>
                                미답변 의료Q&A가{" "}
                                <strong className="red">00</strong>건 있습니다.
                            </p>
                        </div>
                    </div>
                    <div className="adm_statistics">
                        <div>
                            <h5>컨텐츠</h5>
                            <ul>
                                <li>
                                    <Link href="">
                                        전체 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        일반 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        유료 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        판매승인 대기 <strong>00개</strong>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="">
                                        판매중단 <strong>00개</strong>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="kmedi_add_btn">
                        <div>
                            <Link
                                href="kmedi_content_insert.html"
                                className="subbtn on"
                            >
                                컨텐츠등록
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
                                        <th>등록일</th>
                                        <th>컨텐츠 구분</th>
                                        <th>컨텐츠 상태</th>
                                        <th>추천영상</th>
                                        <th className="content_modify_label">
                                            &nbsp;
                                        </th>
                                        <th>컨텐츠 이름</th>
                                        <th>카테고리</th>
                                        <th>등록자</th>
                                        <th>의료Q&A</th>
                                        <th>판매가격</th>
                                        <th>조회수</th>
                                        <th>판매수</th>
                                        <th>수정하기</th>
                                        <th>상세보기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>23.05.30</td>
                                        <td>무료</td>
                                        <td>판매승인 대기</td>
                                        <td>-</td>
                                        <td className="content_modify_label content_modify_label_on"></td>
                                        <td>액상 세포 검사</td>
                                        <td>#치과</td>
                                        <td>
                                            <Link
                                                href="kmedi_member_creator_detail.html"
                                                className="default_a"
                                            >
                                                홍길동
                                            </Link>
                                        </td>
                                        <td>
                                            <Link href="" className="default_a">
                                                1건
                                            </Link>
                                        </td>
                                        <td>23,000원</td>
                                        <td>324</td>
                                        <td>42건</td>
                                        <td>
                                            <Link
                                                href="kmedi_content_modify.html"
                                                className="tablebtn"
                                            >
                                                컨텐츠 수정
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href="kmedi_content_detail.html"
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
                                        <td>무료</td>
                                        <td>
                                            <span className="sucess">
                                                판매승인
                                            </span>
                                        </td>
                                        <td>-</td>
                                        <td className="content_modify_label"></td>
                                        <td>액상 세포 검사 어쩌고 저쩌고</td>
                                        <td>#치과</td>
                                        <td>
                                            <Link
                                                href="kmedi_member_creator_detail.html"
                                                className="default_a"
                                            >
                                                홍길동
                                            </Link>
                                        </td>
                                        <td>
                                            <Link href="" className="default_a">
                                                1건
                                            </Link>
                                        </td>
                                        <td>23,000원</td>
                                        <td>324</td>
                                        <td>42건</td>
                                        <td>
                                            <Link
                                                href="kmedi_content_modify.html"
                                                className="tablebtn"
                                            >
                                                컨텐츠 수정
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                href="kmedi_content_detail.html"
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

export default KmediContentsMng;
