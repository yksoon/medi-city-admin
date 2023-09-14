import { CommonErrModule } from "common/js/Common";
import { commaOfNumber } from "common/js/Pattern";
import useAlert from "hook/useAlert";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { codesAtom, isSpinnerAtom } from "recoils/atoms";

const RoomModalPrice = forwardRef((props, ref) => {
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const [priceCount, setPriceCount] = useState(1);

    const [priceRenderArr, setPriceRenderArr] = useState([]);

    const priceList = props.priceList;
    const handlePriceList = props.handlePriceList;

    const modData = props.modData;
    const price_info =
        Object.keys(modData).length !== 0 ? modData.price_info : [];
    const isModData = Object.keys(modData).length !== 0 ? true : false;

    const handelPriceCount = (params) => {
        if (params === "add") {
            if (priceCount < 10) {
                setPriceCount(priceCount + 1);
            }
        } else if (params === "remove") {
            if (priceCount > 0) {
                let list = priceList;
                list = list.filter((e) => e.idx !== priceCount);

                // console.log("111111111", list);
                handlePriceList(list);

                setPriceCount(priceCount - 1);
            }
        } else {
            return;
        }
    };

    const priceRender = () => {
        let result = [];

        for (let i = 0; i < priceCount; i++) {
            result.push(
                <PriceTable
                    key={`price_${i + 1}`}
                    idx={i + 1}
                    priceList={priceList}
                    handlePriceList={handlePriceList}
                    price_info={price_info[i]}
                    // handleRemove={handleRemove}
                />
            );
        }

        return result;
    };

    return (
        <>
            <div className="hotel_box">
                <h4 className="mo_subtitle">객실 가격 정보</h4>

                {priceCount > 0 && priceRender()}

                <div className="subbtn_box">
                    <Link
                        href=""
                        className="subbtn off"
                        onClick={() => handelPriceCount("add")}
                    >
                        가격 추가
                    </Link>
                    {priceCount !== 1 && (
                        <Link
                            href=""
                            className="subbtn del"
                            onClick={() => handelPriceCount("remove")}
                        >
                            삭제
                        </Link>
                    )}

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
});

const PriceTable = (props) => {
    const [selectPriceDiv, setSelectPriceDiv] = useState("000");
    const idx = props.idx;
    let priceData = {
        idx: idx,
        priceType: "100",
        priceDiv: "000",
    };

    const handleRemove = props.handleRemove;

    const codes = useRecoilValue(codesAtom);
    const priceDiv = codes.filter((e) => e.code_type === "PRICE_DIV");

    // const person_name = useRef(null);
    // const position = useRef(null);
    // const email = useRef(null);
    // const phone = useRef(null);
    // const memo = useRef(null);
    const price_div = useRef(null);
    const origin_price = useRef(null);
    const org_start = useRef(null);
    const org_end = useRef(null);
    const sale_price = useRef(null);
    const sale_start = useRef(null);
    const sale_end = useRef(null);
    const sale_rate = useRef(null);
    const price_memo = useRef(null);

    const priceList = props.priceList;
    const handlePriceList = props.handlePriceList;

    const price_info = props.price_info ? props.price_info : {};
    const isModData = Object.keys(price_info).length !== 0 ? true : false;

    // useEffect(() => {
    //     // 수정일 경우 세팅
    //     isModData && setDefaultValue();
    // }, []);

    // 수정일 경우 세팅
    // const setDefaultValue = () => {
    //     person_name.current.value = person_info.person_name;
    //     position.current.value = person_info.position;
    //     email.current.value = person_info.email;
    //     phone.current.value = person_info.phone;
    //     memo.current.value = person_info.memo;
    // };

    const handleInput = (e) => {
        const id = e.target.id;

        let list = priceList;
        list = list.filter((e) => e.idx !== idx);

        let insertData = priceList.filter((e) => e.idx === idx)[0];

        // const setInsertData = (insertData, param, e) => {
        //     insertData = {
        //         ...insertData,
        //         `${param}`: e.target.value,
        //     };

        //     return insertData
        // }

        switch (id) {
            case "price_div":
                insertData = {
                    ...insertData,
                    priceDiv: e.target.value,
                };
                break;

            case "origin_price":
                insertData = {
                    ...insertData,
                    originPrice: e.target.value,
                };
                break;

            case "org_start":
                insertData = {
                    ...insertData,
                    orgStart: e.target.value,
                };
                break;

            case "org_end":
                insertData = {
                    ...insertData,
                    orgEnd: e.target.value,
                };
                break;

            case "sale_price":
                insertData = {
                    ...insertData,
                    salePrice: e.target.value,
                };
                break;

            case "sale_start":
                insertData = {
                    ...insertData,
                    saleStart: e.target.value,
                };
                break;

            case "sale_end":
                insertData = {
                    ...insertData,
                    saleEnd: e.target.value,
                };
                break;

            case "sale_rate":
                insertData = {
                    ...insertData,
                    saleRate: e.target.value,
                };
                break;

            case "price_memo":
                insertData = {
                    ...insertData,
                    priceMemo: e.target.value,
                };
                break;

            default:
                break;
        }

        priceData = { ...priceData, ...insertData };
        list = [...list, priceData];

        // console.log(list);
        handlePriceList(list);
    };

    const handleSelect = (e) => {
        setSelectPriceDiv(e.target.value);
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
                    <th>
                        가격분류 <span className="red">*</span>
                    </th>
                    <td colSpan="3">
                        {/* <input
                            type="text"
                            className="input wp100"
                            id="person_name"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                            // ref={person_name}
                        /> */}
                        <select
                            id="price_div"
                            className="wp100"
                            onChange={(e) => {
                                handleInput(e);
                                handleSelect(e);
                            }}
                            ref={price_div}
                        >
                            {priceDiv.length !== 0 &&
                                priceDiv.map((item) => (
                                    <option
                                        key={`price_div_${item.code_key}`}
                                        value={item.code_key}
                                    >
                                        {item.code_value}
                                    </option>
                                ))}
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>
                        원가 <span className="red">*</span>
                    </th>
                    <td>
                        <input
                            type="text"
                            className="input wp100"
                            id="origin_price"
                            onChange={(e) => {
                                handleInput(e);
                                String(e.target.value).replace(
                                    commaOfNumber,
                                    ","
                                );
                            }}
                            ref={origin_price}
                        />
                    </td>
                    <th>
                        원가기간 <span className="red">*</span>
                    </th>
                    <td>
                        <input
                            type="date"
                            className="input w120"
                            id="org_start"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                            ref={org_start}
                        />
                        {` ~ `}
                        <input
                            type="date"
                            className="input w120"
                            id="org_end"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                            ref={org_end}
                        />
                    </td>
                </tr>
                {selectPriceDiv !== "000" && (
                    <>
                        <tr>
                            <th>
                                할인가 <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="input wp100"
                                    id="sale_price"
                                    onChange={(e) => {
                                        handleInput(e);
                                    }}
                                    ref={sale_price}
                                />
                            </td>
                            <th>
                                할인기간 <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="date"
                                    className="input w120"
                                    id="sale_start"
                                    onChange={(e) => {
                                        handleInput(e);
                                    }}
                                    ref={sale_start}
                                />
                                {` ~ `}
                                <input
                                    type="date"
                                    className="input w120"
                                    id="sale_end"
                                    onChange={(e) => {
                                        handleInput(e);
                                    }}
                                    ref={sale_end}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                할인율 <span className="red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    className="input wp100"
                                    id="sale_rate"
                                    onChange={(e) => {
                                        handleInput(e);
                                    }}
                                    ref={sale_rate}
                                />
                            </td>
                        </tr>
                    </>
                )}

                <tr>
                    <th>메모</th>
                    <td colSpan="2">
                        <input
                            type="text"
                            className="input wp100"
                            id="price_memo"
                            onChange={(e) => {
                                handleInput(e);
                            }}
                            ref={price_memo}
                        />
                    </td>
                    <td>
                        <Link
                            href=""
                            className="subbtn del"
                            onClick={() => handleRemove(idx, PriceTable)}
                        >
                            삭제
                        </Link>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default RoomModalPrice;
