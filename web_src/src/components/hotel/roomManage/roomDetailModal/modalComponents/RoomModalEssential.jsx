import {
    CommonConsole,
    CommonErrModule,
    CommonNotify,
    CommonRest,
} from "common/js/Common";
import { successCode } from "common/js/resultCode";
import useAlert from "hook/useAlert";
import { forwardRef, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { isSpinnerAtom } from "recoils/atoms";
import { apiPath } from "webPath";
import Select from "react-select";
import { room_static } from "models/hotel/room";

const RoomModalEssential = forwardRef((props, ref) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const modData = props.modData;
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const [hotelList, setHotelList] = useState([]);
    const [selectHotelOptions, setSelectHotelOptions] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const [showList, setShowList] = useState([]);
    const initShowList = [
        "WATER_COUNT",
        "TOWEL_COUNT",
        "SLIPPERS_COUNT",
        "BED_COUNT",
        "ADD_BED_COUNT",
        "ADD_BED_TYPE",
        "TOWEL_TYPE",
    ];

    const [additionalList, setAdditionalList] = useState([]);

    const essentialAdditionalCheckList = props.essentialAdditionalCheckList;
    const handleEssentialAdditionalCheck = props.handleEssentialAdditionalCheck;

    const {
        hotelIdx,
        nameKo,
        nameEn,
        roomNumber,
        attachmentOrgFile,
        roomSize,
        minPeople,
        maxPeople,
    } = ref;

    const handleSelectedhotel = props.handleSelectedhotel;

    useEffect(() => {
        // 호텔 리스트
        // pageNum, pageSize, searchKeyword, searchType
        getHotelList(1, 1, "", 1);

        // 부대시설 리스트
        // pageNum, pageSize, searchType
        getAdditional(1, 1, 1);
    }, []);

    useEffect(() => {
        if (hotelList.length !== 0) {
            selectboxHotel();
        }
    }, [hotelList]);

    // init
    useEffect(() => {
        if (additionalList.length !== 0) {
            initRequireCheck();
        }
    }, [additionalList]);

    useEffect(() => {
        // 수정일 경우 세팅
        isModData && setDefaultValue();
    }, [selectHotelOptions]);

    // 수정일 경우 세팅
    const setDefaultValue = () => {
        setSelectedHotel(
            selectHotelOptions.find((e) => e.value === modData.hotel_idx)
        );
        nameKo.current.value = modData.room_name_ko;
        nameEn.current.value = modData.room_name_en;
        roomNumber.current.value = modData.room_number;

        // 이미지 세팅
        setDefaultMulti();

        roomSize.current.value = modData.room_size;
        minPeople.current.value = modData.min_people;
        maxPeople.current.value = modData.max_people;

        // 부대시설 세팅
        let arr = [];
        const additionalInfoLength = modData.additional_info.length;
        for (let i = 0; i < additionalInfoLength; i++) {
            arr.push(modData.additional_info[i].key_name);
        }
        setShowList(arr);

        handleEssentialAdditionalCheck(modData.additional_info);
    };

    // 수정일 시 이미지들 미리보기 추가
    const setDefaultMulti = () => {
        const orgFileEnc = modData.attachment_file_info.filter(
            (e) => e.origin_type_cd === room_static.file_origin_type_cd.origin
        );

        if (orgFileEnc.length !== 0) {
            document.querySelector("#imageContainer").replaceChildren();

            orgFileEnc.forEach((e) => {
                let span = document.createElement("span");
                span.setAttribute("class", "hotel_img");

                let img = document.createElement("img");
                span.appendChild(img);

                img.setAttribute(
                    "src",
                    `${apiPath.api_admin_hotel_list_thumb}${e.file_path_enc}`
                );

                document.querySelector("#imageContainer").appendChild(span);
            });
        }
    };

    // 호텔 리스트 가져오기
    const getHotelList = (pageNum, pageSize, searchKeyword, searchType) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_hotel_list;
        const data = {
            page_num: pageNum,
            page_size: pageSize,
            search_keyword: searchKeyword,
            search_type: searchType,
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

                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    // 부대시설 리스트
    const getAdditional = (pageNum, pageSize, searchType) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_hotel_additionals_list;
        const data = {
            page_num: pageNum,
            page_size: pageSize,
            additional_type: room_static.additional_type, // additional_type : "100"
            search_type: searchType,
            use_yn: "Y",
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

                setAdditionalList(result_info);

                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };

    // 호텔리스트 SELECT 가공
    const selectboxHotel = () => {
        let options = [];

        hotelList.forEach((item) => {
            let newObj = {
                value: item.hotel_idx,
                label: `${item.name_ko} (${item.name_en})`,
            };

            options.push(newObj);
        });

        setSelectHotelOptions(options);

        // // 기본
        // const defaultObj = options.find((e) => e.value === "82");
        // setSelectedCountry(defaultObj);
    };

    // 호텔 SELECT 스타일
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

    // 라디오 버튼 핸들러
    const handleEssentialRadio = (e) => {
        // console.log(e.target.id);
        const name = e.target.name;

        let arr = [];

        if (e.target.value === "Y") {
            arr = [...showList, name + "_COUNT"];
            if (name === "ADD_BED" || name === "TOWEL") {
                arr = [...arr, name + "_TYPE"];
            }
        } else {
            arr = showList.filter((element) => element !== name + "_COUNT");
            if (name === "ADD_BED" || name === "TOWEL") {
                arr = showList.filter((element) => element !== name + "_COUNT");
                arr = arr.filter((element) => element !== name + "_TYPE");
            }
        }
        setShowList(arr);
    };

    // 이미지파일인지 확인
    function isFileImage(file) {
        if (file) {
            for (let i = 0; i < file.length; i++) {
                return file[i] && file[i]["type"].split("/")[0] === "image";
            }
        }
    }

    // 이미지 업로드 시 미리보기 (멀티)
    const readURLMulti = (input) => {
        const maxFileCnt = 5; // 첨부파일 최대 개수

        // console.log("1111111", input.files);

        if (isFileImage(input.files)) {
            if (input.files.length > maxFileCnt) {
                CommonNotify({
                    type: "alert",
                    hook: alert,
                    message: "이미지는 5장까지 업로드 가능합니다.",
                });

                input.value = "";

                return false;
            } else {
                document.querySelector("#imageContainer").replaceChildren();

                let fileArr = [];
                let i = input.files.length - 1;
                for (let image of input.files) {
                    let span = document.createElement("span");
                    span.setAttribute("class", "hotel_img");

                    let img = document.createElement("img");
                    span.appendChild(img);

                    // let img = document.createElement("img");
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        img.setAttribute("src", e.target.result);

                        fileArr.push(e.target.result);
                    };
                    reader.readAsDataURL(input.files[i--]);
                    // document.querySelector("#imageContainer").appendChild(img);
                    document.querySelector("#imageContainer").appendChild(span);
                }
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

    // 초기 세팅
    const initRequireCheck = () => {
        let list = additionalList;

        let insertArr = [];

        const initArr = [
            "BED",
            "BED_TYPE",
            "VIEW_TYPE",
            "ADD_BED",
            "CHILDREN_BED",
            "TOWEL",
            "WATER",
            "SLIPPERS",
        ];
        const initArrLen = initArr.length;
        for (let i = 0; i < initArrLen; i++) {
            const insertItemArr = list.filter((e) => e.key_name === initArr[i]);

            let insertItem = {};

            switch (initArr[i]) {
                case "BED":
                    insertItem = {
                        ...insertItemArr[0],
                        additionalIdx: insertItemArr[0].additional_idx,
                        additionalMemo: "N",
                        additional_memo: "N",
                    };
                    break;

                case "VIEW_TYPE":
                    insertItem = {
                        ...insertItemArr[0],
                        additionalIdx: insertItemArr[0].additional_idx,
                        additionalMemo: "900",
                        additional_memo: "900",
                    };
                    break;

                case "BED_TYPE":
                    insertItem = {
                        ...insertItemArr[0],
                        additionalIdx: insertItemArr[0].additional_idx,
                        additionalMemo: "800",
                        additional_memo: "800",
                    };
                    break;

                default:
                    insertItem = {
                        ...insertItemArr[0],
                        additionalIdx: insertItemArr[0].additional_idx,
                        additionalMemo: "N",
                        additional_memo: "N",
                    };
                    break;
            }

            insertArr.push(insertItem);
        }

        handleEssentialAdditionalCheck(insertArr);
    };

    // 체크박스 핸들러 (객실 필수 additional)
    const handleCheck = (e, item) => {
        let list = essentialAdditionalCheckList;

        const val = e.target.value;
        const additional_idx = item.additional_idx;

        let valArr = [];

        const isExist =
            list.filter((e) => e.additional_idx === item.additional_idx)
                .length !== 0
                ? true
                : false;

        if (e.target.checked) {
            // 체크될때
            if (isExist) {
                // 이미 있는경우
                let insertItem = list.filter(
                    (e) => e.additional_idx === item.additional_idx
                )[0];

                let additionalMemo = insertItem.additionalMemo;
                let additionalMemoArr = [];

                if (additionalMemo.length <= 3) {
                    additionalMemoArr = additionalMemo.split();
                } else {
                    additionalMemoArr = additionalMemo.split(",");
                }

                additionalMemoArr = [...additionalMemoArr, val];

                additionalMemo = additionalMemoArr.join();

                insertItem = {
                    ...insertItem,
                    additionalIdx: item.additional_idx,
                    additionalMemo: additionalMemo,
                    additional_memo: additionalMemo,
                };

                list = list.filter(
                    (e) => e.additional_idx !== item.additional_idx
                );

                list = [...list, insertItem];

                handleEssentialAdditionalCheck(list);
            } else {
                // 없는경우
                let insertItem = item;

                insertItem = {
                    ...insertItem,
                    additionalIdx: item.additional_idx,
                    additionalMemo: val,
                    additional_memo: val,
                };

                list = [...list, insertItem];

                handleEssentialAdditionalCheck(list);
            }
        } else {
            let insertItem = list.filter(
                (e) => e.additional_idx === item.additional_idx
            )[0];

            let additionalMemo = insertItem.additionalMemo;
            let additionalMemoArr = [];

            if (additionalMemo.length <= 3) {
                additionalMemoArr = additionalMemo.split();
            } else {
                additionalMemoArr = additionalMemo.split(",");
            }

            if (additionalMemoArr.length > 1) {
                additionalMemoArr = additionalMemoArr.filter((e) => e !== val);

                let additionalMemo = additionalMemoArr.join();

                insertItem = {
                    ...insertItem,
                    additionalIdx: item.additional_idx,
                    additionalMemo: additionalMemo,
                    additional_memo: additionalMemo,
                };

                list = list.filter(
                    (e) => e.additional_idx !== item.additional_idx
                );

                list = [...list, insertItem];

                handleEssentialAdditionalCheck(list);
            } else {
                list = list.filter(
                    (e) => e.additional_idx !== item.additional_idx
                );

                handleEssentialAdditionalCheck(list);
            }
        }
    };

    // 라디오 핸들러
    const handleRadio = (e, item) => {
        let list = essentialAdditionalCheckList;

        const val = e.target.value;
        const additional_idx = item.additional_idx;

        let insertItem = list.filter(
            (e) => e.additional_idx === item.additional_idx
        )[0];

        insertItem = {
            ...insertItem,
            additionalIdx: additional_idx,
            additionalMemo: val,
            additional_memo: val,
        };

        list = list.filter((e) => e.additional_idx !== additional_idx);

        list = [...list, insertItem];

        handleEssentialAdditionalCheck(list);
    };

    const handleInputText = (e, item) => {
        let list = essentialAdditionalCheckList;

        const val = e.target.value;
        const additional_idx = item.additional_idx;

        let insertItemArr = list.filter(
            (e) => e.additional_idx === additional_idx
        );

        if (insertItemArr.length === 0) {
            let insertItem = additionalList.filter(
                (e) => e.additional_idx === additional_idx
            )[0];

            insertItem = {
                ...insertItem,
                additionalIdx: additional_idx,
                additionalMemo: val,
                additional_memo: val,
            };

            list = list.filter((e) => e.additional_idx !== additional_idx);

            list = [...list, insertItem];

            handleEssentialAdditionalCheck(list);
        } else {
            if (val.length > 0) {
                // input text 있는경우
                let insertItem = list.filter(
                    (e) => e.additional_idx === additional_idx
                )[0];

                insertItem = {
                    ...insertItem,
                    additionalIdx: additional_idx,
                    additionalMemo: val,
                    additional_memo: val,
                };

                list = list.filter((e) => e.additional_idx !== additional_idx);

                list = [...list, insertItem];

                handleEssentialAdditionalCheck(list);
            } else {
                // input text 없는경우
                list = list.filter((e) => e.additional_idx !== additional_idx);

                handleEssentialAdditionalCheck(list);
            }
        }
    };

    return (
        <>
            <div className="hotel_box">
                <h4 className="mo_subtitle">객실 필수 정보</h4>
                <table className="table_bb">
                    <colgroup>
                        <col width="20%" />
                        <col width="*" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>
                                호텔 <span className="red">*</span>
                            </th>
                            <td>
                                {selectHotelOptions.length !== 0 && (
                                    <Select
                                        className="select"
                                        placeholder="호텔을 검색해 주세요."
                                        id="hotelIdx"
                                        options={selectHotelOptions}
                                        value={selectedHotel}
                                        key={selectedHotel}
                                        styles={customStyles}
                                        onChange={(e) => {
                                            setSelectedHotel(
                                                selectHotelOptions.find(
                                                    (event) =>
                                                        event.value === e.value
                                                )
                                            );
                                            handleSelectedhotel(e.value);
                                        }}
                                        ref={hotelIdx}
                                    />
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                객실명(국문) <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="input w370"
                                    id="nameKo"
                                    ref={nameKo}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                객실명(영문) <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="input w370"
                                    id="nameEn"
                                    ref={nameEn}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>객실번호</th>
                            <td>
                                <input
                                    type="text"
                                    className="input w180"
                                    id="roomNumber"
                                    ref={roomNumber}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                객실 이미지 <span className="red">*</span>
                                <br />
                                (최대 5개)
                            </th>
                            <td>
                                <div
                                    className="hotel_img_wrap"
                                    id="imageContainer"
                                >
                                    <span className="hotel_img"></span>{" "}
                                    <span className="hotel_img"></span>{" "}
                                    <span className="hotel_img"></span>{" "}
                                    <span className="hotel_img"></span>{" "}
                                    <span className="hotel_img"></span>{" "}
                                </div>
                                <input
                                    type="file"
                                    id="attachmentOrgFile"
                                    ref={attachmentOrgFile}
                                    onChange={(e) => readURLMulti(e.target)}
                                    accept="image/*"
                                    multiple
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                객실크기 <span className="red">*</span>
                            </th>
                            <td className="hotel_add_wrap">
                                <input
                                    type="text"
                                    className="input w120"
                                    id="roomSize"
                                    ref={roomSize}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                최소/최대인원 <span className="red">*</span>
                            </th>
                            <td className="hotel_add_wrap">
                                <input
                                    type="text"
                                    className="input w120"
                                    id="minPeople"
                                    ref={minPeople}
                                />{" "}
                                명 /{" "}
                                <input
                                    type="text"
                                    className="input w120"
                                    id="maxPeople"
                                    ref={maxPeople}
                                />{" "}
                                명
                            </td>
                        </tr>
                        {additionalList.length !== 0 &&
                            additionalList.map((item, idx) =>
                                initShowList.includes(item.key_name) ? (
                                    showList.includes(item.key_name) &&
                                    (item.key_name !== "ADD_BED_TYPE" &&
                                    item.key_name !== "TOWEL_TYPE" ? (
                                        <tr key={`${item.key_name}_${idx}`}>
                                            <th>
                                                {
                                                    item.additional_name_ko.split(
                                                        "|"
                                                    )[0]
                                                }{" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input w120"
                                                    id={item.key_name}
                                                    onChange={(e) =>
                                                        handleInputText(e, item)
                                                    }
                                                    defaultValue={
                                                        Object.keys(modData)
                                                            .length !== 0
                                                            ? modData.additional_info.find(
                                                                  (e) =>
                                                                      e.key_name ===
                                                                      item.key_name
                                                              ).additional_memo
                                                            : ""
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={`${item.key_name}_${idx}`}>
                                            <th>
                                                {
                                                    item.additional_name_ko.split(
                                                        "|"
                                                    )[0]
                                                }{" "}
                                                <span className="red">*</span>
                                            </th>
                                            <td>
                                                {item.additional_name_ko
                                                    .split("|")[1]
                                                    .split(", ")
                                                    .map((item2, idx2) => (
                                                        <label
                                                            key={`${item.key_name}_${idx2}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={
                                                                    item2.split(
                                                                        " : "
                                                                    )[0]
                                                                }
                                                                id={
                                                                    item.key_name
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleCheck(
                                                                        e,
                                                                        item
                                                                    );
                                                                }}
                                                                defaultChecked={
                                                                    Object.keys(
                                                                        modData
                                                                    ).length !==
                                                                    0
                                                                        ? modData.additional_info
                                                                              .filter(
                                                                                  (
                                                                                      e
                                                                                  ) =>
                                                                                      e.key_name ===
                                                                                      item.key_name
                                                                              )[0]
                                                                              .additional_memo.includes(
                                                                                  item2.split(
                                                                                      " : "
                                                                                  )[0]
                                                                              )
                                                                            ? true
                                                                            : false
                                                                        : item.key_name ===
                                                                              "BED_TYPE" &&
                                                                          item2.split(
                                                                              " : "
                                                                          )[0] ===
                                                                              "800"
                                                                        ? true
                                                                        : false
                                                                }
                                                            />{" "}
                                                            {
                                                                item2.split(
                                                                    " : "
                                                                )[1]
                                                            }
                                                        </label>
                                                    ))}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={`${item.key_name}_${idx}`}>
                                        <th>
                                            {
                                                item.additional_name_ko.split(
                                                    "|"
                                                )[0]
                                            }{" "}
                                            <span className="red">*</span>
                                        </th>
                                        <td>
                                            {item.additional_name_ko.split(
                                                "|"
                                            )[1] ? (
                                                item.multiple_yn === "Y" ? (
                                                    item.additional_name_ko
                                                        .split("|")[1]
                                                        .split(", ")
                                                        .map((item2, idx2) => (
                                                            <label
                                                                key={`${item.key_name}_${idx2}`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    value={
                                                                        item2.split(
                                                                            " : "
                                                                        )[0]
                                                                    }
                                                                    id={
                                                                        item.key_name
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleCheck(
                                                                            e,
                                                                            item
                                                                        );
                                                                    }}
                                                                    defaultChecked={
                                                                        Object.keys(
                                                                            modData
                                                                        )
                                                                            .length !==
                                                                        0
                                                                            ? modData.additional_info
                                                                                  .filter(
                                                                                      (
                                                                                          e
                                                                                      ) =>
                                                                                          e.key_name ===
                                                                                          item.key_name
                                                                                  )[0]
                                                                                  .additional_memo.includes(
                                                                                      item2.split(
                                                                                          " : "
                                                                                      )[0]
                                                                                  )
                                                                                ? true
                                                                                : false
                                                                            : item.key_name ===
                                                                                  "BED_TYPE" &&
                                                                              item2.split(
                                                                                  " : "
                                                                              )[0] ===
                                                                                  "800"
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />{" "}
                                                                {
                                                                    item2.split(
                                                                        " : "
                                                                    )[1]
                                                                }
                                                            </label>
                                                        ))
                                                ) : (
                                                    item.additional_name_ko
                                                        .split("|")[1]
                                                        .split(", ")
                                                        .map((item2, idx2) => (
                                                            <label
                                                                key={`${item.key_name}_${idx2}`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    value={
                                                                        item2.split(
                                                                            " : "
                                                                        )[0]
                                                                    }
                                                                    name={
                                                                        item.key_name
                                                                    }
                                                                    id={
                                                                        item.key_name
                                                                    }
                                                                    defaultChecked={
                                                                        Object.keys(
                                                                            modData
                                                                        )
                                                                            .length !==
                                                                        0
                                                                            ? modData.additional_info.filter(
                                                                                  (
                                                                                      e
                                                                                  ) =>
                                                                                      e.key_name ===
                                                                                      item.key_name
                                                                              )[0]
                                                                                  .additional_memo ===
                                                                              item2.split(
                                                                                  " : "
                                                                              )[0]
                                                                                ? true
                                                                                : false
                                                                            : item2.split(
                                                                                  " : "
                                                                              )[0] ===
                                                                                  "N" ||
                                                                              item2.split(
                                                                                  " : "
                                                                              )[0] ===
                                                                                  "900"
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handleEssentialRadio(
                                                                            e
                                                                        );
                                                                        handleRadio(
                                                                            e,
                                                                            item
                                                                        );
                                                                    }}
                                                                />{" "}
                                                                {
                                                                    item2.split(
                                                                        " : "
                                                                    )[1]
                                                                }
                                                            </label>
                                                        ))
                                                )
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="input w120"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                    </tbody>
                </table>
            </div>
        </>
    );
});

export default RoomModalEssential;
