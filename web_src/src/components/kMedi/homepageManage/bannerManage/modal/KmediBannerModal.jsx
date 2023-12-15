import React, {useEffect, useRef} from 'react';
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import {CommonErrModule, CommonNotify, CommonRest} from "common/js/Common";
import {useSetRecoilState} from "recoil";
import {isSpinnerAtom} from "recoils/atoms";
import {Link} from "react-router-dom";
import imageCompression from "browser-image-compression";
import {successCode} from "common/js/resultCode";
import {apiPath} from "webPath";

const KmediBannerModal = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    // 상세보기 데이터
    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const handleModalClose = props.handleModalClose;
    const handleNeedUpdate = props.handleNeedUpdate;

    // References
    const previewAttachment = useRef(null);
    const inputAttachmentFile = useRef(null);
    const bannerName = useRef(null);
    const bannerDesc = useRef(null);
    const orderNo = useRef(null);

    useEffect(() => {
        isModData && setDefaultValue();
    }, []);

    // 수정일 경우 기본 세팅
    const setDefaultValue = () => {
        previewAttachment.current.src = modData.banner_image_url ? modData.banner_image_url : "img/common/no_image.jpg";
        bannerName.current.value = modData.banner_name
        bannerDesc.current.value = modData.banner_desc
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

    // 이미지 업로드 시 미리보기
    const readURL = (input, imageType) => {
        const imageFile = input.files[0];
        if (isFileImage(input.files)) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    // 썸네일일경우
                    if (imageType === "origin") {
                        previewAttachment.current.src = e.target.result;
                    }
                    // document.getElementById("preview").src = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                document.getElementById("preview").src = "";
            }
        } else {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: "이미지만 업로드 가능합니다.",
            });

            input.value = "";

            return false;
        }
    };

    /**
     * 파일이 이미지인지
     * @param file
     * @returns {*|boolean}
     */
    const isFileImage = (file) => {
        if (file) {
            for (let i = 0; i < file.length; i++) {
                return file[i] && file[i]["type"].split("/")[0] === "image";
            }
        }
    };


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

            const url = `${apiPath.api_admin_kmedi_banner_remove}${modData.banner_sq}`;

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

    // 등록
    const regModBoard = (method) => {
        if (validation()) {
            setIsSpinner(true);

            let url;
            if (method === "reg") {
                // K-MEDI 베너 정보 등록 (관리자)
                // /v1/kmedi/banner
                // POST MULTI
                url = apiPath.api_admin_kmedi_banner_reg;
            } else if (method === "mod") {
                // K-MEDI 베너 정보 수정 (관리자)
                // /v1/kmedi/banner
                // POST MULTI
                url = apiPath.api_admin_kmedi_banner_mod;
            }

            const formData = new FormData();
            let data = {};

            let fileArr = [];
            let thumbArr = [];

            data = {
                bannerName: bannerName.current.value,
                bannerDesc: bannerDesc.current.value,
                orderNo: orderNo.current.value,
                bannerSq: method === "mod" ? modData.banner_sq : "",
            };

            // 기본 formData append
            for (const key in data) {
                formData.append(key, data[key]);
            }

            // // 파일 formData append
            // fileArr = Array.from(inputAttachmentFile.current.files);
            // let fileLen = fileArr.length;
            // for (let i = 0; i < fileLen; i++) {
            //     formData.append("attachmentFile", fileArr[i]);
            // }

            const restParams = {
                method:
                    method === "reg"
                        ? "post_multi"
                        : method === "mod"
                            ? "put_multi"
                            : "",
                url: url,
                data: formData,
                err: err,
                admin: "Y",
                callback: (res) => responseLogic(res),
            };

            const imageResizeOptions = {
                maxSizeMB: 0.05,
                useWebWorker: true,
                preserveExif: true,
            };

            // 썸네일 생성
            if (inputAttachmentFile.current.files.length !== 0) {
                thumbArr = Array.from(inputAttachmentFile.current.files);
                let thumbLen = thumbArr.length;
                for (let i = 0; i < thumbLen; i++) {
                    imageCompression(thumbArr[i], imageResizeOptions)
                        .then(function (compressedFile) {
                            const resizingFile = new File(
                                [compressedFile],
                                thumbArr[i].name,
                                { type: thumbArr[i].type },
                            );
                            return addFormData(resizingFile);
                        })
                        .catch(function (error) {
                            console.log(error.message);
                        });
                    // formData.append("attachmentThumbnail", thumbArr[i]);
                }

                const addFormData = (compressedFile) => {
                    formData.append("fileInfo", compressedFile); // write your own logic

                    CommonRest(restParams);
                };
            } else {
                CommonRest(restParams);
            }

            const responseLogic = (res) => {
                let result_code = res.headers.result_code;
                if (result_code === successCode.success) {
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message:
                            method === "reg"
                                ? "배너 등록이 완료 되었습니다"
                                : method === "mod"
                                    ? "배너 수정이 완료 되었습니다"
                                    : "",
                        callback: () => handleNeedUpdate(),
                    });
                } else {
                    setIsSpinner(false);

                    CommonNotify({
                        type: "alert",
                        hook: alert,
                        message: "잠시 후 다시 시도해주세요",
                    });
                }
            };
        }
    };

    /**
     * validation 검증
     */
    const validation = () => {
        const noti = (ref, msg) => {
            CommonNotify({
                type: "alert",
                hook: alert,
                message: msg,
                callback: () => focus(),
            });

            const focus = () => {
                ref && ref.current.focus();
            };
        };

        if (!isModData) {
            if (!inputAttachmentFile.current.value) {
                noti(inputAttachmentFile, "작품 이미지를 첨부해주세요");

                return false;
            }
        }

        if (!bannerName.current.value) {
            noti(bannerName, "배너명을 입력해주세요");

            return false;
        }

        if (!bannerDesc.current.value) {
            noti(bannerDesc, "내용을 입력해주세요");

            return false;
        }

        if (!orderNo.current.value) {
            noti(orderNo, "정렬순서를 입력해주세요");

            return false;
        }

        return true;
    };

    return (
        <>
            <table className="table_b inner_table">
                <colgroup>
                    <col width="20%"/>
                    <col width="*"/>
                </colgroup>
                <tbody>
                <tr>
                    <th>
                        배너이미지 <span className="red">*</span>
                    </th>
                    <td colSpan={3}>
                        <div className="profile_wrap">
                                    <span className="profile_thumb">
                                        <img
                                            src=""
                                            alt=""
                                            id="preview"
                                            className="profile_img"
                                            ref={previewAttachment}
                                            onLoad={handleImageLoad}
                                        />
                                    </span>
                        </div>
                        <input
                            type="file"
                            onChange={(e) =>
                                readURL(e.target, "origin")
                            }
                            accept="image/*"
                            id="inputAttachmentFile"
                            ref={inputAttachmentFile}
                        />
                    </td>
                </tr>
                <tr>
                    <th>
                        배너명 <span className="red">*</span>
                    </th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            ref={bannerName}
                        />
                    </td>
                </tr>
                <tr>
                    <th>
                        내용 <span className="red">*</span>
                    </th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            ref={bannerDesc}
                        />
                    </td>
                </tr>
                <tr>
                    <th>
                        정렬순서 <span className="red">*</span>
                    </th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')}}
                            ref={orderNo}
                        />
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="subbtn_box">
                {isModData ? (
                    <>
                        <Link
                            to=""
                            className="subbtn del"
                            onClick={clickRemove}
                        >
                            삭제
                        </Link>
                        <Link
                            to=""
                            className="subbtn on"
                            onClick={() => regModBoard("mod")}
                        >
                            수정
                        </Link>
                    </>
                ) : (
                    <Link
                        to=""
                        className="subbtn on"
                        onClick={() => regModBoard("reg")}
                    >
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

export default KmediBannerModal;
