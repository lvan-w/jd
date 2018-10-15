// 移动端是否可以用jq
// 可以用但是不建议用jq,(jq兼容好体积大 加载慢80kb);
// 用h5apic3
// window.onload=function (ev) {}页面所有资源加载完成执行

// $(function (param) {});区别页面文档加载完成执行不包括资源
document.addEventListener('DOMContentLoaded', function () {
    new Search('.jd_header_box');
    new Banner('.jd_banner');
    new DownTime('.sk_time');
});
var Search = function (selector) {
    this.el = document.querySelector(selector);
    this.bannerHeight = document.querySelector('.jd_banner').offsetHeight;
    this.maxOpacity = 0.85;
    this.init();
};
Search.prototype.init = function () {
    var that = this;
    // 业务逻辑
    // 1.rgba(216,80,92,0)全透明
    that.el.style.background = 'rgba(216,80,92,0)';
    // 2.当页滚动的时候 透明度改变
    window.onscroll = function (ev) {
        // 滚动的距离 选区的大小
        var scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
        // 轮播图的高度 this.annerHeight
        var opacity = 0;
        // 2.1当在轮播图以内滚的时候 滚动的距离越多透明度越多
        if (scrollTop < that.bannerHeight) {
            opacity = scrollTop / that.bannerHeight * that.maxOpacity;
        }
        // 2.2当已经滚出了轮播图 透明度固定不变0.85
        else {
            opacity = that.maxOpacity;
        }
        that.el.style.background = 'rgba(216,80,92,' + opacity + ')';
    }
};
// 1 轮播图 无缝滚动 
// 2.点的对应改变
// 3.滑动效果
// 4,滑动的距离不超过3分之1再回去
// 5,滑动超过3分之1要切换图片
// 6, 根据体感比较快的速度也可以切换
var Banner = function (selector) {
    // selector 轮播图选择器
    this.banner = document.querySelector(selector);
    // 拿到轮播图的宽度
    this.width = this.banner.offsetWidth;
    // 找到图片容器
    this.imageBox = this.banner.querySelector('ul:first-child');
    // 点容器
    this.poinitBox = this.banner.querySelector('ul:last-child');
    // 当前索引
    this.index = 1;
    // 定时器
    this.timer = null;
    // 切换时间
    this.speed = 1000;
    // 调用初始化函数
    this.init();
};
//  初始化的函数
Banner.prototype.init = function () {
    this.autoPlay();
    this.seamless();
    this.swipeAble();
};
// 自动播放
Banner.prototype.autoPlay = function () {
    var that = this;
    // 根据当前索引每隔一段时间进行切换
    that.timer = setInterval(function () {
        that.index++;
        //  动画的切换
        // 过渡
        // that.imageBox.style.transition = 'all 0.2s';
        // that.imageBox.style.webkitTransition = 'all 0.2s';
        that.addTransition();
        // 位移
        // that.imageBox.style.transform = 'translateX(' + (-that.index * that.width) + 'px)';
        // that.imageBox.style.webkitTransition = 'translateX(' + (-that.index * that.width) + 'px)';
        that.setTranslateX(-that.index * that.width);
    }, that.speed);
};
// 无缝的衔接
Banner.prototype.seamless = function () {
    var that = this;
    // 无缝滚动
    // 监听到第8张[8]图到第1张[9]切换完成 瞬间定位到第一张[1] 索引
    this.imageBox.addEventListener('transitionend', function () {
        // console.log(that.index);
        if (that.index >= 9) {
            that.index = 1;
            // 去掉过渡
            // that.imageBox.style.transition = 'none';
            // that.imageBox.style.webkitTransition = 'none';
            that.removeTransition()

            // 再位移
            // that.imageBox.style.transform = 'translateX(' + (-that.index * that.width) + 'px)';
            // that.imageBox.style.webkitTransition = 'translateX(' + (-that.index * that.width) + 'px)';
            that.setTranslateX(-that.index * that.width);
        }
        // 无缝滑动
        // 监听到第1张[1]图到第8张[0]切换完成 瞬间定位到第8张[8] 索引
        else if (that.index <= 0) {
            that.index = 8;
            // 去掉过渡
            // that.imageBox.style.transition = 'none';
            // that.imageBox.style.webkitTransition = 'none';
            that.removeTransition();
            // 再位移
            // that.imageBox.style.transform = 'translateX(' + (-that.index * that.width) + 'px)';
            // that.imageBox.style.webkitTransition = 'translateX(' + (-that.index * that.width) + 'px)';
            that.setTranslateX(-that.index * that.width);
        }
        // 切换点 index的取值范围1-8
        that.togglePoint();
    })

};
//  2.点的对应改变
Banner.prototype.togglePoint = function () {
    // 去掉当前背景
    this.poinitBox.querySelector('li.now').classList.remove('now');
    // 给当前的加上背景
    this.poinitBox.querySelectorAll('li')[this.index - 1].classList.add('now');

}
// 添加过渡
Banner.prototype.addTransition = function () {
    this.imageBox.style.transition = 'all 0.2s';
    this.imageBox.style.webkitTransition = 'all 0.2s';
}
// 去除过渡
Banner.prototype.removeTransition = function () {
    this.imageBox.style.transition = 'none';
    this.imageBox.style.webkitTransition = 'none';
}
// 设置定位
Banner.prototype.setTranslateX = function (translateX) {
    this.imageBox.style.transform = 'translateX(' + translateX + 'px)';
    this.imageBox.style.webkitTransition = 'translateX(' + translateX + 'px)';

}
// 滑动功能
Banner.prototype.swipeAble = function () {
    // 滑动的思路:
    // 记录起始的点x 轴坐标
    //  然后滑动的过程中
    //  获取当前的点x轴坐标
    //  然后去比较之前的
    //  出来的距离 图片容器需要位移的距离
    var that = this;
    var startX = 0;//起始的x坐标
    var distanceX = 0;//滑动的x坐标
    var startTime = 0;//起始时间
    that.imageBox.addEventListener('touchstart', function (e) {
        var startX = e.touches[0].clientX;
        startTime = Date.now();
        //    清除定时器
        clearInterval(that.timer);
    });
    that.imageBox.addEventListener('touchmove', function (e) {
        var moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        // 计算图片容器的位移 
        // 将要移动的位置=原来的位置+改变的距离
        var translateX = -that.index * that.width + distanceX;
        // 滑动 设置位移 不用过渡
        that.removeTransition();
        that.setTranslateX(translateX);
        // console.log(distanceX);
    });
    that.imageBox.addEventListener('touchend', function () {
        // 6, 根据体感比较快的速度也可以切换
        // 速度=距离/时间 单位:px/ms 体会 快是多少 体感速度
        var t = Date.now() - startTime;
        var v = Math.abs(distanceX) / t;
        // console.log(v);
        if (v > 0.3) {
            // 滑动结束 动画切换图片 上一张 下一张
            //  右划一张
            if (distanceX > 0) {
                that.index--;
            } //左滑
            else {
                that.index++;
            }
            //  动画
            that.addTransition();
            that.setTranslateX(-that.index * that.width);
        } else {
            // 滑动结束 吸附效果
            if (Math.abs(distanceX) < that.width / 3) {
                // 动画回到原来的位置 
                that.addTransition();
                that.setTranslateX(-that.index * that.width);
            } else {
                // 滑动结束 动画切换图片 上一张 下一张
                if (distanceX > 0) {
                    that.index--;
                } else {
                    that.index++;
                }
                //  动画
                that.addTransition();
                that.setTranslateX(-that.index * that.width);
            }
        }

        // 加定时器
        clearInterval(that.timer);
        that.autoPlay(); 
        // 重置参数
        startX=0;
        startTime=0;
        distanceX=0;
    });
}
// 倒计时
var DownTime=function(selector){
    this.el=document.querySelector(selector);
    this.time=2*60*60;
    this.timer=null;
this.init();

}
DownTime.prototype.init=function (){
    // 倒计时需求
    // 1假设一个世界
    // 2.每隔一秒修改黑色容器数字
    var that=this;
    var spans=that.el.querySelectorAll('span');
    this.timer=setInterval(function () {
        that.time--;
        var h=Math.floor(that.time/3600);
        var m=Math.floor(that.time%3600/60);
        var s=Math.floor(that.time%60);
        // 时
        spans[0].innerHTML=Math.floor(h/10);
        spans[1].innerHTML=h%10;
        // 分
        spans[3].innerHTML=Math.floor(m/10);
        spans[4].innerHTML=m%10;

        // 秒
        spans[6].innerHTML=Math.floor(s/10);
        spans[7].innerHTML=s%10;
        // 倒计时结束
        if(that.time==0){
         clearInterval(that.time)
        }
      },1000);

}