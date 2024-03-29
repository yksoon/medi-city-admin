// 콜론, slash
const colon = ":";
const slash = "/";

const isDeveloping = import.meta.env.VITE_ISDEVELOPING;

// 프로토콜
// 호스트
// 포트
// 버전
// const protocol = "http://";
let protocol;
let host;

if (isDeveloping === "local" || isDeveloping === "dev") {
    protocol = "https://"
    host = "dev-api.medi-city.co.kr";
} else if (isDeveloping === "prd") {
    protocol = "http://"
    // host = "3.36.85.141";
    host = "api.medi-people.co.kr";
    // host = "localhost";
} else {
    protocol = "https://"
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
const account = "act";

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

    // 약관 삭제
    // mng/v1/kmedi/term
    // delete
    api_admin_kmedi_terms_remove: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/term/`,

    // -------------------- k-medi member ------------------

    // 현지회원 리스트
    // mng/v1/meta/rooms
    // post
    api_admin_kmedi_member_list: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/members`,

    // 현지 회원 등록
    // mng/v1/kmedi/member
    // post
    api_admin_kmedi_member_reg: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/member`,

    // 현지 회원 상세
    // mng/v1/kmedi/member/{terms_sq}
    // get
    api_admin_kmedi_member_detail: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/member/`,

    // 현지 회원 강제탈퇴
    // mng/v1/kmedi/member/{terms_sq}
    // delete
    api_admin_kmedi_member_remove: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/member/`,

    // 크리에이터 리스트
    // mng/v1/kmedi/creators
    // post
    api_admin_kmedi_creator_list: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/creators`,

    // 크리에이터 상세
    // mng/v1/kmedi/creator/{creator_id}/
    // get
    api_admin_kmedi_creator_detail: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/creator/`,

    // K-MEDI 회원 리워드 목록 (관리자)
    // mng/v1/kmedi/member-rewards
    // POST
    api_admin_kmedi_member_reward_list: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/member-rewards`,

    // K-MEDI 회원 리워드 등록 (관리자)
    // mng/v1/kmedi/member-reward
    // POST
    api_admin_kmedi_member_reward_reg: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/member-reward`,

    /**
     * Notice Management API
     * K-MEDI 공지사항 관리 API
     */
    // K-MEDI 공지사항 정보 목록 (관리자)
    // mng/v1/kmedi/board/notices
    // POST
    api_admin_kmedi_board_notice_list: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/board/notices`,

    // K-MEDI 공지사항 정보 상세 (관리자)
    // mng/v1/kmedi/board/notice/{notice_sq}
    // GET
    api_admin_kmedi_board_notice_detail: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/board/notice${slash}`,

    // K-MEDI 공지사항 정보 삭제 (관리자)
    // mng/v1/kmedi/board/notice/{notice_sq}
    // DELETE
    api_admin_kmedi_board_notice_remove: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/board/notice${slash}`,

    // K-MEDI 공지사항 정보 등록 (관리자)
    // mng/v1/kmedi/board/notice
    // POST MULTI
    api_admin_kmedi_board_notice_reg: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/board/notice`,

    // K-MEDI 공지사항 정보 수정 (관리자)
    // mng/v1/kmedi/board/notice
    // PUT MULTI
    api_admin_kmedi_board_notice_mod: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/board/notice`,

    /**
     * Banner Management API
     * K-MEDI 베너 관리 API
     */
    // K-MEDI 베너 정보 목록 (관리자)
    // mng/v1/kmedi/banners
    // POST
    api_admin_kmedi_banner_list: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/banners`,

    // K-MEDI 베너 정보 상세 (관리자)
    // /v1/kmedi/banner/{banner_sq}/
    // GET
    api_admin_kmedi_banner_detail: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/banner${slash}`,

    // K-MEDI 베너 정보 삭제 (관리자)
    // /v1/kmedi/banner/{banner_sq}/
    // DELETE
    api_admin_kmedi_banner_remove: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/banner${slash}`,

    // K-MEDI 베너 정보 등록 (관리자)
    // /v1/kmedi/banner
    // POST MULTI
    api_admin_kmedi_banner_reg: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/banner`,

    // K-MEDI 베너 정보 수정 (관리자)
    // /v1/kmedi/banner
    // PUT MULTI
    api_admin_kmedi_banner_mod: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/banner`,

    /**
     * QNA Management API
     * K-MEDI QNA 관리 API
     */
    // K-MEDI QNA 정보 목록 (관리자)
    // /v1/kmedi/board/qnas
    // POST
    api_admin_kmedi_board_qna_list: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/board/qnas`,

    // K-MEDI QNA 정보 상세 (관리자)
    // /v1/kmedi/board/qna/{qna_sq}
    // GET
    api_admin_kmedi_board_qna_detail: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/board/qna${slash}`,

    // K-MEDI 답변 정보 삭제 (관리자)
    // /v1/kmedi/board/qna/answer/{qna_sqs}
    // DELETE
    api_admin_kmedi_board_qna_remove: `${
        base_api_url + slash + mng + slash + version + slash
    }kmedi/board/qna/answer${slash}`,
};

export { routerPath, apiPath };
