import { ConfirmContext } from "context/ContextProvider";
import { useContext } from "react";

const useConfirm = () => {
    const [confirmList, setConfirmList] = useContext(ConfirmContext);

    const hideConfirm = (id) => {
        setConfirmList((list) => {
            const index = list.findIndex(({ id: _id }) => id === _id);
            return [...list.slice(0, index), ...list.slice(index + 1)];
        });
    };

    const confirm = ({ message, buttons }) => {
        const promise = new Promise((resolve, reject) => {
            const id = Symbol();

            setConfirmList((list) => [
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
                            click: () => hideConfirm(id),
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
                hideConfirm(id);
                return true;
            },

            (id) => {
                hideConfirm(id);
                return false;
            }
        );
    };
    return { confirm, confirmList };
};

export default useConfirm;
