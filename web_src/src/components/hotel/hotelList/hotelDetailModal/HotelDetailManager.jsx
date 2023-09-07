import { CommonErrModule } from "common/js/Common";
import useAlert from "hook/useAlert";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";

const HotelDetailManager = (props) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [managerCount, setManagerCount] = useState(1);

    const managerList = props.managerList;
    const handleManagerList = props.handleManagerList;

    const handelManagerCount = (params) => {
        if (params === "add") {
            if (managerCount < 10) {
                setManagerCount(managerCount + 1);
            }
        } else if (params === "remove") {
            if (managerCount > 0) {
                let list = managerList;
                list = list.filter((e) => e.idx !== managerCount);

                console.log("111111111", list);
                handleManagerList(list);

                setManagerCount(managerCount - 1);
            }
        } else {
            return;
        }
    };

    const managerRender = () => {
        let result = [];
        for (let i = 0; i < managerCount; i++) {
            result.push(
                <ManagerTable
                    key={`manager_${i + 1}`}
                    idx={i + 1}
                    managerList={managerList}
                    handleManagerList={handleManagerList}
                />
            );
        }
        return result;
    };

    return (
        <>
            <div className="hotel_box">
                <h4 className="mo_subtitle">담당자 정보 </h4>

                {managerCount > 0 && managerRender()}

                <div className="subbtn_box">
                    <Link
                        href=""
                        className="subbtn off"
                        onClick={() => handelManagerCount("add")}
                    >
                        담당자 추가
                    </Link>
                    <Link
                        href=""
                        className="subbtn del"
                        onClick={() => handelManagerCount("remove")}
                    >
                        삭제
                    </Link>
                    {/* <a
                        // href="javascript:alert('저장되었습니다.');"
                        className="subbtn on"
                    >
                        저장
                    </a> */}
                </div>
            </div>
        </>
    );
};

const ManagerTable = (props) => {
    const idx = props.idx;
    let managerData = { idx: idx };

    const managerList = props.managerList;
    const handleManagerList = props.handleManagerList;

    const handleInput = (e) => {
        const id = e.target.id;

        let list = managerList;
        list = list.filter((e) => e.idx !== idx);

        let insertData = managerList.filter((e) => e.idx === idx)[0];

        // const setInsertData = (insertData, param, e) => {
        //     insertData = {
        //         ...insertData,
        //         `${param}`: e.target.value,
        //     };

        //     return insertData
        // }

        switch (id) {
            case "person_name":
                insertData = {
                    ...insertData,
                    personName: e.target.value,
                };
                break;

            case "position":
                insertData = {
                    ...insertData,
                    position: e.target.value,
                };
                break;

            case "email":
                insertData = {
                    ...insertData,
                    email: e.target.value,
                };
                break;

            case "phone":
                insertData = {
                    ...insertData,
                    phone: e.target.value,
                };
                break;

            case "memo":
                insertData = {
                    ...insertData,
                    memo: e.target.value,
                };
                break;

            default:
                break;
        }

        managerData = { ...managerData, ...insertData };
        list = [...list, managerData];

        // console.log(list);
        handleManagerList(list);
    };

    return (
        <table className="table_bb">
            <colgroup>
                <col width="20%" />
                <col width="30%" />
                <col width="20%" />
                <col width="30%" />
            </colgroup>
            <tbody>
                {/* <tr>
                    <th>번호</th>
                    <td>{idx}</td>
                </tr> */}
                <tr>
                    <th>이름</th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            id="person_name"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                        />
                    </td>
                    <th>직급·직책</th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            id="position"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                        />
                    </td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            id="email"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                        />
                    </td>
                    <th>연락처</th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            id="phone"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                        />
                    </td>
                </tr>
                <tr>
                    <th>메모</th>
                    <td colSpan="3">
                        <input
                            type="text"
                            className="input wp100"
                            id="memo"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default HotelDetailManager;
