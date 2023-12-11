import React from "react";
import { Link } from "react-router-dom";

const SearchBar = (props) => {
    const searchKeyword = props.searchKeyword;
    const doSearch = props.doSearch;
    const regBoard = props.regBoard;
    const downloadExcel = props.downloadExcel;
    const clickRemove = props.clickRemove;

    // 엔터키
    const handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            doSearch(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };

    return (
        <>
            <div className="adm_search">
                <div>
                    {/* <select name="" id="">
                                        <option value="">구분</option>
                                        <option value="">이름</option>
                                        <option value="">소속</option>
                                    </select> */}
                    <input type="text" className="input" onKeyDown={handleOnKeyPress} ref={searchKeyword} />
                    <Link to="" className="subbtn off" onClick={doSearch}>
                        검색
                    </Link>
                </div>
                <div className="btn_box btn_right" style={{ margin: 0 }}>
                    {downloadExcel && (
                        <Link
                            to=""
                            className="subbtn on"
                            onClick={downloadExcel}
                        >
                            엑셀 다운로드
                        </Link>
                    )}
                    {regBoard && (
                        <Link to="" className="subbtn on" onClick={regBoard}>
                            등록
                        </Link>
                    )}
                    {clickRemove && (
                        <Link
                            to=""
                            className="subbtn del"
                            onClick={clickRemove}
                        >
                            삭제
                        </Link>
                    )}
                    {/*<Link className="btn btn01" onClick={downloadExcel} to="">*/}
                    {/*    엑셀 다운로드*/}
                    {/*</Link>*/}
                    {/*{userInfoAdmin.user_role_cd === "000" && (*/}
                    {/*    <Link*/}
                    {/*        className="btn btn02"*/}
                    {/*        onClick={removeBoard}*/}
                    {/*     to="">*/}
                    {/*        삭제*/}
                    {/*    </Link>*/}
                    {/*)}*/}
                </div>
            </div>
        </>
    );
};

export default SearchBar;
