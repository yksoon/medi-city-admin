// Actions
export const SET_PAGE = "SET_PAGE";

// Action Creator
export const set_page = (data) => {
    return {
        type: SET_PAGE,
        payload: data,
    };
};
