/**
 * @author H.Yvonne
 * @create 2016.8.5
 * lottery function
 */
(function (root,factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.lottery = factory());
        });
    } else {
        root.lottery = factory();
    }
})(this, function () {
    var Lottery = function (config) {
        this.init(config);
    }
    Lottery.prototype = {
        mainWrap: '',    //装在canvas容器
        canvasName: '',  //canvas类名
        logoUrl: '',
        initTxt: '刮奖区',
        percent: 0.3,    //刮百分之多少自动显示
        startFn: '',
        endFn: '',       //刮奖后方法
        canEve: true,    //是否可以刮奖

        //create element
        createElement: function () {
            document.querySelector(this.mainWrap).innerHTML = '';
            this.ele = document.createElement('canvas');
            this.ele.className = this.canvasName;
            this.resizeCanvas();
            this.ready && this.ready();  //ready方法
        },
        //scale canvas
        adjustRatio: function(ctx) {
            var backingStore = ctx.backingStorePixelRatio ||
                ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
            pixelRatio = (window.devicePixelRatio || 1) / backingStore;
            ctx.canvas.width = this.size.w * pixelRatio;
            ctx.canvas.height = this.size.h * pixelRatio;
            ctx.canvas.style.width = this.size.w + "px";
            ctx.canvas.style.height = this.size.h + "px";
            ctx.scale(pixelRatio, pixelRatio);
        },
        //resize canvas
        resizeCanvas: function () {
            this.size = {
                w: document.querySelector(this.mainWrap).clientWidth,
                h: document.querySelector(this.mainWrap).clientHeight
            }
            document.querySelector(this.mainWrap).appendChild(this.ele);
            this.ctx = this.ele.getContext('2d');
            this.ctx.save();
            this.adjustRatio(this.ctx);
            this.ctx.restore();
            this.setCanvasBg();
            if(this.canEve) {
                this.bindEvent();
            }
        },
        //init canvas
        setCanvasBg: function () {
            this.ctx.beginPath();
            this.ctx.fillStyle = '#aaa';
            this.ctx.fillRect(0,0,this.size.w,this.size.h);
            this.ctx.closePath();
            if(this.logoUrl && this.initTxt) {
                this.setLogo();
                return;
            }
            this.setLogo();
            this.setText();

        },
        setLogo: function () {
            var _self = this;
            if(_self.logoUrl) {
                _self.preImage(_self.logoUrl, function () {
                    _self.ctx.globalCompositeOperation='source-over';
                    _self.ctx.drawImage(this,0,0,_self.size.w,_self.size.h);
                    _self.setText();
                });
            }
        },
        setText: function () {
            if(this.initTxt) {
                this.ctx.globalCompositeOperation='lighter';
                this.ctx.font="18px Microsoft YaHei";
                var text = this.initTxt;
                this.ctx.fillText(text,(this.size.w-this.ctx.measureText(text).width)/2,(this.size.h)/2);
            }
        },
        bindEvent: function () {
            var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
            var clickEvtName = device ? 'touchstart' : 'mousedown';
            var moveEvtName = device? 'touchmove' : 'mousemove';
            var endEvtName = device? 'touchend' : 'mouseup';
            if (!device) {
                var isMouseDown = false;
                document.addEventListener('mouseup', function(e) {
                    isMouseDown = false;
                }, false);
            }
            //touchstart function
            this.ele.addEventListener(clickEvtName, function (e) {
                e.preventDefault();
                isMouseDown = true;
                if(typeof this.startFn === 'function') this.startFn();
                this.ctx.strokeStyle = "#f00";
                this.ctx.lineCap = "round";
                this.ctx.lineJoin="round";
                this.ctx.lineWidth = 20;
                this.ctx.beginPath();
                var x = (device ? e.targetTouches[0].clientX : e.clientX) + document.body.scrollLeft - document.querySelector(this.mainWrap).getBoundingClientRect().left;
                var y = (device ? e.targetTouches[0].clientY : e.clientY) + document.body.scrollTop - document.querySelector(this.mainWrap).getBoundingClientRect().top;
                this.ctx.moveTo(x, y);
            }.bind(this),false);

            this.ele.addEventListener(moveEvtName, function (e) {
                e.preventDefault();
                if (!device && !isMouseDown) {
                    return false;
                }
                this.ctx.globalCompositeOperation='destination-out';
                var x = (device ? e.targetTouches[0].clientX : e.clientX) + document.body.scrollLeft - document.querySelector(this.mainWrap).getBoundingClientRect().left;
                var y = (device ? e.targetTouches[0].clientY : e.clientY) + document.body.scrollTop - document.querySelector(this.mainWrap).getBoundingClientRect().top;
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }.bind(this),false);
            //计算刮除的百分比
            this.ele.addEventListener(endEvtName, function (e) {
                e.preventDefault();
                var num = 0;
                var datas = this.ctx.getImageData(0,0,this.size.w,this.size.h);
                for(var i = 0; i < datas.data.length; i++) {
                    if(datas.data[i] == 0) {
                        num++;
                    }
                };
                if(num >= datas.data.length*this.percent) {
                    n = 10;
                    var time = setInterval(function(){
                        if(n > 0){ 
                            n-=1; 
                            this.ele.style.opacity = '0.'+n;
                        }else{ 
                            clearTimeout(time); 
                            this.ctx.clearRect(0,0,this.size.w,this.size.h);
                            document.querySelector(this.mainWrap).removeChild(this.ele);
                            if(typeof this.endFn === 'function') this.endFn();
                        }
                    }.bind(this),30);
                }
            }.bind(this),false);
        },
        //preload image
        preImage: function (url,callback) {  
            var img = new Image(); //创建一个Image对象，实现图片的预下载  
            img.src = url;  

            if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
                callback.call(img);  
                return; // 直接返回，不用再处理onload事件  
            };

            img.onload = function () { //图片下载完毕时异步调用callback函数。  
                callback.call(img);//将回调函数的this替换为Image对象  
            };  
        },
        drawLottery: function () {
            this.createElement();
        },
        init: function (config) {
            var o;
            for(o in config) {
                this[o] = config[o];
            }
            this.drawLottery();
        }
    }
    return Lottery;
});