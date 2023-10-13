import { Link } from "react-router-dom";

const KmediCategoryMng = (props) => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>카테고리 관리</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_add_btn">
                        <div>
                            <Link
                                href="javascript:void(0)"
                                className="subbtn on"
                                onclick="modal_open(1)"
                            >
                                신규 카테고리 추가
                            </Link>
                            {/* <Link href="" className="subbtn on">엑셀 다운로드</Link> */}
                        </div>
                    </div>
                    <div className="kmedi_content">
                        <div className="adm_table">
                            <table className="table_a">
                                <colgroup>
                                    <col width="5%" />
                                    <col width="10%" />
                                    <col width="20%" />
                                    <col width="*" />
                                    <col width="10%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>메인노출여부</th>
                                        <th>카테고리명</th>
                                        <th>2차카테고리</th>
                                        <th>수정</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>03</td>
                                        <td>노출</td>
                                        <td>성형외과</td>
                                        <td>
                                            <div className="category_2depth category_2depth_none">
                                                <p>-</p>
                                            </div>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascript:void(0);"
                                                className="tablebtn"
                                                onclick="modal_open(1)"
                                            >
                                                수정
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>02</td>
                                        <td>노출</td>
                                        <td>치과</td>
                                        <td>
                                            <div className="category_2depth">
                                                <p>충치</p>
                                                <p>신경치료</p>
                                                <p>마취통증</p>
                                                <p>임플란트</p>
                                            </div>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascript:void(0);"
                                                className="tablebtn"
                                                onclick="modal_open(1)"
                                            >
                                                수정
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>01</td>
                                        <td>노출</td>
                                        <td>신경외과</td>
                                        <td>
                                            <div className="category_2depth category_2depth_none">
                                                <p>-</p>
                                            </div>
                                        </td>
                                        <td>
                                            <Link
                                                href="javascript:void(0);"
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

export default KmediCategoryMng;
