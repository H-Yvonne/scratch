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
        var o;
        for(o in config) {
            this[o] = config[o];
        }
        this.init();
    }
    Lottery.prototype = {
        mainWrap: '',    //装在canvas容器
        canvasName: '',  //canvas类名
        logoUrl: '',
        initTxt: '刮奖区',
        percent: 0.3,    //刮百分之多少自动显示
        startFn: '',     //movestart开始方法，获取奖品ajax并且插入内容到canvas图层下
        endFn: '',       //刮奖后方法

        //create element
        createElement: function () {
            document.querySelector(this.mainWrap).innerHTML = '';
            this.ele = document.createElement('canvas');
            this.ele.className = this.canvasName;
            this.resizeCanvas();
        },
        //resize canvas
        resizeCanvas: function () {
            this.size = {
                w: document.querySelector(this.mainWrap).clientWidth,
                h: document.querySelector(this.mainWrap).clientHeight
            }
            this.ele.width = this.size.w;
            this.ele.height = this.size.h;
            document.querySelector(this.mainWrap).appendChild(this.ele);
            if(typeof this.startFn === 'function') this.startFn();
            this.ctx = this.ele.getContext('2d');
            this.setCanvasBg();
            this.bindEvent();
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
                    _self.ctx.drawImage(this,0,0);
                    _self.setText();
                });
            }
        },
        setText: function () {
            if(this.initTxt) {
                this.ctx.globalCompositeOperation='lighter';
                this.ctx.font="20px Microsoft YaHei";
                var text = this.initTxt;
                this.ctx.fillText(text,(this.size.w-this.ctx.measureText(text).width)/2,(this.size.h-22)/2);
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
                this.ctx.strokeStyle = "#f00";
                this.ctx.lineCap = "round";
                this.ctx.lineJoin="round";
                this.ctx.lineWidth = 40;
                this.ctx.beginPath();
                var x = (device ? e.targetTouches[0].clientX : e.clientX) + document.body.scrollLeft - document.querySelector(this.mainWrap).offsetLeft;
                var y = (device ? e.targetTouches[0].clientY : e.clientY) + document.body.scrollTop - document.querySelector(this.mainWrap).offsetTop;
                this.ctx.moveTo(x, y);
            }.bind(this),false);

            this.ele.addEventListener(moveEvtName, function (e) {
                e.preventDefault();
                if (!device && !isMouseDown) {
                    return false;
                }
                this.ctx.globalCompositeOperation='destination-out';
                var x = (device ? e.targetTouches[0].clientX : e.clientX) + document.body.scrollLeft - document.querySelector(this.mainWrap).offsetLeft;
                var y = (device ? e.targetTouches[0].clientY : e.clientY) + document.body.scrollTop - document.querySelector(this.mainWrap).offsetTop;
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
        init: function (startfn) {
            this.startFn = arguments[0] || this.startFn;
            this.drawLottery();
        }
    }
    return Lottery;
});