import {
    SET_USER_INFO,
    INIT_USER_INFO,
    SET_USER_TOKEN,
} from "redux/actions/userInfoAction";

// 초기값 설정
const initialState = {
    userInfo: null,
};

// user_info Reducer
export default function userInfo(state = initialState, action) {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: JSON.parse(action.payload),
            };

        case SET_USER_TOKEN:
            return {
                ...state,
                userToken: JSON.parse(action.payload).token,
            };

        case INIT_USER_INFO:
            return initialState;

        default:
            return state;
    }
}
