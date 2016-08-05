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
<script type="text/javascript" src="/js/libs/jquery.js"></script>
<script type="text/javascript" src="/js/lottery/index.js"></script>
```
实现下拉
```
<script type="text/javascript">
    var lott = new lottery({
        mainWrap: '.card-inner',
        canvasName: 'card-canvas',
        logoUrl: '/images/card-bg.png',
        initTxt: '刮奖区',
        startFn: function () {
            $('div.card-inner').append('<img src="/images/test.jpg" width="100%" height="100%" />');
        },
        endFn: function () {
            console.log(2);
        }
    });
    $('button').on('click', function () {
        lott.init(function () {
            $('div.card-inner').append('<img src="/images/test1.jpg" width="100%" height="100%" />');
        })
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
lott.init: 重置刮奖区域，传参为startFn，主要用来重置中奖信息的背景，需要传别的参数可自行配置
</code></pre>
