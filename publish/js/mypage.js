// 스크롤 시 fixed
document.addEventListener('DOMContentLoaded', function() {
    scrollAct();
});
function scrollAct() {
    var fixedMenu = document.querySelector('.fixed_menu');
    var position = fixedMenu.offsetTop; // fixed 메뉴 위치

    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset; // 현재 스크롤 위치
        var footer = document.querySelector('footer');
        var footerH = footer.offsetHeight + 150; // footer 높이
        var wrap = document.querySelector('.wrap');
        var wrapH = wrap.offsetHeight; // 모든 컨텐츠 높이
        var conH = wrapH - footerH - fixedMenu.offsetHeight - position; // footer 까지 스크롤 도달 위치 계산

        if (scrollTop + 15 > position) {
            if (conH + position - 30 > scrollTop) {
                fixedMenu.style.position = 'fixed';
                fixedMenu.style.top = '0';
            } else {
                fixedMenu.style.position = 'absolute';
                fixedMenu.style.top = conH + 'px';
            }
        } else {
            fixedMenu.style.position = 'absolute';
            fixedMenu.style.top = '0';
        }
    });
}

//마이페이지-회원정보수정 이미지교체
$('#change_profile_img').children('img').click(function(){
    var changeImgSrc = $(this).attr('src');
    $('#change_profile_select').children('img').attr('src', changeImgSrc);
});