// Actions
export const SET_USER_INFO = "SET_USER_INFO";

// Action Creator
export const set_user_info = (data) => {
    return {
        type: SET_USER_INFO,
        payload: data,
    };
};
