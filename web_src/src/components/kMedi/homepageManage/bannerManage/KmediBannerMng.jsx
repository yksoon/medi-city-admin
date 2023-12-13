import { Link } from "react-router-dom";
import useConfirm from "hook/useConfirm";
import useAlert from "hook/useAlert";
import {CommonConsole, CommonErrModule, CommonNotify, CommonRest} from "common/js/Common";
import {useSetRecoilState} from "recoil";
import {isSpinnerAtom} from "recoils/atoms";
import {useEffect, useRef, useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import {apiPath} from "webPath";
import {successCode} from "common/js/resultCode";
import CommonListComponent from "components/common/CommonListComponent";

const KmediBannerMng = (props) => {
    const { confirm } = useConfirm();
    const { alert } = useAlert();
    const err = CommonErrModule();
    const setIsSpinner = useSetRecoilState(isSpinnerAtom);

    const isRefresh = props.isRefresh;
    const [isNeedUpdate, setIsNeedUpdate] = useState(false);

    const [boardList, setBoardList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [checkItems, setCheckItems] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getBoardList(page, 10, "");
    }, [isNeedUpdate, isRefresh]);

    // 리스트
    const getBoardList = (pageNum, pageSize, searchKeyword) => {
        setIsSpinner(true);

        const url = apiPath.api_admin_kmedi_terms_list;
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

                // console.log(res);
                setBoardList(result_info);
                setPageInfo(page_info);

                // console.log(res);
                setIsSpinner(false);
            } else {
                // 에러
                CommonConsole("log", res);

                setIsSpinner(false);
            }
        };
    };


    return (
        <>
            <CommonListComponent
                templateTitle={"홈페이지 관리 - 배너관리"}
                boardList={boardList}
                pageInfo={pageInfo}
                isRefresh={isRefresh}
                isNeedUpdate={isNeedUpdate}
                setIsNeedUpdate={setIsNeedUpdate}
                checkItems={checkItems}
                setCheckItems={setCheckItems}
            />
        </>
    );
};

export default KmediBannerMng;
