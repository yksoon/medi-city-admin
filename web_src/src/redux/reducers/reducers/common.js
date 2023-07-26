import { SET_ALERT, SET_SPINNER } from "redux/actions/commonAction";

// 초기값 설정
const initialState = {
    alert: {
        isAlertOpen: false,
        alertTitle: "",
        alertContent: "",
        alertCallbackType: "",
        alertCallback: "",
    },
    spinner: {
        isLoading: false,
    },
};

// codes Reducer
export default function common(state = initialState, action) {
    switch (action.type) {
        case SET_ALERT:
            return {
                ...state,
                alert: action.payload,
            };

        case SET_SPINNER:
            return {
                ...state,
                spinner: action.payload,
            };

        default:
            return state;
    }
}
