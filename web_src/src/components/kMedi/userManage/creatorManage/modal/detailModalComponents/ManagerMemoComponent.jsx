import { commonSeparator } from "common/js/static";
import { forwardRef, useEffect, useRef } from "react";

const ManagerMemoComponent = forwardRef((props, ref) => {
    const modData = props.modData;

    const { memoTextarea } = ref;

    useEffect(() => {
        setDefaultValue();
    }, []);

    const setDefaultValue = () => {
        memoTextarea.current.value =
            modData.creator_desc.split(commonSeparator)[1] === "null" ||
            !modData.creator_desc.split(commonSeparator)[1]
                ? ""
                : modData.creator_desc.split(commonSeparator)[1];
    };
    return (
        <>
            <div className="kmedi_member_box">
                <span>
                    <h5>관리자 메모</h5>&nbsp;&nbsp;{" "}
                    {modData.creator_desc.split(commonSeparator)[0]}
                </span>
                <textarea name="" id="" ref={memoTextarea}></textarea>
            </div>
        </>
    );
});

export default ManagerMemoComponent;
