import {
    SET_CODES,
    SET_RESULT_CODE,
    SET_COUNTRY_BANK,
} from "redux/actions/codesAction";

// 초기값 설정
const initialState = {
    codes: [],
    resultCode: [],
    countryBank: [],
};

// codes Reducer
export default function codes(state = initialState, action) {
    switch (action.type) {
        case SET_CODES:
            return {
                ...state,
                codes: JSON.parse(action.payload),
            };

        case SET_RESULT_CODE:
            return {
                ...state,
                resultCode: JSON.parse(action.payload),
            };

        case SET_COUNTRY_BANK:
            return {
                ...state,
                countryBank: JSON.parse(action.payload),
            };

        default:
            return state;
    }
}
