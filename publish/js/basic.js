// modal
function modal_close(){
    document.getElementById('modal_wrap').style.display = "none";
}

//document.querySelectorAll('.modal_content').style.display = "none";
//
//function modal_open(content){
//    console.log(content);
//    document.getElementById('modal_wrap').style.display = "block";
//    const modalContent = content;
//    modalContent.classList.add('block');
//}

$('.modal_btn').click(function(){
    $('#modal_wrap').show();
    $('.modal_content').hide();
    $($(this).attr('title')).show();
})