// 호텔 리스트 - 담당자 작은 모달
document.querySelectorAll('.person_btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        this.nextElementSibling.classList.toggle('on');
    });
});

//호텔신규등록 - 등급 별 스타일
$('.star').click(function(){
    $('.star').removeClass('on');
    $(this).addClass('on');
    $(this).prevAll().addClass('on');
});
/* Checkbox change event */
//$('.hotel_pay_box').hide();
$('input[name="FITNESS"]').change(function() {
    
    if ($('input[id="fitnessY"]').is(':checked')) {
        $(this).parent().shibling('.hotel_pay_box').show();
    }else{
        $(this).parent().shibling('.hotel_pay_box').hide();
    }
});