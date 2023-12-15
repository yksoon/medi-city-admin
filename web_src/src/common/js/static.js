// 구분자
const commonSeparator = "│";

// 유저권한
const commonUserRoleCd = {
    adminMaster: "000",
    admin: "100",
    kmediAdmin: "110",
    artAdmin: "120",
    texAdmin: "130",
    miceAdmin: "140",
    hotelAdmin: "150",
    doctor: "200",
    creator: "300",
    general: "400",
    etc: "900",
};

// 썸네일 formData append
const imageResizeOptions = {
    maxSizeMB: 0.25,
    useWebWorker: true,
    preserveExif: true,
};

export { commonSeparator, commonUserRoleCd, imageResizeOptions };
