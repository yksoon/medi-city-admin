import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";

import codes from "./reducers/codes";
import userInfo from "./reducers/userInfo";
import ipInfo from "./reducers/ipInfo";
import certInfo from "./reducers/cert";
import common from "./reducers/common";
import page from "./reducers/page";

const persistConfig = {
    key: "root",
    storage: storageSession,
    version: 0,
    whitelist: ["codes", "userInfo", "ipInfo", "page"],
};

const rootReducer = combineReducers({
    codes,
    userInfo,
    ipInfo,
    certInfo,
    common,
    page,
});

export default persistReducer(persistConfig, rootReducer);
