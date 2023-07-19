// Actions
export const SET_CERT_INFO = "SET_CERT_INFO";

// Action Creator
export const set_cert_info = (data) => {
    return {
        type: SET_CERT_INFO,
        payload: data,
    };
};
