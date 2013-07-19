function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

var ctripAds = ctripAds || {};
if(ctripAds.isInit){
  ctripAds.updateConfig(G_adContentConfig);
}else{
	ctripAds.init = function(config){
		ctripAds.isInit = true;
		if(config.length==0){return false;}
		ctripAds.queue = {};

		ctripAds.browser = {};
		ctripAds.browser.isHtml5 = isCanvasSupported();
		ctripAds.browser.isIE = /msie (\d+)/.test(navigator.userAgent.toLowerCase());

		for(var key in config){
			var n = new ctripSingleAd(key, config[key]);
			ctripAds.queue[key] = n;
		}
	}

	ctripAds.updateConfig = function(config){
		for(var key in config){
			ctripAds.queue[key].updateConfig(config[key]);
		}
	}

	ctripAds.loadJs = function(url){
		 var newJs = document.createElement('script'); 
		 newJs.type = 'text/javascript'; 
		 newJs.async = true;
		 newJs.src = url;
		 var s = document.getElementsByTagName('script')[0];
		 s.parentNode.insertBefore(newJs, s);
	}

	var ctripSingleAd = function(dom, config){
		this.dom = document.getElementById(dom);
		this.config = config;
		this.init();
	}

	ctripSingleAd.prototype = {
		init: function(){
			var _this = this;
			this.mod = this.config.length == 1?"single":"multi"; //是多帧广告还是单帧广告
			this.lastIndex = -1;
			this.currentIndex = 0;
			this.genHtml();
			
			if(this.mod == "multi"){
				this.setEffect();
			}	
		},

		updateConfig: function(config){
			if(this.mod == "single"){
				this.updateSingleAd(this.dom_ads[0], this.dom_img[0], config[0]);
			}else{
				for(var i=0,l=config.length; i<l; i++){
					if(config[i]["code"] == "success"){
						this.config[i] = config[i];
					}
				}
			}
		},

		genHtml: function(){
			var t = this.config;
			var dom = this.dom;
			var adArr = ['<div class="pics">'], dotArr=[];

			if(this.mod == "single"){ //single ad
				var ad = t[0];
				adArr.push('<a href="'+ad["link"]+'" target="_blank" data-ct="'+ad["clickTrackUrl"]+'" data-adid="'+ad["adid"]+'">\
					<img src="'+ad["src"]+'" width="'+ad["width"]+'" height="'+ad["height"]+'">\
					</a>');
			}else{	//multi ads
				dotArr = ['<ul class="pic_numlist" style="z-index:20">'];
				for(var i=0, l=t.length; i<l; i++){
					var ad = t[i];
					//preload images, send onloadtrack info to jinzan
					var img = new Image();
					img.onload = function(){
						var onloadTrackImg = new Image();
						onloadTrackImg.src = ad["onloadTrackUrl"];
					};
					img.src = ad["src"];

					if(i<2){ 
						if(ctripAds.browser.isHtml5 && !ctripAds.browser.isIE){ //firefox chrome(not IE) browser, generate 2 images
							var adContent = '<a href="'+ad["link"]+'" target="_blank" style="position:absolute;display:block;z-index:'+(t.length-i)+';" data-ct="'+ad["clickTrackUrl"]+'"  data-adid="'+ad["adid"]+'">\
									<img src="'+ad["src"]+'" width="'+ad["width"]+'" height="'+ad["height"]+'">\
									</a>';
						}else{ //IE and not html5 browser, generate only one image,use filter fade property.
							if(i==0){
								var adContent = '<a href="'+ad["link"]+'" target="_blank" data-ct="'+ad["clickTrackUrl"]+'" data-ct="'+ad["clickTrackUrl"]+'"  data-adid="'+ad["adid"]+'">\
									<img src="'+ad["src"]+'" width="'+ad["width"]+'" height="'+ad["height"]+'">\
									</a>';
							}
						}
						adArr.push(adContent);
					}
					dotArr.push("<li data-index='"+i+"' class="+(i==0?"pic_current":"")+"></li>");
				}
				dotArr.push("</ul>");
			}
			
			adArr.push("</div>");
			this.dom.innerHTML = adArr.join("") + dotArr.join("");

			//clear the loading background image
			this.dom.style.background="url(\"#\")";

			//get common doms
			this.dom_img = this.dom.getElementsByTagName("IMG");
			this.dom_ads = this.dom.getElementsByTagName("A");
			this.dom_dots = this.dom.getElementsByTagName("LI");
	 
			this.bindEvent();

			//get the newest config file
			ctripAds.loadJs("ctripads.js");

		},

		bindEvent: function(){
			var _this = this;
			this.dom.onclick = function(e){
				var e = window.event || e;
				var el = e.target || e.srcElement;
				if(el.tagName == "LI"){//click the bottom dots
					var index = el.getAttribute("data-index");
					_this.gotoAd(parseInt(index,0));
				}else if(el.tagName == "IMG"){ //click image to send onclicktrack to jinzan
					ctripAds.loadJs(el.parentNode.getAttribute("data-ct"));
				}
			}
		},

		setEffect: function(){
			var _this = this;
			
			this.timer = setTimeout(function(){
				_this.gotoAd();
			},2000);
		},

		updateSingleAd: function(dom_ad, dom_img, config){
			dom_ad.href = config["link"];
			dom_ad.setAttribute("data-ct" , config["clickTrackUrl"]);
			dom_ad.setAttribute("data-adid" , config["adid"]);
			dom_img.src = config["src"];
			dom_img.style.width = config["width"];
			dom_img.style.height = config["height"];

		},

		gotoAd: function(index){
			clearTimeout(this.timer);
			this.lastIndex = this.currentIndex;
			if(arguments.length>=1){
				this.currentIndex = arguments[0];
			}else{
				this.currentIndex ++;
			}
			if(this.currentIndex >=this.config.length){this.currentIndex = 0;}
			

			if(ctripAds.browser.isIE){ // user ie filter fade property
				 this.dom.filters[0].stop();
				 this.dom.filters[0].apply();
				 this.dom_img[0].src = this.config[this.currentIndex].src;
				 this.dom.filters[0].play();
			}else if(ctripAds.browser.isHtml5){ //use animation classname
				var next = ((this.currentIndex+1) < (this.config.length-1))?(this.currentIndex+1):0;
				this.dom_ads[1-this.currentIndex%2].className = "ani-out";
				this.updateSingleAd(this.dom_ads[this.currentIndex%2], this.dom_img[this.currentIndex%2], this.config[this.currentIndex]);
				this.dom_ads[this.currentIndex%2].className = "ani-in";
			}else{ //only set display block/none
				this.updateSingleAd(this.dom_ads[0], this.dom_img[0], this.config[this.currentIndex]);
			}
		
			this.dom_dots[this.currentIndex].className = "pic_current";
			this.dom_dots[this.lastIndex].className = "";
			 this.setEffect();
		}
	}

	ctripAds.init(G_adContentConfig);
}
