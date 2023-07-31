import { AlertContext } from "context/ContextProvider";
import { useContext } from "react";

const useAlert = () => {
    const [alertList, setAlertList] = useContext(AlertContext);

    const hideAlert = (id) => {
        setAlertList((list) => {
            const index = list.findIndex(({ id: _id }) => id === _id);
            return [...list.slice(0, index), ...list.slice(index + 1)];
        });
    };

    const alert = ({ message, buttons }) => {
        const promise = new Promise((resolve, reject) => {
            const id = Symbol();

            setAlertList((list) => [
                ...list,
                {
                    id,
                    show: true,
                    message,
                    buttons: {
                        ok: {
                            text: buttons.ok,
                            click: () => resolve(id),
                        },
                        close: {
                            click: () => hideAlert(id),
                        },
                        ...(buttons?.cancel && {
                            cancel: {
                                text: buttons.cancel,
                                click: () => reject(id),
                            },
                        }),
                    },
                },
            ]);
        });

        return promise.then(
            (id) => {
                hideAlert(id);
                return true;
            },

            (id) => {
                hideAlert(id);
                return false;
            }
        );
    };
    return { alert, alertList };
};

export default useAlert;
