// 콜론, slash
const colon = ":";
const slash = "/";

const isDeveloping = process.env.REACT_APP_ISDEVELOPING;

// 프로토콜
// 호스트
// 포트
// 버전
const protocol = "http://";

let host = "";
if (isDeveloping === "local" || isDeveloping === "dev") {
    host = "dev-api.medi-city.co.kr";
} else if (isDeveloping === "prd") {
    // host = "3.36.85.141";
    host = "api.medi-city.co.kr";
} else {
    host = "dev-api.medi-city.co.kr";
}

// const host =
//     isDeveloping === "local" || isDeveloping === "dev" ? "dev-api.medi-city.co.kr" : "3.36.85.141";
// const host = "dev-api.medi-city.co.kr";

const port = "60000";

const version = "v1";

// 기본 url
// const base_url = protocol + host + colon + port + slash + version + slash;
const base_url = "/";
const base_api_url = protocol + host + colon + port;

// Auth
const auth = "auth";

// Management Service
const mng = "mng";

// Account Service
const account = "account";

// Hotel Service
const hotel = "hotel";

// route
const routerPath = {
    // 메인
    main_url: `${base_url}`,

    // 로그인
    login_url: `${base_url}login${slash}`,
};

// api
const apiPath = {
    // http://dev-api.medi-city.co.kr:60000/auth/v1/signin
    // ------------------ Auth ------------------
    // Refresh POST
    api_auth_refresh: `${
        base_api_url + slash + auth + slash + version + slash
    }refresh`,

    // 로그인 POST
    api_auth_login: `${
        base_api_url + slash + auth + slash + version + slash
    }signin`,

    // 로그아웃 POST
    api_auth_signout: `${
        base_api_url + slash + auth + slash + version + slash
    }signout`,

    // ------------------ Management Service ------------------
    // 게시판관리 GET PUT POST DELETE
    api_board: `${base_api_url + slash + mng + slash + version + slash}board`,

    // 게시판목록 POST
    api_boards: `${base_api_url + slash + mng + slash + version + slash}boards`,

    // 게시판 GET DELETE
    api_board_idx: `${
        base_api_url + slash + mng + slash + version + slash
    }board${slash}`,

    // 공통 결과코드
    api_mng_result: `${
        base_api_url + slash + mng + slash + version + slash
    }info/result`,

    // 공통 결과코드
    api_mng_codes: `${
        base_api_url + slash + mng + slash + version + slash
    }_codes`,

    // 메뉴 POST
    api_mng_menus: `${
        base_api_url + slash + mng + slash + version + slash
    }menus`,

    // ------------------ Account Service ------------------
    // 사용자 상세 GET
    // 사용자 수정 PUT
    // 사용자 등록 POST
    api_user: `${
        base_api_url + slash + account + slash + version + slash
    }_user`,

    // 사용자 정보 조회 POST
    // 사용자 정보 수정 PUT
    // 사용자 정보 상세 GET  + /{user_idx}
    api_user_info: `${
        base_api_url + slash + account + slash + version + slash
    }user/info`,

    // 인증번호 발송 POST
    api_user_cert: `${
        base_api_url + slash + account + slash + version + slash
    }user/_cert`,
    // 인증번호 확인 PUT
    api_user_cert_chk: `${
        base_api_url + slash + account + slash + version + slash
    }user/_cert`,

    // 인증결과조회 GET
    api_user_cert_result: `${
        base_api_url + slash + account + slash + version + slash
    }user/_cert`,

    // 사용자 목록 POST
    api_users: `${
        base_api_url + slash + account + slash + version + slash
    }users`,

    // 사용자 목록 POST
    api_user_list: `${
        base_api_url + slash + account + slash + version + slash
    }user/infos`,

    api_user_check: `${
        base_api_url + slash + account + slash + version + slash
    }user/_check`,

    // 사용자 확인 POST
    api_user_licenses: `${
        base_api_url + slash + account + slash + version + slash
    }user/_licenses`,

    // 아이디찾기 POST
    api_user_find_id: `${
        base_api_url + slash + account + slash + version + slash
    }user/find/_id`,

    // 비번찾기 POST
    api_user_find_pw: `${
        base_api_url + slash + account + slash + version + slash
    }user/find/_pwd`,

    // 비번변경 PUT
    api_user_reset_pw: `${
        base_api_url + slash + account + slash + version + slash
    }user/find/_pwd`,

    // 약관 목록 POST
    api_terms_list: `${
        base_api_url + slash + account + slash + version + slash
    }_policies`,

    // 사용자 수정 (관리자) PUT
    api_admin_user_mod: `${
        base_api_url + slash + account + slash + version + slash
    }user`,

    // 사용자 등록 (관리자) POST
    api_admin_user_reg: `${
        base_api_url + slash + account + slash + version + slash
    }user`,

    // 사용자 삭제 (관리자) DELETE
    api_admin_user_remove: `${
        base_api_url + slash + account + slash + version + slash
    }user`,

    // -------------------- hotel ------------------

    // 호텔 등록
    // hotel/v1/meta/hotel
    // post multi
    api_admin_reg_hotel: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/hotel`,

    // 호텔 수정
    // hotel/v1/meta/hotel
    // put multi
    api_admin_mod_hotel: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/hotel`,

    // 호텔 삭제
    // hotel/v1/meta/hotel
    // delete
    api_admin_remove_hotel: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/hotel/`,

    // 호텔 리스트
    // hotel/v1/meta/hotel
    // post multi
    api_admin_hotel_list: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/hotels`,

    // 호텔 썸네일
    // mng/v1/_file/000/${file_path_enc}
    // get
    api_admin_hotel_list_thumb: `${
        base_api_url + slash + mng + slash + version + slash
    }_file/000/`,

    // 호텔 부대시설 리스트
    // hotel/v1/meta/additionals
    // post
    api_admin_hotel_additionals_list: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/additionals`,

    // 호텔 상세보기
    // hotel/v1/meta/hotel/${hotel_idx}
    // get
    api_admin_hotel_detail: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/hotel/`,

    // -------------------- room ------------------
    // 객실 등록
    // hotel/v1/meta/room
    // post
    api_admin_reg_room: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/room`,

    // 객실 리스트
    // hotel/v1/meta/rooms
    // post
    api_admin_room_list: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/rooms`,

    // 객실 상세보기
    // hotel/v1/meta/room/{room_idx}
    // get
    api_admin_room_detail: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/room/`,

    // 객실 수정
    // hotel/v1/meta/room
    // put multi
    api_admin_mod_room: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/room`,

    // 객실 삭제
    // hotel/v1/meta/room
    // delete
    api_admin_remove_room: `${
        base_api_url + slash + hotel + slash + version + slash
    }meta/room/`,

    // -------------------- k-medi terms ------------------
    // 약관 리스트
    // mng/v1/meta/rooms
    // post
    api_admin_kmedi_terms_list: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/terms`,

    // 약관 등록
    // mng/v1/kmedi/term
    // post
    api_admin_kmedi_terms_reg: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/term`,

    // 약관 상세
    // mng/v1/kmedi/term/{terms_sq}
    // get
    api_admin_kmedi_terms_detail: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/term/`,

    // 약관 수정
    // mng/v1/kmedi/term
    // put
    api_admin_kmedi_terms_mod: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/term`,
};

export { routerPath, apiPath };
