import { useEffect, useRef } from "react";

const ManagerMemoComponent = (props) => {
    const modData = props.modData;

    const memoTextarea = useRef(null);

    useEffect(() => {
        memoTextarea.current.value = modData.creator_desc;
    }, []);
    return (
        <>
            <div className="kmedi_member_box">
                <h5>관리자 메모</h5>
                <textarea name="" id="" ref={memoTextarea}></textarea>
            </div>
        </>
    );
};

export default ManagerMemoComponent;
