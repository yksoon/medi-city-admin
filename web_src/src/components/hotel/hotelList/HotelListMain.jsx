import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CommonConsole,
    CommonErrModule,
    CommonModal,
    CommonModalChild,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import { successCode } from "common/js/resultCode";
import { hotel_static } from "models/hotel/hotel";
import { Pagination } from "@mui/material";

const HotelListMain = () => {
    const { alert } = useAlert();
    const { confirm } = useConfirm();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalTitlePreview, setModalTitlePreview] = useState("");
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    const [hotelList, setHotelList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [checkItems, setCheckItems] = useState([]);

    // 미리보기 데이터 state
    const [previewData, setPreviewData] = useState({
        previewImg: "",
    });

    // 호텔 상세 데이터
    const [modData, setModData] = useState({});

    useEffect(() => {
        getHotelList(1, 10, "");
    }, [isNeedUpdate]);

    // 호텔 신규 등록
    const regHotel = () => {
        setModalTitle("호텔 신규 등록");
        setIsOpen(true);
    };

    // 호텔 상세보기 모달
    const modHotel = () => {
        setModalTitle("호텔 상세보기");
        setIsOpen(true);
    };

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

    // 미리보기 모달 닫기
    const handleModalClosePreview = () => {
        setModalTitlePreview("");
        setIsOpenPreview(false);
    };

    // 리스트 새로고침
    const handleNeedUpdate = () => {
        setModalTitle("");
        setIsOpen(false);
        setIsNeedUpdate(!isNeedUpdate);
    };

    // 리스트 가져오기
    const getHotelList = (pageNum, pageSize, searchKeyword) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_hotel_list;
        const data = {
            page_num: pageNum,
            page_size: pageSize,
            search_keyword: searchKeyword,
        };

        // 파라미터
        const restParams = {
            method: "post",
            url: url,
            data: data,
            err: err,
            callback: (res) => responsLogic(res),
        };

        CommonRest(restParams);

        const responsLogic = (res) => {
            const result_code = res.headers.result_code;

            // 성공
            if (
                result_code === successCode.success ||
                result_code === successCode.noData
            ) {
                const result_info = res.data.result_info;
                const page_info = res.data.page_info;

                setHotelList(result_info);
                setPageInfo(page_info);

                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    // 페이지네이션 이동
    const handleChange = (e, value) => {
        getHotelList(value, 10, "");
    };

    // 미리보기
    const openPreview = (item) => {
        const data = {
            ...previewData,
            previewImg: item.file_path_enc,
            nameKo: item.name_ko,
            nameEn: item.name_en,
            addr1Ko: item.addr1_ko,
            addr2Ko: item.addr2_ko,
            phone1: item.phone1,
            phone2: item.phone2,
            phone3: item.phone3,
            interPhoneNumber: item.inter_phone_number,
            infoKo: item.info_ko,
            isListPage: true,
        };

        setPreviewData(data);

        setModalTitlePreview("미리보기");
        setIsOpenPreview(true);
    };

    // 상세보기
    const openDetail = (idx) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_hotel_detail + idx;
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
            const result_code = res.headers.result_code;

            // 성공
            if (
                result_code === successCode.success ||
                result_code === successCode.noData
            ) {
                const result_info = res.data.result_info;

                setModData(result_info);

                modHotel();
                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    // 체크박스 단일 선택
    const handleSingleCheck = (checked, id) => {
        if (checked) {
            // 단일 선택 시 체크된 아이템을 배열에 추가
            setCheckItems((prev) => [...prev, id]);
        } else {
            // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
            setCheckItems(checkItems.filter((el) => el !== id));
        }
    };

    // 체크박스 전체 선택
    const handleAllCheck = (checked) => {
        if (checked) {
            // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
            const idArray = [];
            hotelList.forEach((el) => idArray.push(el.hotel_idx));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    };

    // 회원 선택 삭제
    const clickRemove = () => {
        //선택여부 확인
        checkItems.length === 0
            ? CommonNotify({
                  type: "alert",
                  hook: alert,
                  message: "호텔을 선택해주세요",
              })
            : CommonNotify({
                  type: "confirm",
                  hook: confirm,
                  message: "선택된 호텔을 삭제 하시겠습니까?",
                  callback: () => removeHotel(),
              });
    };

    // 삭제 버튼
    const removeHotel = async () => {
        let checkItemsStr = checkItems.join();
        setIsSpinner(true);

        const url = `${apiPath.api_admin_remove_hotel}${checkItemsStr}`;

        const restParams = {
            method: "delete",
            url: url,
            data: {},
            err: err,
            callback: (res) => responsLogic(res),
        };

        CommonRest(restParams);

        const responsLogic = (res) => {
            const result_code = res.headers.result_code;
            if (result_code === successCode.success) {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "삭제가 완료 되었습니다",
                    callback: () => pageUpdate(),
                });
            } else {
                setIsSpinner(false);

                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "잠시 후 다시 시도해주세요",
                });
            }

            const pageUpdate = () => {
                handleNeedUpdate();
            };
        };

        // const responsLogic = (res, i) => {
        //     const result_code = res.headers.result_code;
        //     if (result_code === successCode.success) {
        //         if (i + 1 === checkItems.length) {
        //             setIsSpinner(false);

        //             CommonNotify({
        //                 type: "alert",
        //                 hook: alert,
        //                 message: "삭제가 완료 되었습니다",
        //                 callback: () => pageUpdate(),
        //             });
        //         }
        //     } else {
        //         setIsSpinner(false);

        //         CommonNotify({
        //             type: "alert",
        //             hook: alert,
        //             message: "잠시 후 다시 시도해주세요",
        //         });
        //     }

        //     const pageUpdate = () => {
        //         handleNeedUpdate();
        //     };
        // };

        // for (let i = 0; i < checkItems.length; i++) {
        //     try {
        //         const url = `${apiPath.api_admin_remove_hotel}${checkItems[i]}`;

        //         const restParams = {
        //             method: "delete",
        //             url: url,
        //             data: {},
        //             err: err,
        //             callback: (res) => responsLogic(res, i),
        //         };

        //         await CommonRest(restParams);
        //     } catch (err) {
        //         console.log(err);
        //     }
        // }
    };

    return (
        <>
            <div className="content">
                <div className="title">
                    <h3>호텔 리스트</h3>
                </div>
                <div className="con_area">
                    <div>
                        <div className="adm_search">
                            <div>
                                {/* <select name="" id="">
                                    <option value="">구분</option>
                                    <option value="">이름</option>
                                    <option value="">소속</option>
                                </select>{" "} */}
                                <input type="text" className="input" />
                                <Link href="" className="subbtn off">
                                    검색
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="subbtn del"
                                    onClick={clickRemove}
                                >
                                    선택삭제
                                </Link>{" "}
                                <Link
                                    className="modal_btn subbtn on"
                                    title="#hotelInsert"
                                    onClick={(e) => regHotel()}
                                >
                                    호텔신규등록
                                </Link>{" "}
                                <Link href="" className="subbtn on">
                                    엑셀 다운로드
                                </Link>{" "}
                                <Link href="" className="subbtn on">
                                    일괄 업로드
                                </Link>
                            </div>
                        </div>
                        <div className="adm_table">
                            <table className="table_a">
                                <colgroup>
                                    <col width="3%" />
                                    <col width="8%" />
                                    <col width="5%" />
                                    <col width="5%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="*" />
                                    <col width="10%" />
                                    {/* <col width="10%" /> */}
                                    <col width="5%" />
                                    <col width="5%" />
                                    {/* <col width="5%" /> */}
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                name="select-all"
                                                onChange={(e) =>
                                                    handleAllCheck(
                                                        e.target.checked
                                                    )
                                                }
                                                checked={
                                                    checkItems &&
                                                    hotelList &&
                                                    checkItems.length ===
                                                        hotelList.length
                                                        ? true
                                                        : false
                                                }
                                            />
                                        </th>
                                        <th>대표이미지</th>
                                        <th>고유번호</th>
                                        <th>구분</th>
                                        <th colSpan="2">호텔명</th>
                                        <th>주소</th>
                                        <th>연락처</th>
                                        {/* <th>담당자</th> */}
                                        <th>상세보기</th>
                                        <th>미리보기</th>
                                        {/* <th>객실리스트</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotelList.length !== 0 ? (
                                        hotelList.map((item, idx) => (
                                            <tr key={`hotel_list_${idx}`}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        name={`hotelIdx_${item.hotel_idx}`}
                                                        id={item.hotel_idx}
                                                        defaultValue={
                                                            item.hotel_idx
                                                        }
                                                        onChange={(e) =>
                                                            handleSingleCheck(
                                                                e.target
                                                                    .checked,
                                                                item.hotel_idx
                                                            )
                                                        }
                                                        checked={
                                                            checkItems.includes(
                                                                item.hotel_idx
                                                            )
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                </td>
                                                <td className="hotel_thumb_td">
                                                    <img
                                                        src={`${apiPath.api_admin_hotel_list_thumb}${item.file_path_enc}`}
                                                        alt=""
                                                    />
                                                </td>
                                                <td>{item.name_key}</td>
                                                <td>
                                                    {
                                                        hotel_static.NATION_TYPE
                                                            .convertKo[
                                                            item.nation_type_cd
                                                        ]
                                                    }
                                                </td>
                                                <td>{item.name_ko}</td>
                                                <td>{item.name_en}</td>
                                                <td>
                                                    {`${item.addr1_ko} ${item.addr2_ko}`}
                                                </td>
                                                <td>{`${item.phone1}-${item.phone2}-${item.phone3}`}</td>
                                                <td>
                                                    <Link
                                                        className="tablebtn"
                                                        onClick={() =>
                                                            openDetail(
                                                                item.hotel_idx
                                                            )
                                                        }
                                                    >
                                                        상세보기
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        className="tablebtn"
                                                        onClick={() =>
                                                            openPreview(item)
                                                        }
                                                    >
                                                        미리보기
                                                    </Link>
                                                </td>
                                                {/* <td>
                                                    <Link className="tablebtn">
                                                        객실리스트
                                                    </Link>
                                                </td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <>
                                            <tr>
                                                <td
                                                    colSpan="11"
                                                    style={{ height: "55px" }}
                                                >
                                                    <b>데이터가 없습니다.</b>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {pageInfo && (
                            <div className="pagenation">
                                <Pagination
                                    count={pageInfo.pages}
                                    onChange={handleChange}
                                    shape="rounded"
                                    color="primary"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CommonModal
                isOpen={isOpen}
                title={modalTitle}
                width={"1400"}
                handleModalClose={handleModalClose}
                component={"HotelDetailModalMain"}
                handleNeedUpdate={handleNeedUpdate}
                modData={modData}
                // modUserData={modUserData}
            />
            <CommonModalChild
                isOpen={isOpenPreview}
                title={modalTitlePreview}
                width={"1600"}
                handleModalClose={handleModalClosePreview}
                component={"HotelPreview"}
                previewData={previewData}
                // handleNeedUpdate={handleNeedUpdate}
            />
        </>
    );
};

export default HotelListMain;
