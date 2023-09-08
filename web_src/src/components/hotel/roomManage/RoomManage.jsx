import { CommonErrModule, CommonModal, CommonNotify } from "common/js/Common";
import useAlert from "hook/useAlert";
import useConfirm from "hook/useConfirm";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";

const RoomManage = () => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    // 객실 상세 데이터
    const [modData, setModData] = useState({});

    // 모달창 닫기
    const handleModalClose = () => {
        CommonNotify({
            type: "confirm",
            hook: confirm,
            message: "입력된 정보가 초기화 됩니다. 창을 닫으시겠습니까?",
            callback: () => close(),
        });

        const close = () => {
            setModalTitle("");
            setModData({});
            setIsOpen(false);
        };
    };

    // 리스트 새로고침
    const handleNeedUpdate = () => {
        setModalTitle("");
        setIsOpen(false);
        setIsNeedUpdate(!isNeedUpdate);
    };

    // 호텔 신규 등록
    const regRoom = () => {
        setModalTitle("객실 신규 등록");
        setIsOpen(true);
    };

    return (
        <>
            <></>
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
                                    onClick={(e) => regRoom()}
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
            <CommonModal
                isOpen={isOpen}
                title={modalTitle}
                width={"1400"}
                handleModalClose={handleModalClose}
                component={"RoomModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
                // modUserData={modUserData}
            />
        </>
    );
};

export default RoomManage;
