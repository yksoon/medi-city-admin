import { SET_IP_INFO } from "redux/actions/ipInfoAction";

// 초기값 설정
const initialState = {
    ipInfo: null,
};

// user_info Reducer
export default function ipInfo(state = initialState, action) {
    switch (action.type) {
        case SET_IP_INFO:
            return {
                ...state,
                ipInfo: action.payload,
            };

        default:
            return state;
    }
}
