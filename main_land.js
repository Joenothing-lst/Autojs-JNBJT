var SIZE = [1080, 2248]; // 手机尺寸
var REBACK = [2213, 641]; // 无效点，地图上一个没有建筑的点，用于返回操作
var BLOCKSTART = [810, 450]; // 拼图左上标
var HALFBLOCK = 62; // 拼图边长的一半，一般不用动
var SLEEP = 400; // 休眠（ms），一般不用动
var MINS = 1.5; // 循环用时,五级水井一分半就刷完了。理论这个时间可以小于1（min）
var DELAY = 5; // 循环延迟（s）
var WARN = 5; // 提醒时间（s）
var SIPMLE = false; /* 简单坐标模式，true代表开启，false代表关闭，
                       开启后可以通过简单坐标来代替实际坐标，坐标原点为雕像，举例:
                       雕像正下方的第一个井坐标为(0,-2)
                       雕像正左方的第一个井坐标为(-2,0) 
					   横屏模式
                    */
var PLAYING = true; /* 挂机模式，true代表开启，false代表关闭，
                       关闭后每运行一次循环时都会自动返回桌面，此时您可以用手机干别的事情，
                       直到提示循环的下一次执行，会自动打开江南百景图app。
                       挂机模式仅建议1级井使用，因为5级井循环用时是一分半，基本干不了什么事。
                    */

/*这里的点位记得换成自己屏幕的坐标x,y*/					
var TASKS = [
    [1826, 161], 
    [2091, 246],
    [1068, 145],
    [1279, 250],
    [1456, 351],
	[1616, 506],
    [1880, 559],
    [860, 260],
    [1284, 444],
    [1651, 634], 
    [848, 456],
    [1275, 650],
    [1459, 756],
    [449, 441],
    [651, 539],
    [1064, 771],
    [261, 556],
    [457, 653],
    [659, 760],
    [855, 856],
	[1059, 960],
];


function clickJing(i, j) {
    click(700 + i * 55, 1690 + j * 55)
}


function reBack() {
    click(REBACK[0], REBACK[1]);
    sleep(SLEEP);
}


function work(flag) {
    sleep(SLEEP);
    click(994, 260);
    sleep(SLEEP);
    if (flag) {
        var p = findImage(images.captureScreen(), this.sptemp, {
            region: [700, 144, 979, 352],
            threshold: 0.8
        });
        if (p) {
            click(1542, 221);
            sleep(SLEEP);
        } else {
            flag = false;
        }
    }
    reBack();
    reBack();
}

var lst = [];//找到的点位集合
var foundAll = false;//记录是否12张图片都找到
var errorCount = 0;
function jigsaw(img) {
    errorCount = 0;
    foundAllPic(img)
    if(!foundAll){
        toast("糟糕图片查找不全");
        sleep(1000)
        errorCount++;
        if(errorCount>5){
            log("凉了不用再试了")
            return
        }
        foundAllPic(img)
        return
    }

    for (var i = 0; i < 12; i++) {
        if (lst[i] != i) {
            if (i > 5) {
                var x1 = (i - 6) * 2 * HALFBLOCK + HALFBLOCK + BLOCKSTART[0];
                var y1 = BLOCKSTART[1] + HALFBLOCK * 3;
            } else {
                var x1 = i * 2 * HALFBLOCK + HALFBLOCK + BLOCKSTART[0];
                var y1 = BLOCKSTART[1] + HALFBLOCK;
            }
            if (lst[i] > 5) {
                var x2 = (lst[i] - 6) * 2 * HALFBLOCK + HALFBLOCK + BLOCKSTART[0];
                var y2 = BLOCKSTART[1] + HALFBLOCK * 3;
            } else {
                var x2 = lst[i] * 2 * HALFBLOCK + HALFBLOCK + BLOCKSTART[0];
                var y2 = BLOCKSTART[1] + HALFBLOCK;
            }
            swipe(x1, y1, x2, y2, SLEEP + i * 20);
            log("%d %d => %d %d", x1, y1, x2, y2);
            var a = lst[i];
            lst[i] = lst[lst[i]];
            lst[a] = a;
            sleep(SLEEP * 2);
        }
    }
    reBack();
}

function foundAllPic(img){
    lst = [];
    for (var i = 1; i <= 12; i++) {
        var templ = images.read("./land/" + i + ".jpg");
        var p = findImage(img, templ, {
            //region: [825, 432, 1647, 735],
            //threshold 相似度0~1 可适当降低不写默认0.9
            threshold: 0.7
        });
        if (p) {
            log("找到拼图"+i);
            var m = Math.round((p.x - BLOCKSTART[0]) / (HALFBLOCK * 2)) + 1;
            var n = Math.round((p.y - BLOCKSTART[1]) / (HALFBLOCK * 2));
            lst.push(m - 1 + n * 6);
        }
        templ.recycle();
    }
    log(lst);
    foundAll=lst.length==12
}


function main(task) {
    toast("将于" + WARN + "秒后开始");
    sleep(WARN * 1000);
    var spflag = true;
    sptemp = images.read("./land/sp.jpg");
    for (var i in task) {
        if (SIPMLE) {
            clickJing(task[i][0], task[i][1]);
        } else {
            click(task[i][0], task[i][1]);
        }
        work(spflag);
    }
    sptemp.recycle();
    if (!PLAYING) {
        home();
    }
}


images.requestScreenCapture();
launchApp("江南百景图");
sleep(2000);
main(TASKS);

setInterval(function () {
    if (!PLAYING) {
        launchApp("江南百景图");
        sleep(SLEEP * 4);
    }
    var screen_image = images.captureScreen();
    var templ = images.read("./land/temps.jpg");
    var p = findImage(screen_image, templ, {
        threshold: 0.8,
    });
    templ.recycle();
    if (p) {
        log("发现拼图");
        jigsaw(screen_image);
    } else {
        screen_image.recycle();
    }

    main(TASKS);
}, MINS * 60 * 1000 + DELAY * 1000 - WARN * 1000 - SLEEP * 4)
//}, 5 * 1000 + DELAY * 1000 - WARN * 1000 - SLEEP * 4)