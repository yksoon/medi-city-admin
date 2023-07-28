import React, { createContext, useState } from "react";

export const ConfirmContext = createContext();
export const AlertContext = createContext();

const ConfirmContextProvider = ({ children }) => {
    const [confirmList, setConfirmList] = useState([]);

    return (
        <ConfirmContext.Provider value={[confirmList, setConfirmList]}>
            {children}
        </ConfirmContext.Provider>
    );
};

const AlertContextProvider = ({ children }) => {
    const [alertList, setAlertList] = useState([]);

    return (
        <AlertContext.Provider value={[alertList, setAlertList]}>
            {children}
        </AlertContext.Provider>
    );
};

export { ConfirmContextProvider, AlertContextProvider };
