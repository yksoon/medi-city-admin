import React from "react";
import { Modal } from "@mui/material";
import { Link } from "react-router-dom";

const RegUserModal = (props) => {
    // { isOpen, title, content, btn, handleModalClose }
    let modalOption = {
        isOpen: props.isOpen,
        title: props.title,
        content: props.content,
        handleModalClose: props.handleModalClose,
    };

    return (
        <>
            <Modal
                open={modalOption.isOpen}
                onClose={modalOption.handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal_wrap" id="modal_wrap">
                    <div className="modal w600" id="modal">
                        <div class="title">
                            <h3>{modalOption.title}</h3>
                        </div>

                        <table className="table_b inner_table">
                            <colgroup>
                                <col width="20%" />
                                <col width="*" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>구분</th>
                                    <td>
                                        <select name="" id="" className="w180">
                                            <option defaultValue="">
                                                일반
                                            </option>
                                            <option defaultValue="">
                                                관리자
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        아이디 <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="email"
                                            className="input w180"
                                            autoFocus
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        비밀번호 <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="password"
                                            className="input w180"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        비밀번호 확인{" "}
                                        <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="password"
                                            className="input w180"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        성명 (국문){" "}
                                        <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="name"
                                            className="input w120"
                                            placeholder="성"
                                        />
                                        <input
                                            type="name"
                                            className="input w120"
                                            placeholder="이름"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        성명 (영문){" "}
                                        <span className="red">*</span>
                                    </th>
                                    <td>
                                        <input
                                            type="name"
                                            className="input w120"
                                            placeholder="First name"
                                        />
                                        <input
                                            type="name"
                                            className="input w120"
                                            placeholder="Last name"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        휴대전화 <span className="red">*</span>
                                    </th>
                                    <td>
                                        <div id="phone_num" className="m0">
                                            <input
                                                type="tel"
                                                className="input w120"
                                                id="phone_num1"
                                                defaultValue="010"
                                                readOnly
                                            />
                                            <input
                                                type="tel"
                                                className="input w120"
                                                id="phone_num2"
                                            />
                                            <input
                                                type="tel"
                                                className="input w120"
                                                id="phone_num3"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>면허번호</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="input w180"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>소속 기관</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="input w180"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>전공과</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="input w180"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>전공분야</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="input w180"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="btn_box">
                            <Link className="mainbtn btn01">등록</Link>
                            <Link
                                className="mainbtn btn02"
                                onClick={modalOption.handleModalClose}
                            >
                                취소
                            </Link>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RegUserModal;
