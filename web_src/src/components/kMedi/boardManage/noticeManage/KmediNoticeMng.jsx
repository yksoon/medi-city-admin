import { Link } from "react-router-dom";

const KmediNoticeMng = (props) => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>공지사항</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_top_wrap">
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
                    <div className="kmedi_add_btn">
                        <div>
                            <Link
                                href="javascipt:void(0)"
                                className="subbtn on"
                                onclick="modal_open(1)"
                            >
                                글쓰기
                            </Link>
                            <Link
                                href="javascipt:void(0)"
                                className="subbtn off"
                            >
                                삭제
                            </Link>
                            {/* <Link href="" className="subbtn on">엑셀 다운로드</Link> */}
                        </div>
                    </div>
                    <div className="kmedi_content">
                        <div className="kmedi_notice">
                            <div className="adm_table">
                                <table className="table_a">
                                    <colgroup>
                                        <col width="5%" />
                                        <col width="5%" />
                                        <col width="*" />
                                        <col width="20%" />
                                        <col width="10%" />
                                        <col width="10%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>
                                                <input type="checkbox" />
                                            </th>
                                            <th>번호</th>
                                            <th>제목</th>
                                            <th>파일</th>
                                            <th>조회수</th>
                                            <th>등록일</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input type="checkbox" />
                                            </td>
                                            <td>1</td>
                                            <td>공지사항 제목</td>
                                            <td>
                                                <div className="file_wrap">
                                                    <Link href="">
                                                        <img
                                                            src="img/common/file.svg"
                                                            alt=""
                                                        />{" "}
                                                        파일이름1.docx
                                                    </Link>
                                                    <Link href="">
                                                        <img
                                                            src="img/common/file.svg"
                                                            alt=""
                                                        />{" "}
                                                        파일이름2.pdf
                                                    </Link>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="viewer_wrap">
                                                    <img
                                                        src="img/common/user_icon.png"
                                                        alt=""
                                                    />{" "}
                                                    16
                                                </div>
                                            </td>
                                            <td>2023-08-16</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="pagenation"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KmediNoticeMng;
