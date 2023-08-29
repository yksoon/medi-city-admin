$(function () {
    // !! 페이지 이동시 gnb 그대로 열려있어야함
    $(".sub_2depth").hide();
    $(".sub_3depth").hide();
    $(".sub_gnb > li > a").click(function () {
        $(".sub_2depth").slideUp();
        $(".sub_gnb > li > a").removeClass("on");
        $(this).siblings(".sub_2depth").slideToggle();
        $(this).toggleClass("on");
    });
    $(".sub_2depth > li > a").click(function () {
        $(this).siblings(".sub_3depth").slideToggle();
        $(this).toggleClass("on");
    });
    $("#all_gnb").click(function () {
        $(".sub_2depth").slideToggle();
        $(".sub_3depth").slideToggle();
    });
});

//퍼블 할때마다 페이지 추가
function navList(listName) {
    switch (listName) {
        case "dash":
            location.href = "index.html";
            break;

        case "memberList":
            location.href = "member_list.html";
            break;

        case "hotelList":
            location.href = "hotel_list.html";
            break;
            
        case "hotelRoom":
            location.href = "room_list_full.html";
            break;

        case "hotelFacilities":
            location.href = "hotel_facilities.html";
            break;

        case "hotelFacilities":
            location.href = "hotel_facilities.html";
            break;

        case "kMediMemberLocal":
            location.href = "kmedi_member_local.html";
            break;

        case "kMediMemberKorea":
            location.href = "kmedi_member_creator.html";
            break;

        case "kMediContent":
            location.href = "kmedi_content.html";
            break;

        default:
            break;
    }
}

// document.addEventListener("DOMContentLoaded", function() {
// 	var sub2depthElements = document.querySelectorAll('.sub_2depth');
// 	var sub3depthElements = document.querySelectorAll('.sub_3depth');
// 	var subGnbLinks = document.querySelectorAll('.sub_gnb > li > a');
// 	var sub2depthLinks = document.querySelectorAll('.sub_2depth > li > a');
// 	var allGnbButton = document.getElementById('all_gnb');

// 	sub2depthElements.forEach(function(element) {
// 		element.style.display = 'none';
// 	});

// 	sub3depthElements.forEach(function(element) {
// 		element.style.display = 'none';
// 	});

// 	subGnbLinks.forEach(function(link) {
// 		link.addEventListener('click', function() {
// 			sub2depthElements.forEach(function(element) {
// 				element.style.display = 'none';
// 			});
// 			subGnbLinks.forEach(function(link) {
// 				link.classList.remove('on');
// 			});
// 			this.nextElementSibling.style.display = 'block';
// 			this.classList.toggle('on');
// 		});
// 	});

// 	sub2depthLinks.forEach(function(link) {
// 		link.addEventListener('click', function() {
// 			this.nextElementSibling.style.display = 'block';
// 			this.classList.toggle('on');
// 		});
// 	});

// 	allGnbButton.addEventListener('click', function() {
// 		sub2depthElements.forEach(function(element) {
// 			element.style.display = 'block';
// 		});
// 		sub3depthElements.forEach(function(element) {
// 			element.style.display = 'block';
// 		});
// 	});
// });
