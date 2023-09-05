const HotelDetailManager = () => {
    return (
        <>
            <div className="hotel_box">
                <h4 className="mo_subtitle">담당자 정보 </h4>
                <table className="table_bb">
                    <colgroup>
                        <col width="20%" />
                        <col width="30%" />
                        <col width="20%" />
                        <col width="30%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>이름</th>
                            <td>
                                <input type="text" className="input wp100" />
                            </td>
                            <th>직급·직책</th>
                            <td>
                                <input type="text" className="input wp100" />
                            </td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td>
                                <input type="text" className="input wp100" />
                            </td>
                            <th>연락처</th>
                            <td>
                                <input type="text" className="input wp100" />
                            </td>
                        </tr>
                        <tr>
                            <th>메모</th>
                            <td colSpan="3">
                                <input type="text" className="input wp100" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="subbtn_box">
                    <a href="" className="subbtn off">
                        담당자 추가
                    </a>
                    <a href="" className="subbtn del">
                        삭제
                    </a>
                    <a
                        // href="javascript:alert('저장되었습니다.');"
                        className="subbtn on"
                    >
                        저장
                    </a>
                </div>
            </div>
        </>
    );
};

export default HotelDetailManager;
