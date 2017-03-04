刮刮卡
=========
简介
-----------
canvas刮刮卡

Example
-----------
定义放置canvas内容的容器
```html
<div class="card-wrap">
    <div class="card-inner"></div>
    <button>111</button>
</div>
```
引入样式文件，js文件
```
可以自定义外框的一些基本样式（位置、边框等）
没有依赖jq库，为了方便操作dom您也可自行依赖
<script type="text/javascript" src="/js/lottery/index.js"></script>
```
方法调用
```
<script type="text/javascript">
    var lott = new lottery({
        mainWrap: '.card-inner',    //装在canvas容器
        canvasName: 'card-canvas',  //canvas类名
        logoUrl: './images/card-bg.png',
        initTxt: '刮奖区',
        startFn: function () {
            var img = document.createElement('img');
            img.src = './images/test.jpg';
            img.width = document.querySelector('.card-inner').clientWidth;
            img.height = document.querySelector('.card-inner').clientHeight;
            document.querySelector('.card-inner').appendChild(img);
        }, 
        endFn: function () {
            console.log(2);
        }
    });
    document.getElementsByTagName('button')[0].addEventListener('click', function () {
        lott.init({
            startFn: function () {
                var img = document.createElement('img');
                img.src = './images/test1.jpg';
                img.width = document.querySelector('.card-inner').clientWidth;
                img.height = document.querySelector('.card-inner').clientHeight;
                document.querySelector('.card-inner').appendChild(img);
            }
        });
    });
</script>
```

参数说明
----------
<pre><code>
mainWrap: 装在canvas及背景信息的容器类名
canvasName: 给canvas定义的类名
logoUrl: canvas上层的水印层，可为空
initTxt: canvas上的默认一些提示文字，可为空
startFn: 初始化时需要执行的操作，ajax请求获取中奖的信息填充到canvas容器的下层
endFn: 刮奖完成后需要执行的操作，如显示中奖信息弹框等
lott.init: 重置刮奖区域，可以重置需要修改的参数
</code></pre>

注
----------
刮刮卡有计算刮除的面积，默认刮除30%后背景全显示，但在本地运行时会有报错信息，主要是缺少环境造成的，建议配置环境运行，本地运行不影响其他功能
