var main = document.querySelector("#box");
var winW = window.innerWidth;
var winH = window.innerHeight;
var desW = 640;
var desH = 1008;
if(winW/winH <=desW/desH){
    main.style.webkitTransform = "scale("+winH/desH+")";
}else{
    main.style.webkitTransform = "scale("+winW/desW+")"
}

var oLis = document.querySelectorAll("#box>ul>li");

[].forEach.call(oLis,function(curLi,index){
    curLi.index = index;
    curLi.addEventListener("touchstart",start,false);
    curLi.addEventListener("touchmove",move,false);
    curLi.addEventListener("touchend",end,false);
});

function start(e){
    this.startX = e.changedTouches[0].pageX;
    this.startY = e.changedTouches[0].pageY;

}
function move(e){
    e.preventDefault();
    this.style.webkitTransition = "";
    var moveX = e.changedTouches[0].pageX;
    var moveY = e.changedTouches[0].pageY;
    var direction = swipeDirection(this.startX,this.startY,moveX,moveY);
    var index = this.index;
    var len = oLis.length;
    var movePos = moveY - this.startY;
    if(/^(Down|Up)$/.test(direction)){
        this.flag = true ;

        [].forEach.call(oLis,function(curLi,nIndex){
            if(index!=nIndex){
                curLi.style.display = "none";
            }
            curLi.className = "";
        })

        if(direction == "Down"){
            this.prevsIndex = index == 0?len-1:index-1;
            var pos = -desH/2+movePos;
        }else if(direction == "Up"){
            this.prevsIndex = index == len-1?0:index+1;
            var pos = desH/2+movePos;
        }
        oLis[this.prevsIndex].style.display = "block";
        oLis[this.prevsIndex].className = "zIndex";
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,"+pos+"px)";
        this.style.webkitTransform = "scale("+(1-Math.abs(movePos)/winH*1/2)+") translate(0,"+movePos*2+"px)";

    }

}
function end(e){
    if(this.flag){
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,0)";
        oLis[this.prevsIndex].style.webkitTransition = "1s";
        var _this = this;
        oLis[this.prevsIndex].addEventListener('webkitTransitionEnd',function(e){
            this.style.webkitTransition = "";
            _this.style.webkitTransform = "translate(0,0)";
        },false)
        this.flag = false;

    }
}
function swipeDirection(startX,startY,moveX,moveY){
    var changeX = moveX - startX;
    var changeY = moveY - startY;
    return  Math.abs(changeX)>Math.abs(changeY)?(changeX>0?"Right":"Left") : (changeY>0?"Down":"Up");
}
function isSwipe(startX,startY,moveX,moveY){
    var changeX = moveX - startX;
    var changeY = moveY - startY;
    return  Math.abs(changeX)>30 || Math.abs(changeY)>30
}
