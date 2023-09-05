import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
    key: "recoilSession", //원하는 key 값 입력
    storage: sessionStorage,
});

// ----------------atoms-------------------

// ----session Start----
// 관리자 페이지
export const pageAtom = atom({
    key: "page",
    default: "dashboard",
    effects_UNSTABLE: [persistAtom], // 세션에 저장하려면 해당 코드 추가
});

// ip info
export const ipInfoAtom = atom({
    key: "ipInfo",
    default: "",
    effects_UNSTABLE: [persistAtom],
});

// resultCode
export const resultCodeAtom = atom({
    key: "resultCode",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

// codes
export const codesAtom = atom({
    key: "codes",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

// country bank
export const countryBankAtom = atom({
    key: "countryBank",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

// 사용자
export const userInfoAtom = atom({
    key: "userInfo",
    default: {},
    effects_UNSTABLE: [persistAtom],
});

// 사용자 토큰
export const userTokenAtom = atom({
    key: "userToken",
    default: "",
    effects_UNSTABLE: [persistAtom],
});

// ----session End----

// 스피너
export const isSpinnerAtom = atom({
    key: "isSpinner",
    default: false,
});
