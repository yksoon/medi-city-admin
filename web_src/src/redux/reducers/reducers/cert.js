import { SET_CERT_INFO } from "redux/actions/certAction";

// 초기값 설정
const initialState = {
    certInfo: null,
};

// user_info Reducer
export default function certInfo(state = initialState, action) {
    switch (action.type) {
        case SET_CERT_INFO:
            return {
                ...state,
                certInfo: action.payload,
            };

        default:
            return state;
    }
}
