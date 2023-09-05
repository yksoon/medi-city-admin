// modal

function modal_open(modalNum){
    let modalWrapNum = 'modal_wrap' + String(modalNum);
    document.getElementById(modalWrapNum).style.display = "block";
}

function modal_close(){
    $('.modal_wrap').css('display','none');
}

$('.kmedi_member_datail_tab li').click(function(){
    $(this).addClass('on');
    $(this).siblings('li').removeClass('on');
    $('.tabbox').hide();
    var tabbox = $(this).attr('id')  + "_box"
    $("." + tabbox).show();
});


// 썸네일 이미지 삭제
function thumb_delete(){
    $('.thumb_box').css('display','none');
    $('.category_icon_box').css('display','none');
}

