import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const UserInfoComponent = (props) => {
    const userData = props.userData;

    const userNameInput = useRef(null);
    const mobile1Input = useRef(null);
    const mobile2Input = useRef(null);
    const mobile3Input = useRef(null);
    const emailInput = useRef(null);
    const pwInput = useRef(null);
    const organizationInput = useRef(null);
    // const pwInput = useRef(null);
    const specializedInput = useRef(null);

    useEffect(() => {
        setDefaultValue();
    }, []);

    // 기본 세팅 하기
    const setDefaultValue = () => {
        userNameInput.current.value = userData.user_name_ko;
        mobile1Input.current.value = userData.mobile1;
        mobile2Input.current.value = userData.mobile2;
        mobile3Input.current.value = userData.mobile3;
        emailInput.current.value = userData.user_id;
        // pwInput.current.value =
        organizationInput.current.value = userData.organization_name_ko ?? "";
        specializedInput.current.value = userData.specialized_name_ko ?? "";
    };

    return (
        <>
            <div className="kmedi_member_box">
                <h5>회원정보 수정</h5>
                <table className="table_a member_table">
                    <thead>
                        <tr>
                            <th>회원상태</th>
                            <th>가입일</th>
                            <th>구분</th>
                            <th>이름</th>
                            <th>연락처</th>
                            <th>이메일 (아이디)</th>
                            <th>비밀번호</th>
                            <th>소속병원</th>
                            <th>진료분야</th>
                            <th>포인트</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{userData.user_status}</td>
                            <td>{userData.reg_dttm.split(" ")[0]}</td>
                            <td>{userData.user_role}</td>
                            <td>
                                <input
                                    type="name"
                                    className="input"
                                    ref={userNameInput}
                                />
                            </td>
                            <td>
                                <input
                                    type="tel"
                                    className="input w80"
                                    id="phone_num1"
                                    ref={mobile1Input}
                                    readOnly
                                />
                                &nbsp;-&nbsp;
                                <input
                                    type="tel"
                                    className="input w80"
                                    id="phone_num2"
                                    ref={mobile2Input}
                                />
                                &nbsp;-&nbsp;
                                <input
                                    type="tel"
                                    className="input w80"
                                    id="phone_num3"
                                    ref={mobile3Input}
                                />
                            </td>
                            <td className="long">
                                <input
                                    type="email"
                                    className="input w180"
                                    ref={emailInput}
                                />
                            </td>
                            <td>
                                <input
                                    type="password"
                                    className="input"
                                    ref={pwInput}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="input"
                                    ref={organizationInput}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="input"
                                    ref={specializedInput}
                                />
                            </td>
                            <td>
                                1,365,468{" "}
                                <Link
                                    href="javascript:void()"
                                    className="tablebtn"
                                    onClick="modal_open(1)"
                                >
                                    포인트 이력조회
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserInfoComponent;
