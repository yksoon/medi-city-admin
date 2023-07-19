import { SET_USER_INFO } from "redux/actions/userInfoAction";

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

        default:
            return state;
    }
}
