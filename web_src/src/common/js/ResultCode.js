import { useSelector } from "react-redux";

const ResultCode = () => {
    let resultCode = useSelector((state) => state.codes.resultCode);

    return resultCode;
};

export { ResultCode };
