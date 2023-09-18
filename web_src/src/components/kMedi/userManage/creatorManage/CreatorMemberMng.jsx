const CreatorMemberMng = () => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>회원 관리 - 한국 크리에이터</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_top_wrap">
                        <div className="kmedi_top_box">
                            <div className="kmedi_top">
                                <h5>기간조회</h5>
                                <a href="" className="kmedi_top_btn">
                                    7일
                                </a>
                                <a href="" className="kmedi_top_btn">
                                    14일
                                </a>
                                <a href="" className="kmedi_top_btn">
                                    30일
                                </a>
                                <a href="" className="kmedi_top_btn">
                                    3개월
                                </a>
                                <input type="date" className="input" /> ~{" "}
                                <input type="date" className="input" />
                            </div>
                            <div className="kmedi_top">
                                <h5>회원상태</h5>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_state1"
                                        name="member_state"
                                    />
                                    <label for="member_state1">전체</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_state2"
                                        name="member_state"
                                    />
                                    <label for="member_state2">정상</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="member_state3"
                                        name="member_state"
                                    />
                                    <label for="member_state3">탈퇴</label>
                                </div>
                            </div>
                            <div className="kmedi_top">
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">회원이름</option>
                                    <option value="">병원이름</option>
                                    <option value="">이메일</option>
                                    <option value="">핸드폰</option>
                                </select>
                                <input type="text" className="input" />
                                <a href="" className="subbtn off">
                                    검색
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="adm_statistics">
                        <div>
                            <h5>회원</h5>
                            <ul>
                                <li>
                                    <a href="">
                                        전체 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        병원그룹 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        병원그룹 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        영업사원 <strong>00</strong>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        한국 크리에이터 <strong>00</strong>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="kmedi_add_btn">
                        <div>
                            <a
                                href="javascript:void(0)"
                                className="subbtn on"
                                onclick="modal_open(1);"
                            >
                                회원등록
                            </a>
                            <a href="" className="subbtn on">
                                엑셀 다운로드
                            </a>
                        </div>
                    </div>
                    <div className="adm_table">
                        <table className="table_a">
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" />
                                    </th>
                                    <th>가입일</th>
                                    <th>상태</th>
                                    <th>구분</th>
                                    <th>이름</th>
                                    <th>직급</th>
                                    <th>연락처</th>
                                    <th>이메일</th>
                                    <th>소속병원</th>
                                    <th>진료과목</th>
                                    <th>의료Q&A</th>
                                    <th>상세보기</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>23-05-30</td>
                                    <td>정상</td>
                                    <td>개인의사</td>
                                    <td>임은지</td>
                                    <td>주임</td>
                                    <td>010-0000-0000</td>
                                    <td>ej.lim@hicomp.net</td>
                                    <td>hicompint</td>
                                    <td>디자인팀</td>
                                    <td>
                                        <a href="" className="default_a">
                                            1건
                                        </a>
                                    </td>
                                    <td>
                                        <a
                                            href="kmedi_member_creator_detail.html"
                                            className="tablebtn"
                                        >
                                            상세보기
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="pagenation"></div>
                </div>
            </div>
        </>
    );
};

export default CreatorMemberMng;
