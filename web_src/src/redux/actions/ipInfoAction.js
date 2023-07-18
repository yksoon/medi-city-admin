// Actions
export const SET_IP_INFO = "SET_IP_INFO";

// Action Creator
export const set_ip_info = (data) => {
    return {
        type: SET_IP_INFO,
        payload: data,
    };
};
