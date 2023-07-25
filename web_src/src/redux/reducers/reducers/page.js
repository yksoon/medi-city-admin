import { SET_PAGE } from "redux/actions/pageActios";

// 초기값 설정
const initialState = {
    page: "dashboard",
};

// page Reducer
export default function page(state = initialState, action) {
    switch (action.type) {
        case SET_PAGE:
            return {
                ...state,
                page: action.payload,
            };

        default:
            return state;
    }
}
