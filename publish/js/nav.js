$(function(){
	$('#nav').hide();
	$('.all_menu').click(function(){
		$('#nav').slideToggle();
	});
});

 // 햄버거메뉴 on/off
 function menu_show(){
	const nav = document.getElementById('menu');
	const sitemap = document.getElementById('sitemap');
	if (nav.classList.contains('nav_on')) {
		sitemap.style.left = '-200vh';
		nav.classList.remove('nav_on');
	} else {
		sitemap.style.left = 0;
		nav.classList.add('nav_on');
	}
}
$(function(){
	$('#nav1_s').hide();
	$('#nav1').click(function(){
		$('#all_sitemap').slideToggle();

		$('#all_contecus').slideUp();
		$('#nav3_s').slideUp();
		$('#nav4_s').slideUp();
		$('#nav5_s').slideUp();
		$('#nav6_s').slideUp();
		$('#nav7_s').slideUp();
	});
});

$(function(){
	$('#nav2_s').hide();
	$('#nav2').click(function(){
		$('#nav2_s').slideToggle();

		$('#nav1_s').slideUp();
		$('#nav3_s').slideUp();
		$('#nav4_s').slideUp();
		$('#nav5_s').slideUp();
		$('#nav6_s').slideUp();
		$('#nav7_s').slideUp();
	});
});
$(function(){
	$('#nav3_s').hide();
	$('#nav3').click(function(){
		$('#nav3_s').slideToggle();

		$('#nav1_s').slideUp();
		$('#nav2_s').slideUp();
		$('#nav4_s').slideUp();
		$('#nav5_s').slideUp();
		$('#nav6_s').slideUp();
		$('#nav7_s').slideUp();
	});
});
$(function(){
	$('#nav4_s').hide();
	$('#nav4').click(function(){
		$('#nav4_s').slideToggle();

		$('#nav1_s').slideUp();
		$('#nav2_s').slideUp();
		$('#nav3_s').slideUp();
		$('#nav5_s').slideUp();
		$('#nav6_s').slideUp();
		$('#nav7_s').slideUp();
	});
});

$(function(){
	$('#nav5_s').hide();
	$('#nav5').click(function(){
		$('#nav5_s').slideToggle();

		$('#nav1_s').slideUp();
		$('#nav2_s').slideUp();
		$('#nav3_s').slideUp();
		$('#nav4_s').slideUp();
		$('#nav6_s').slideUp();
		$('#nav7_s').slideUp();
	});
});

$(function(){
	$('#nav6_s').hide();
	$('#nav6').click(function(){
		$('#nav6_s').slideToggle();

		$('#nav1_s').slideUp();
		$('#nav2_s').slideUp();
		$('#nav3_s').slideUp();
		$('#nav4_s').slideUp();
		$('#nav5_s').slideUp();
		$('#nav7_s').slideUp();
	});
});

$(function(){
	$('#nav7_s').hide();
	$('#nav7').click(function(){
		$('#nav7_s').slideToggle();

		$('#nav1_s').slideUp();
		$('#nav2_s').slideUp();
		$('#nav3_s').slideUp();
		$('#nav4_s').slideUp();
		$('#nav5_s').slideUp();
		$('#nav6_s').slideUp();
	});
});


