// Actions
export const SET_CODES = "SET_CODES";
export const SET_RESULT_CODE = "SET_RESULT_CODE";
export const SET_COUNTRY_BANK = "SET_COUNTRY_BANK";

// Action Creator
export const set_codes = (data) => {
    return {
        type: SET_CODES,
        payload: data,
    };
};

export const set_result_code = (data) => {
    return {
        type: SET_RESULT_CODE,
        payload: data,
    };
};

export const set_country_bank = (data) => {
    return {
        type: SET_COUNTRY_BANK,
        payload: data,
    };
};
