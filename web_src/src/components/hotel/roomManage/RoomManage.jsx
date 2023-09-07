import { Link } from "react-router-dom";

const RoomManage = () => {
    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>객실 관리</h3>
                </div>
                <div className="con_area">
                    <div>
                        <div className="adm_search">
                            <div>
                                <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">이름</option>
                                    <option value="">소속</option>
                                </select>
                                <input type="text" className="input" />
                                <Link href="" className="subbtn off">
                                    검색
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="modal_btn subbtn on"
                                    title="#hotelInsert"
                                    // onclick="modal_open(hotelInsert);"
                                >
                                    객실신규등록
                                </Link>
                                <Link href="" className="subbtn on">
                                    엑셀 다운로드
                                </Link>
                                <Link href="" className="subbtn on">
                                    일괄 업로드
                                </Link>
                            </div>
                        </div>
                        <div className="adm_table">
                            <table className="table_a">
                                <colgroup>
                                    <col width="3%" />
                                    <col width="12%" />
                                    <col width="12%" />
                                    <col width="12%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" />
                                        </th>
                                        <th>호텔명</th>
                                        <th colSpan="2">객실명</th>
                                        <th>객실크기</th>
                                        <th>최소/최대인원</th>
                                        <th>베드타입</th>
                                        <th>베드개수</th>
                                        <th>상세보기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>강릉세인트존스호텔</td>
                                        <td>슈페리어 더블</td>
                                        <td>SUPERIOR DOUBLE</td>
                                        <td>27.44㎡</td>
                                        <td>2/4</td>
                                        <td>퀸</td>
                                        <td>2개</td>
                                        <td>
                                            <Link href="" className="tablebtn">
                                                상세보기
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>라마다 수원 호텔</td>
                                        <td>패밀리</td>
                                        <td>Family</td>
                                        <td>49.44㎡</td>
                                        <td>4/8</td>
                                        <td>킹</td>
                                        <td>2개</td>
                                        <td>
                                            <Link href="" className="tablebtn">
                                                상세보기
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomManage;
