import {
    CommonConsole,
    CommonErrModule,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import useConfirm from "hook/useConfirm";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import UserInfoComponent from "./detailModalComponents/UserInfoComponent";
import ProfileInfoComponent from "./detailModalComponents/ProfileInfoComponent";
import ManagerMemoComponent from "./detailModalComponents/ManagerMemoComponent";

const KmediCreatorDetailModalMain = (props) => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const handleNeedUpdate = props.handleNeedUpdate;

    const [userData, setUserData] = useState({});

    useEffect(() => {
        // console.log("modData", modData);
        parseUserData();
    }, []);

    const parseUserData = () => {
        const desc = modData.creator_desc;

        // 정규 표현식을 사용하여 필요한 정보 추출
        const regex = /UserIdx : (\d+), UserId : ([^)]+)/;
        const match = desc.match(regex);

        if (match) {
            // 추출된 정보를 객체로 저장
            const userObj = {
                UserIdx: parseInt(match[1], 10),
                UserId: match[2].trim(),
            };

            getUserData(userObj);
            // console.log(userObj); // 결과 객체 출력
        } else {
            console.log("문자열에서 정보를 추출할 수 없습니다.");
        }
    };

    const getUserData = (userObj) => {
        setIsSpinner(true);

        const userIdx = String(userObj.UserIdx);

        // account/v1/user/info/{user_idx}
        // GET
        const url = apiPath.api_user_info + `/${userIdx}`;
        const data = {};

        // 파라미터
        const restParams = {
            method: "get",
            url: url,
            data: data,
            err: err,
            callback: (res) => responsLogic(res),
        };

        CommonRest(restParams);

        const responsLogic = (res) => {
            let result_code = res.headers.result_code;
            let result_info = res.data.result_info;

            // 성공
            if (result_code === successCode.success) {
                setIsSpinner(false);

                console.log(result_info);
                setUserData(result_info);
            }
            // 에러
            else {
                CommonConsole("log", res);

                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: res.headers.result_message_ko,
                });
            }
        };
    };

    return (
        <>
            <div className="con_area">
                <div className="kmedi kmedi_member_wrap">
                    <h3 className="h_title">
                        {modData.creator_nm} ({modData.creator_id})
                    </h3>

                    {/* 회원정보 */}
                    {Object.keys(userData).length !== 0 && (
                        <UserInfoComponent userData={userData} />
                    )}

                    {/* 프로필정보 */}
                    {Object.keys(userData).length !== 0 && (
                        <ProfileInfoComponent userData={userData} />
                    )}

                    <div className="kmedi_member_box">
                        <div className="kmedi_member_sub">
                            <div className="title_flex_wrap">
                                <h5>정산계좌</h5>
                                <Link
                                    href="javascript:void(0)"
                                    className="subbtn on"
                                    onClick="modal_open(2)"
                                >
                                    계좌 등록
                                </Link>
                            </div>
                            <table className="table_a member_table">
                                <thead>
                                    <tr>
                                        <th>은행명</th>
                                        <th>계좌번호</th>
                                        <th>예금주</th>
                                        <th>수정</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>하나은행</td>
                                        <td>000-00-000000</td>
                                        <td>서지은</td>
                                        <td>
                                            <Link
                                                href="javascript:void(0)"
                                                className="tablebtn"
                                                onClick="modal_open(2)"
                                            >
                                                수정
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="kmedi_member_box">
                        <ul className="kmedi_member_datail_tab">
                            <li id="tab01" className="on">
                                의료Q&A(00)
                            </li>
                            <li id="tab02" className="">
                                등록된 컨텐츠(00)
                            </li>
                        </ul>
                        <div className="kmedi_member_datail_tabbox">
                            <div className="tabbox tab01_box">
                                <h5>
                                    의료Q&A <span>총 38건</span>
                                </h5>
                                <table className="table_a member_table">
                                    <thead>
                                        <tr>
                                            <th>등록일시</th>
                                            <th>답변상태</th>
                                            <th>질문제목</th>
                                            <th>등록자</th>
                                            <th>컨텐츠 제목</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>23.04.03 18:35</td>
                                            <td>
                                                <span className="wait">
                                                    답변대기
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    href="kmedi_qna_detail.html"
                                                    className="default_a"
                                                >
                                                    수술영상에 대해서 문의
                                                    드립니다.
                                                </Link>
                                            </td>
                                            <td>olivia</td>
                                            <td>
                                                <Link
                                                    href="kmedi_content_detail.html"
                                                    className="default_a"
                                                >
                                                    액상 세포 검사
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>23.04.03 18:35</td>
                                            <td>
                                                <span className="wait">
                                                    답변대기
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    href="kmedi_qna_detail.html"
                                                    className="default_a"
                                                >
                                                    수술영상에 대해서 문의
                                                    드립니다.
                                                </Link>
                                            </td>
                                            <td>olivia</td>
                                            <td>
                                                <Link
                                                    href="kmedi_content_detail.html"
                                                    className="default_a"
                                                >
                                                    액상 세포 검사
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>23.04.03 18:35</td>
                                            <td>
                                                <span>답변완료</span>
                                            </td>
                                            <td>
                                                <Link
                                                    href="kmedi_qna_detail.html"
                                                    className="default_a"
                                                >
                                                    수술영상에 대해서 문의
                                                    드립니다.
                                                </Link>
                                            </td>
                                            <td>olivia</td>
                                            <td>
                                                <Link
                                                    href="kmedi_content_detail.html"
                                                    className="default_a"
                                                >
                                                    액상 세포 검사
                                                </Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="tabbox tab02_box">
                                <h5>
                                    등록된컨텐츠 <span>총 38건</span>
                                </h5>
                                <table className="table_a member_table">
                                    <thead>
                                        <tr>
                                            <th>등록일</th>
                                            <th>컨텐츠 구분</th>
                                            <th>컨텐츠 상태</th>
                                            <th>컨텐츠 이름</th>
                                            <th>카테고리</th>
                                            <th>의료Q&A</th>
                                            <th>판매가격</th>
                                            <th>조회수</th>
                                            <th>판매수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>23.04.03</td>
                                            <td>일반</td>
                                            <td>
                                                <span>판매승인대기</span>
                                            </td>
                                            <td>
                                                <Link
                                                    href="kmedi_content_detail.html"
                                                    className="default_a"
                                                >
                                                    액상 세포 검사
                                                </Link>
                                            </td>
                                            <td>#치과</td>
                                            <td>
                                                <Link
                                                    href=""
                                                    className="default_a"
                                                >
                                                    1건
                                                </Link>
                                            </td>
                                            <td>23,000원</td>
                                            <td>324</td>
                                            <td>45건</td>
                                        </tr>
                                        <tr>
                                            <td>23.04.03</td>
                                            <td>일반</td>
                                            <td>
                                                <span className="wait">
                                                    판매중단
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    href="kmedi_content_detail.html"
                                                    className="default_a"
                                                >
                                                    액상 세포 검사
                                                </Link>
                                            </td>
                                            <td>#치과</td>
                                            <td>
                                                <Link
                                                    href=""
                                                    className="default_a"
                                                >
                                                    1건
                                                </Link>
                                            </td>
                                            <td>-</td>
                                            <td>324</td>
                                            <td>45건</td>
                                        </tr>
                                        <tr>
                                            <td>23.04.03</td>
                                            <td>일반</td>
                                            <td>
                                                <span className="sucsess">
                                                    판매승인
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    href="kmedi_content_detail.html"
                                                    className="default_a"
                                                >
                                                    액상 세포 검사
                                                </Link>
                                            </td>
                                            <td>#치과</td>
                                            <td>
                                                <Link
                                                    href=""
                                                    className="default_a"
                                                >
                                                    1건
                                                </Link>
                                            </td>
                                            <td>23,000원</td>
                                            <td>324</td>
                                            <td>45건</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="tabbox tab03_box">
                                <h5>
                                    1:1문의 <span>총 38건</span>
                                </h5>
                                <table className="table_a member_table">
                                    <thead>
                                        <tr>
                                            <th>등록일시</th>
                                            <th>답변상태</th>
                                            <th>답변완료 일시</th>
                                            <th>질문제목</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>23.04.03 18:35</td>
                                            <td>
                                                <span className="wait">
                                                    답변대기
                                                </span>
                                            </td>
                                            <td>-</td>
                                            <td>
                                                <Link
                                                    href="kmedi_inquiry_detail.html"
                                                    className="default_a"
                                                >
                                                    포인트를 복구할 수 있을까요?
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>23.04.03 18:35</td>
                                            <td>
                                                <span className="wait">
                                                    답변대기
                                                </span>
                                            </td>
                                            <td>-</td>
                                            <td>
                                                <Link
                                                    href="kmedi_inquiry_detail.html"
                                                    className="default_a"
                                                >
                                                    포인트를 복구할 수 있을까요?
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>23.04.03 18:35</td>
                                            <td>
                                                <span>답변완료</span>
                                            </td>
                                            <td>23.04.04 18:35</td>
                                            <td>
                                                <Link
                                                    href="kmedi_inquiry_detail.html"
                                                    className="default_a"
                                                >
                                                    포인트를 복구할 수 있을까요?
                                                </Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="tabbox tab04_box">
                                <h5>
                                    초대한 회원 <span>총 38건</span>
                                </h5>
                                <table className="table_a member_table">
                                    <thead>
                                        <tr>
                                            <th>가입일시</th>
                                            <th>회원상태</th>
                                            <th>초대받은 회원</th>
                                            <th>결제금액</th>
                                            <th>적립포인트</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>23.04.03 18:35</td>
                                            <td>
                                                <span className="sucsess">
                                                    결제완료
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    href="kmedi_inquiry_detail.html"
                                                    className="default_a"
                                                >
                                                    홍길동
                                                </Link>
                                            </td>
                                            <td>$1,000</td>
                                            <td>100P (10%)</td>
                                        </tr>
                                        <tr>
                                            <td>23.04.03 18:35</td>
                                            <td>회원가입</td>
                                            <td>
                                                <Link
                                                    href="kmedi_inquiry_detail.html"
                                                    className="default_a"
                                                >
                                                    홍길동
                                                </Link>
                                            </td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagenation">
                                페이지네이션 여기에
                            </div>
                        </div>
                    </div>

                    {/* 관리자메모 */}
                    <ManagerMemoComponent modData={modData} />
                </div>

                <div className="subbtn_box">
                    <Link
                        href="kmedi_member_local.html"
                        className="modal_btn subbtn off"
                    >
                        목록으로
                    </Link>
                    <Link
                        href="javascript:alert('정말 강제탈퇴 하시겠습니까? ');"
                        className="subbtn del"
                    >
                        강제탈퇴
                    </Link>
                    <Link
                        href="javascript:alert('저장되었습니다.');"
                        className="subbtn on"
                    >
                        저장
                    </Link>
                </div>
            </div>
        </>
    );
};

export default KmediCreatorDetailModalMain;
