import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";

import codes from "./reducers/codes";
import userInfo from "./reducers/userInfo";
import ipInfo from "./reducers/ipInfo";
import certInfo from "./reducers/cert";
import common from "./reducers/common";

const persistConfig = {
    key: "root",
    storage: storageSession,
    whitelist: ["userInfo"],
};

const rootReducer = combineReducers({
    codes,
    userInfo: persistReducer(persistConfig, userInfo),
    ipInfo,
    certInfo,
    common,
});

export default rootReducer;
