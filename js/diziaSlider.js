//mobiwoos@naver.com 
//cha nam il

(function($){
	$.fn.diziaSlider = function(options){
		return this.each(function(){
			options = $.extend({
				background : true, //background img use
				type  : 'slide', // slide, fade
				speed : 5000,
				delay : 1000,
				auto		: true,
			    controls	: true,		
				prevText	: '이전',	
				nextText	: '다음',	
				pager		: true,		
				autoControls: true
			},options);
				
			var _that = $(this);
			var count = 0;
			var wrapping = _that.parent();
			var li = null;
			var len = null;
			var width = null;
			var autoControl = true;
			var first = _that.find("li:first");
			var last = _that.find("li:last");
			var timer = 0;
			

			var slider = {
				init : function(){
					_that.wrap("<div class='diziaSlider-wrap'></div>");
					_that.find("li").css("width",wrapping.css('width'));
					li = _that.find("li").width();
					len = _that.find("li").length;
					width = li * (len+2);
					
					$(window).resize(function(){
						 _that.find("li").css("width",wrapping.css('width'));
						 li = _that.find("li").width();
						 if(options.type=="slide"){
							width = li * (len+2);
							_that.css({"width":width,"left": - li})		
						 }
					});

					if(options.background){
						var arrsrc = [];
						for(var i=0; i<len;i++){
							var src = _that.find("li").eq(i).find("img").attr("src");	
							arrsrc.push(src);
							_that.find("li").eq(i).css({"background":"url("+arrsrc[i]+")","background-size":"cover","background-position":"50% 50%"});
							_that.find("li").find("img").hide();
							
						}	
					}
					if(options.type=="slide"){
						last.clone().prependTo(_that);
						first.clone().appendTo(_that);
						_that.find("li a").attr("tabIndex",0);
						_that.find("li:last a").attr("tabIndex",-1);
						_that.find("li:first a").attr("tabIndex",-1);
					}
					options.type=="slide" ? _that.css({"width":width,"left": - li}) : _that.css({"width":"100%"})
					
					
					if(options.type=="fade"){
						_that.find("li").css({"position":"absolute","left":0,"top":0})
						_that.find("li:not(:first)").hide();
					}

					if(options.controls){
						$(".diziaSlider-wrap").prepend("<div class='dizia-btn'><a href='javascript:;' class='dizia-prev'>"+options.prevText+"</a><a href='javascript:;' class='dizia-next'>"+options.nextText+"</a></div>");
					}
					if(options.pager){
						var anchor =""; "<a href='javascript:;'></a>";
						$(".diziaSlider-wrap").append("<div class='paging'></div>");
						for(var i=1; i<=len;i++){
							anchor = "<a href='javascript:;'>"+i+"</a>";
							$(".paging").append(anchor);
						}
						var an = wrapping.find(".paging a");
						an.first().addClass("on");
					}
					

					if(options.autoControls){
						$(".dizia-btn").append("<a href='javascript:;' class='dizia-control on'>stop</a>");
					}

					var prevBtn = wrapping.find(".dizia-prev"),
						nextBtn = wrapping.find(".dizia-next"),
						controlBtn = wrapping.find(".dizia-control")

					slider.controls(prevBtn,nextBtn,controlBtn);
					
				},
				controls : function(prevBtn,nextBtn,controlBtn){

					function next(){
						var delay = Math.abs(timer - $.now());
						if(delay > 500){
							timer = $.now();
							count++;
							if(count >len -1){
								count = 0
							}
							if(options.type=="slide"){
								var left = _that.css("left");
								if(left == -(width - li)+"px"){
									_that.css("left",-li);
								}
								_that.stop().animate({
									left : "-="+li+"px"
								},options.speed);
							}else{
								_that.find("li").fadeOut(options.speed);
								_that.find("li").eq(count).stop().fadeIn(options.speed);
							}
							
						}
						on();
					}
					function prev(){
						var delay = Math.abs(timer-$.now());
						if (delay > 500) {
							timer = $.now();
							count--;
							if(count < 0){
								count = len - 1
							}
							if(options.type=="slide"){
								var left = _that.css("left");
								if(left == 0+"px"){
									_that.css("left",-(width-(li*2)));
								}
								_that.animate({
									left : "+="+li+"px"	
								},options.speed);
							}else{
								_that.find("li").fadeOut(options.speed);
								_that.find("li").eq(count).stop().fadeIn(options.speed);
							}
	
						}
						on();
					}

					function on(){
						$(".paging a").removeClass("on");
						$(".paging a").eq(count).addClass("on");
					}

					nextBtn.on("click",function(){
						next();
					});
					prevBtn.on("click",function(){
						prev();
					});

					if(options.auto){
						var slideInterval = setInterval(next,options.delay);
						$(".diziaSlider-wrap").on("mouseover focusin",function(){
							stop();	
						});
						$(".diziaSlider-wrap").on("mouseleave blur",function(){
							play();	
						});
					}

					function stop(){
						clearInterval(slideInterval);
					}

					function play(){
						slideInterval = setInterval(next,options.delay);
					}

					controlBtn.on("click",function(){
						if(autoControl){
							autoControl = false;
							$(this).text("start").removeClass("on");
							stop();
						}else{
							autoControl = true;
							$(this).text("stop").addClass("on");
							play();
						}
					});



					$(".paging a").on("click",function(){
						var idx = $(this).index();
						count = idx;
						$(".paging a").removeClass("on");
						$(this).addClass("on");
						if(options.type=="slide"){
							_that.animate({
								left : -(li*(idx+1))+"px"
							},300);	
						}else{
							_that.find("li").fadeOut(options.speed);
							_that.find("li").eq(count).stop().fadeIn(options.speed);
						}
					});

				}
			}
			slider.init();
		});
	}		
})(jQuery);
