/**
 *	常用公共效果
 */
$(function(){

	/*左侧高度*/
	$(".gdul_sidebar").css("height", $(window).height() - 65);

	/*列表*/
	$(".gdul_tablist li.item").hover(function(){
		$(this).css("background","#f4f7fc");
		$(this).find(".info_icon").css("display","inline-block");
	},function(){
		 if(!$(this).hasClass('cur')){
			$(this).css("background","#fff");
			$(this).find(".info_icon").css("display","none");
		}
		else{
			$(this).css("background","#f4f7fc");
			$(this).find(".info_icon").css("display","none");
		}
	});

	$(".gdul_tablist li.item").click(function () {
		if(!$(this).hasClass('cur')){
			$(this).addClass("cur");
			$(this).find(".cklabel").addClass("on");
		}
		else{
			$(this).removeClass("cur");
			$(this).find(".cklabel").removeClass("on");
		}
	});

	$(".gdul_filecata li .item").click(function(){
		if($(this).siblings(".sub_file").is(":hidden")){
			$(this).find("i.iconfont").html("&#xe6c3;");
		}else{
	  		$(this).find("i.iconfont").html("&#xe7bc;");
		}
		$(this).siblings(".sub_file").slideToggle(200);
	});

});