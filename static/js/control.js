/**
 *	单选按钮/复选按钮/上传文件效果Jquery插件
 */
(function($){
	
	$.fn.extend({
		/**
		 *	复选框效果
		 */
		checkbox : function(){
			/**
			 *	页面初始化效果处理
			 */
			$(this).each(function(){
				if($(this).hasClass("on")){
    				$(this).siblings("input").attr("checked", true);
    			}else{
    				$(this).siblings("input").attr("checked", false);
    			}
			});
			/**
			 *	单击事件绑定
			 */
			$(this).live("click",function(){
				if($(this).hasClass("on")){
					$(this).siblings("input").attr("checked", false);
					$(this).removeClass("on");
				}else{
					$(this).siblings("input").attr("checked", true);
					$(this).addClass("on");
				}
			});	
		},
		/**
		 *	单选框效果
		 */
		radio : function(){
			/**
			 *	页面初始化效果处理
			 */
			$(this).each(function(){
				if($(this).hasClass("on")){
    				$("input").attr("checked", true);
    			}else{
    				$("input").attr("checked", false);
    			}
    			
			});
			/**
			 *	单击事件绑定
			 */
			$(this).live("click",function(){
				//获得单选的name属性，该属性页面必须指定，并且同组的name相同
				var name = $(this).siblings("input").attr("name");
				//名称没有设置，单击效果无效
				if(name && name != '') {
					//获得同组（相同name属性的radio）的所有radio控件
					var allRadio = $(document).find("input[type='radio'][name='" + name + "']");
					//当前按钮没有选中，做选中处理，如果已经选中不做任何处理
					if(!$(this).hasClass("on")){
						//全部去除选中
						allRadio.attr("checked", false);
						allRadio.siblings(".rdlabel").removeClass("on");
						//当前单击的再选中
						$(this).siblings("input").attr("checked", true);
						$(this).addClass("on");
					}
				}
			});
		},
		/**
		 *	上传文件效果
		 */
		file : function(){
			
			/**
			 *	单击事件绑定
			 */
			$(this).live("change",function(obj){
				/**
				 *	获取事件源，兼容chrome/IE
				 */
				var src = obj.target || window.event.srcElement;
				/**
				 *	获取放文件名位置
				 */
				var fname = $(this).parent().find(".filename");
				/**
				 *	下面把路径截取为文件名
				 */
				var filename=src.value;
				fname.text(filename.substring( filename.lastIndexOf('\\')+1 ));
				fname.attr("title",filename.substring( filename.lastIndexOf('\\')+1 ));
				fname.css("color","#333");
				/**
				 *	触发按钮
				 */
				if(filename.length!=0){  
					$(this).parent().find(":button").addClass("zbztb_greebtn").removeClass("zbztb_notbtn").attr("disabled",false);
				}
			});	
		}
	});
})(jQuery);

/**
 *	页面初始化处理所有单选/复选框/上传文件效果
 */
$(function(){
	$(".cklabel").checkbox();
	$(".rdlabel").radio();
	$(".fflabel").file();
});