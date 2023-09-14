// 비밀번호 패턴
const pwPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}$/;

// 숫자 세자리 콤마 패턴 (replace 사용해서 콤마 찍어줘야됨)
const commaOfNumber = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

export { pwPattern, commaOfNumber };
