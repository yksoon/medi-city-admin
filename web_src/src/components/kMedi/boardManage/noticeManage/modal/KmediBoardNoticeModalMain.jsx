import React, {useEffect, useRef, useState} from 'react';
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import {CommonErrModule, CommonNotify, CommonRest} from "common/js/Common";
import {useSetRecoilState} from "recoil";
import {isSpinnerAtom} from "recoils/atoms";
import {Link} from "react-router-dom";
import {apiPath} from "webPath";
import {successCode} from "common/js/resultCode";
import axios from "axios";

const langOption = [
    { value: "en", label: "영어" },
    { value: "id", label: "인도네시아어" },
];

const notiOption = [
    { value: "Y", label: "발송" },
    { value: "N", label: "미발송" },
];

const KmediBoardNoticeModalMain = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const handleModalClose = props.handleModalClose;
    const handleNeedUpdate = props.handleNeedUpdate;

    const [fileList, setFileList] = useState([])

    // References
    const langCd = useRef(null);
    const noticeTitle = useRef(null);
    const noticeDesc = useRef(null);
    const inputAttachmentFile = useRef(null);
    const previewAttachment = useRef(null);
    const notiYn = useRef(null);

    useEffect(() => {
        isModData && setDefaultValue();
    }, []);

    // 수정일 경우 기본 세팅
    const setDefaultValue = () => {
        noticeTitle.current.value = modData.notice_title;
        noticeDesc.current.value = modData.notice_desc;

        addFileList()
    };

    const addFileList = () => {
        let newArr = [];

        if(modData.file_info.length !== 0 || modData.image_file_info.length !== 0) {
            newArr = newArr.concat(modData.file_info, modData.image_file_info)
        }

        setFileList(newArr)
    }

    // 삭제
    const clickRemove = () => {
        CommonNotify({
            type: "confirm",
            hook: confirm,
            message: "삭제하시겠습니까?",
            callback: () => doRemove(),
        });

        const doRemove = () => {
            setIsSpinner(true);

            const url = `${apiPath.api_admin_kmedi_board_notice_remove}${modData.notice_sq}`;

            const restParams = {
                method: "delete",
                url: url,
                data: {},
                err: err,
                admin: "Y",
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
        };
    };

    // 등록, 수정
    const regModBoard = (method) => {
        if (validation()) {
            setIsSpinner(true);

            let url;
            if (method === "reg") {
                // K-MEDI 공지사항 정보 등록 (관리자)
                // mng/v1/kmedi/board/notice
                // POST MULTI
                url = apiPath.api_admin_kmedi_board_notice_reg;
            } else if (method === "mod") {
                // K-MEDI 공지사항 정보 수정 (관리자)
                // mng/v1/kmedi/board/notice
                // PUT MULTI
                url = apiPath.api_admin_kmedi_board_notice_mod;
            }

            const formData = new FormData();
            const data = {
                // 언어구분
                // en : 영어
                // id : 인도네시아어
                langCd: langCd.current.value,

                // 제목
                noticeTitle: noticeTitle.current.value,

                // 내용
                noticeDesc: noticeDesc.current.value,

                // 푸시 발송 여부
                notiYn: notiYn.current.value,

                // notice_sq
                notice_sq: method === "mod" ? modData.notice_sq : ""
            };

            // 기본 formData append
            for (const key in data) {
                formData.append(key, data[key]);
            }

            let fileArr = [];
            // 파일 formData append
            fileArr = Array.from(inputAttachmentFile.current.files);
            let fileLen = fileArr.length;
            for (let i = 0; i < fileLen; i++) {
                if(fileArr[i] && fileArr[i]["type"].split("/")[0] === "image") {
                    formData.append("imageInfo", fileArr[i]);
                } else {
                    formData.append("fileInfo", fileArr[i]);
                }
            }

            let thumbArr = [];

            // 파라미터
            const restParams = {
                method: method === "reg" ? "post_multi" : method === "mod" ? "put_multi" : "",
                url: url,
                data: formData,
                err: err,
                callback: (res) => responsLogic(res),
            };

            // // 썸네일 생성
            // if (inputAttachmentFile.current.files.length !== 0) {
            //     thumbArr = Array.from(inputAttachmentFile.current.files);
            //     let thumbLen = thumbArr.length;
            //     for (let i = 0; i < thumbLen; i++) {
            //         imageCompression(thumbArr[i], imageResizeOptions)
            //             .then(function (compressedFile) {
            //                 const resizingFile = new File(
            //                     [compressedFile],
            //                     thumbArr[i].name,
            //                     { type: thumbArr[i].type },
            //                 );
            //                 return addFormData(resizingFile);
            //             })
            //             .catch(function (error) {
            //                 console.log(error.message);
            //             });
            //         // formData.append("attachmentThumbnail", thumbArr[i]);
            //     }
            //
            //     const addFormData = (compressedFile) => {
            //         formData.append("attachmentThumbnail", compressedFile); // write your own logic
            //
            //         CommonRest(restParams);
            //     };
            // } else {
            //     CommonRest(restParams);
            // }

            CommonRest(restParams);

            const responsLogic = (res) => {
                if (res.headers.result_code === successCode.success) {
                    setIsSpinner(false);

                    if (method === "reg") {
                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: "등록이 완료 되었습니다",
                            callback: () => handleNeedUpdate(),
                        });
                    } else if (method === "mod") {
                        CommonNotify({
                            type: "alert",
                            hook: alert,
                            message: "수정이 완료 되었습니다",
                            callback: () => handleNeedUpdate(),
                        });
                    }

                } else {
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: res.headers.result_message_ko,
                    });
                }
            };
        }
    };

    // 썸네일 이미지 사이즈 조정 - 가로 세로 길이 대비
    const handleImageLoad = () => {
        if (previewAttachment) {
            const thumbWidth = previewAttachment.current.width;
            const thumbHeight = previewAttachment.current.height;

            const profileThumb = document.querySelector(".profile_thumb");

            if (thumbWidth > thumbHeight) {
                profileThumb.classList.add("width_b");
            }

            if (thumbHeight > thumbWidth) {
                profileThumb.classList.add("height_b");
            }
        }
    };

    // // 이미지 업로드 시 미리보기
    // const readURL = (input, imageType) => {
    //     const imageFile = input.files[0];
    //     if (isFileImage(input.files)) {
    //         if (input.files && input.files[0]) {
    //             let reader = new FileReader();
    //             reader.onload = function (e) {
    //                 // 썸네일일경우
    //                 if (imageType === "origin") {
    //                     previewAttachment.current.src = e.target.result;
    //                 }
    //                 // document.getElementById("preview").src = e.target.result;
    //             };
    //             reader.readAsDataURL(input.files[0]);
    //         } else {
    //             document.getElementById("preview").src = "";
    //         }
    //     } else {
    //         CommonNotify({
    //             type: "alert",
    //             hook: alert,
    //             message: "이미지만 업로드 가능합니다.",
    //         });
    //
    //         input.value = "";
    //
    //         return false;
    //     }
    // };
    //
    // /**
    //  * 파일이 이미지인지
    //  * @param file
    //  * @returns {*|boolean}
    //  */
    // const isFileImage = (file) => {
    //     if (file) {
    //         for (let i = 0; i < file.length; i++) {
    //             return file[i] && file[i]["type"].split("/")[0] === "image";
    //         }
    //     }
    // };

    const checkFileList = (input) => {
        const maxFileCnt = 3; // 첨부파일 최대 개수

        if (input.files.length > maxFileCnt) {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "파일은 3개까지 업로드 가능합니다.",
            });

            input.value = "";

            return false;
        }
    }

    const validation = () => {

        const noti = (ref, msg) => {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: msg,
                callback: () => focus(),
            });

            const focus = () => {
                ref.current.focus();
            };
        };

        if (!noticeTitle.current.value) {
            noti(noticeTitle, "제목을 입력해주세요");

            return false;
        }

        if (!noticeDesc.current.value) {
            noti(noticeDesc, "내용을 입력해주세요");

            return false;
        }

        if (!notiYn.current.value) {
            noti(notiYn, "푸시 발송 여부를 선택해주세요");

            return false;
        }

        return true;
    };

    const downloadFile = async (fileUrl, fileName) => {
        try {
            // 파일 다운로드 요청
            const response = await axios({
                method: 'GET',
                url: fileUrl,
                responseType: 'blob', // 파일 형식에 따라 responseType을 조절할 수 있습니다.
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // 다운로드되는 파일의 이름을 설정합니다.
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('파일 다운로드 중 에러 발생:', error);
        }

    }

    return (
        <>
            <table className="table_b inner_table">
                <colgroup>
                    <col width="20%"/>
                    <col width="*"/>
                </colgroup>
                <tbody>
                <tr>
                    <th>언어</th>
                    <td>
                        <select id="langCd" className="w180" ref={langCd}>
                            <option value="">- 선택 -</option>
                            {langOption.length !== 0 &&
                                langOption.map((item, idx) => (
                                    <option
                                        key={`langOption_${item.value}`}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>푸시 발송 여부 <span className="red">*</span></th>
                    <td>
                        <select id="notiYn" className="w180" ref={notiYn}>
                            <option value="">- 선택 -</option>
                            {notiOption.length !== 0 &&
                                notiOption.map((item) => (
                                    <option key={`notiOption_${item.value}`} value={item.value}>{item.label}</option>
                                ))
                            }
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>제목 <span className="red">*</span></th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            ref={noticeTitle}
                        />
                    </td>
                </tr>
                <tr>
                    <th>내용 <span className="red">*</span></th>
                    <td>
                        <textarea
                            className="hotel_info"
                            ref={noticeDesc}
                        ></textarea>
                    </td>
                </tr>
                <tr>
                    <th>
                        첨부파일
                    </th>
                    <td colSpan={3} className="fileicon">
                        <div className="profile_wrap">
                            <div>
                                {fileList.length !== 0 &&
                                    fileList.map((item, idx) => (
                                        <div key={`file_${idx}`}>
                                            <Link
                                                // to={item.notice_attach_url}
                                                to=""
                                                onClick={() => downloadFile(item.notice_attach_url, item.notice_attach_nm)}
                                            >
                                                <img
                                                    src="img/common/file.svg"
                                                    alt=""
                                                />
                                                {item.notice_attach_nm}{" "}
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <input
                            type="file"
                            onChange={(e) =>
                                // readURL(e.target, "origin")
                                checkFileList(e.target)
                            }
                            // accept="image/*"
                            multiple={true}
                            id="inputAttachmentFile"
                            ref={inputAttachmentFile}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <div className="subbtn_box">
                {isModData ? (
                    <>
                        <Link to="" className="subbtn del" onClick={clickRemove}>
                            삭제
                        </Link>
                        <Link to="" className="subbtn on" onClick={() => regModBoard("mod")}>
                            수정
                        </Link>
                    </>
                ) : (
                    <Link to="" className="subbtn on" onClick={() => regModBoard("reg")}>
                        등록
                    </Link>
                )}

                <Link to="" className="subbtn off" onClick={handleModalClose}>
                    취소
                </Link>
            </div>
        </>
    );
};

export default KmediBoardNoticeModalMain;
