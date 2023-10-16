import { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

const UserInfoComponent = forwardRef((props, ref) => {
    const userData = props.userData;

    const selectCountryOptions = props.selectCountryOptions;
    const handleCountrySelect = props.handleCountrySelect;

    // const userNameInput = useRef(null);
    // const mobile1Input = useRef(null);
    // const mobile2Input = useRef(null);
    // const mobile3Input = useRef(null);
    // const emailInput = useRef(null);
    // const pwInput = useRef(null);
    // const organizationInput = useRef(null);
    // // const pwInput = useRef(null);
    // const specializedInput = useRef(null);

    const {
        userNameInput,
        selectCountry,
        mobile1Input,
        mobile2Input,
        mobile3Input,
        emailInput,
        // pwInput,
        organizationInput,
        specializedInput,
    } = ref;

    useEffect(() => {
        selectCountryOptions.length !== 0 && setDefaultValue();
    }, [selectCountryOptions]);

    // 기본 세팅 하기
    const setDefaultValue = () => {
        userNameInput.current.value = userData.user_name_ko;
        mobile1Input.current.value = userData.mobile1;
        mobile2Input.current.value = userData.mobile2;
        mobile3Input.current.value = userData.mobile3;
        emailInput.current.value = userData.user_id;
        organizationInput.current.value = userData.organization_name_ko ?? "";
        specializedInput.current.value = userData.specialized_name_ko ?? "";

        handleCountrySelect(userData.inter_phone_number);
    };

    // 국적 SELECT 스타일
    const customStyles = {
        control: () => ({
            width: "inherit",
            height: "inherit",
            lineHeight: "28px",
        }),
        valueContainer: () => ({
            height: "28px",
            lineHeight: "28px",
            padding: "0",
            display: "block",
        }),
        indicatorsContainer: () => ({
            display: "none",
        }),
        input: () => ({
            height: "inherit",
            lineHeight: "28px",
            gridArea: "0",
            display: "block",
            position: "absolute",
            top: "0",
            width: "85%",
        }),
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
                            <th>국가번호</th>
                            <th>연락처</th>
                            <th>이메일</th>
                            {/* <th>비밀번호</th> */}
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
                                    readOnly
                                    disabled={true}
                                />
                            </td>
                            <td>
                                <Select
                                    className="select w130"
                                    options={selectCountryOptions}
                                    defaultValue={
                                        userData
                                            ? selectCountryOptions.find(
                                                  (e) =>
                                                      e.value ===
                                                      userData.inter_phone_number
                                              )
                                            : selectCountryOptions.find(
                                                  (e) => e.value === "82"
                                              )
                                    }
                                    key={
                                        userData
                                            ? selectCountryOptions.find(
                                                  (e) =>
                                                      e.value ===
                                                      userData.inter_phone_number
                                              )
                                            : selectCountryOptions.find(
                                                  (e) => e.value === "82"
                                              )
                                    }
                                    styles={customStyles}
                                    onChange={(e) => {
                                        handleCountrySelect(e.value);
                                    }}
                                    ref={selectCountry}
                                />
                            </td>
                            <td>
                                <input
                                    type="tel"
                                    className="input w80"
                                    id="phone_num1"
                                    ref={mobile1Input}
                                    disabled={true}
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
                            {/* <td>
                                <input
                                    type="password"
                                    className="input"
                                    ref={pwInput}
                                />
                            </td> */}
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
});

export default UserInfoComponent;
