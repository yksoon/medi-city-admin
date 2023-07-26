// Actions
export const SET_USER_INFO = "SET_USER_INFO";
export const SET_USER_TOKEN = "SET_USER_TOKEN";
export const INIT_USER_INFO = "INIT_USER_INFO";

// Action Creator
export const set_user_info = (data) => {
    return {
        type: SET_USER_INFO,
        payload: data,
    };
};

// Action Creator
export const set_user_token = (data) => {
    return {
        type: SET_USER_TOKEN,
        payload: data,
    };
};

export const init_user_info = () => ({
    type: INIT_USER_INFO,
});
