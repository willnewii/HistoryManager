(function(b,a){var c={};(function(){var j=a.querySelector('meta[name="viewport"]'),n=a.querySelector('meta[name="hotcss"]'),h=b.devicePixelRatio||1,i=540,m=0;h=h>=3?3:(h>=2?2:1);if(n){var f=n.getAttribute("content");if(f){var l=f.match(/initial\-dpr=([\d\.]+)/);if(l){h=parseFloat(l[1])}var k=f.match(/max\-width=([\d\.]+)/);if(k){i=parseFloat(k[1])}var d=f.match(/design\-width=([\d\.]+)/);if(d){m=parseFloat(d[1])}}}a.documentElement.setAttribute("data-dpr",h);c.dpr=h;a.documentElement.setAttribute("max-width",i);c.maxWidth=i;if(m){a.documentElement.setAttribute("design-width",m);c.designWidth=m}var e=1/h,g="width=device-width, initial-scale="+e+", minimum-scale="+e+", maximum-scale="+e+", user-scalable=no";if(j){j.setAttribute("content",g)}else{j=a.createElement("meta");j.setAttribute("name","viewport");j.setAttribute("content",g);a.head.appendChild(j)}})();c.px2rem=function(e,d){if(!d){d=parseInt(c.designWidth,10)}return parseInt(e,10)*320/d/20};c.rem2px=function(e,d){if(!d){d=parseInt(c.designWidth,10)}return e*20*d/320};c.mresize=function(){var d=a.documentElement.getBoundingClientRect().width||b.innerWidth;if(c.maxWidth&&(d/c.dpr>c.maxWidth)){d=c.maxWidth*c.dpr}if(!d){return false}a.documentElement.style.fontSize=(d*20/320)+"px";c.callback&&c.callback()};c.mresize();b.addEventListener("resize",function(){clearTimeout(c.tid);c.tid=setTimeout(c.mresize,33)},false);b.addEventListener("load",c.mresize,false);setTimeout(function(){c.mresize()},333);b.hotcss=c})(window,document);