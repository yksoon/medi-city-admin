
//로그인
function login(){
	const wrap = document.getElementById('header_login_wrap');
	const login = document.getElementById('header_login');
	const profile = document.getElementById('header_profile');
    
	if (wrap.classList.contains('logout')) {
		wrap.classList.remove('logout');
        profile.style.display = "none"
        login.style.display = "block"
	} else {
		wrap.classList.add('logout');
        profile.style.display = "block"
        login.style.display = "none"
	}
}

// 등급별 왕관 이미지 교체
var grade = document.getElementById('gradeLabel').getAttribute('name');
var gradeImg = document.getElementById('gradeLabelImg');

if (grade == "dia") {
    gradeImg.setAttribute('src','img/common/grade_dia.png');
}else if(grade == "gold") {
    gradeImg.setAttribute('src','img/common/grade_gold.png');
}else if(grade == "silver") {
    gradeImg.setAttribute('src','img/common/grade_silver.png');
}else if(grade == "bronze") {
    gradeImg.setAttribute('src','img/common/grade_bronze.png');
}else {
    gradeImg.setAttribute('src','');
}
