import { Link } from "react-router-dom";

const KmediBannerMng = (props) => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>배너관리</h3>
                </div>
                <div className="con_area">
                    <div className="kmedi_add_btn">
                        <div>
                            <Link
                                href="javascipt:void(0)"
                                className="subbtn on"
                                onclick="modal_open(1)"
                            >
                                추가
                            </Link>
                            <Link
                                href="javascipt:void(0)"
                                className="subbtn off"
                            >
                                삭제
                            </Link>
                        </div>
                    </div>
                    <div className="kmedi_content">
                        <div className="kmedi_banner">
                            <div className="adm_table">
                                <table className="table_a">
                                    <colgroup>
                                        <col width="5%" />
                                        <col width="5%" />
                                        <col width="20%" />
                                        <col width="20%" />
                                        <col width="*" />
                                        <col width="10%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>
                                                <input type="checkbox" />
                                            </th>
                                            <th>정렬순서</th>
                                            <th>이미지</th>
                                            <th>배너이름</th>
                                            <th>배너설명</th>
                                            <th>수정</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input type="checkbox" />
                                            </td>
                                            <td>1</td>
                                            <td className="banner_thumb_td">
                                                <img
                                                    src="img/hotel/hotel01.png"
                                                    alt=""
                                                />
                                            </td>
                                            <td>메인비주얼</td>
                                            <td>배너설명</td>
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
                        </div>
                        <div className="pagenation"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KmediBannerMng;
