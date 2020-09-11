var SIZE = [device.height, device.width]; // 手机尺寸，因为横屏所以要反着写
var REBACK = [390, 150]; // 无效点，地图上一个没有建筑的点，用于返回操作
var HALFBLOCK = 62; // 拼图边长的一半，一般不用动
var SLEEP = 500; // 休眠（ms），一般不用动
var MINS = 3; // 循环用时（min）
var DELAY = 5; // 循环延迟（s）
var WARN = 5; // 提醒时间（s）
var SIPMLE = true; /* 简单坐标模式，true代表开启，false代表关闭，
                       开启后可以通过简单坐标来代替实际坐标，坐标原点为雕像，举例:
                       雕像正下方的第一个井坐标为(0,-2)
                       雕像正左方的第一个井坐标为(-2,0) 
                    */
var PLAYING = true; /* 挂机模式，true代表开启，false代表关闭，
                       关闭后每运行一次循环时都会自动返回桌面，此时您可以用手机干别的事情，
                       直到提示循环的下一次执行，会自动打开江南百景图app。
                       挂机模式仅建议1级井使用，因为5级井循环用时是一分半，基本来不及干什么事。
                    */
var TASKS = [
    [0, 4], //最上方
    [1, 3],
    [-1, 3],
    [2, 2],
    //[0, 2], //没开地基会导致点到雕像
    [-2, 2],
    [3, 1],
    [1, 1],
    [-3, 1],
    [4, 0], //最右方
    [-2, 0],
    [-4, 0],//最左方
    [3, -1],
    [1, -1],
    [-3, -1],
    [2, -2],
    [0, -2],
    [-2, -2],
    [-1, -3],
    [0, -4],//最下方
];

// 换算简单坐标为实际坐标
function clickJing(i, j) {
    click(1100 + i * 202, 512 - j * 101)  // 横屏
}

// 回退操作
function reBack() {
    click(REBACK[0], REBACK[1]);
    sleep(SLEEP);
}

// 对每一个被点击的井，进入第一档工作状态
function work(flag) {
    sleep(SLEEP);
    click(900, 300);
    sleep(SLEEP);
    if (flag) {
        var p = findImage(images.captureScreen(), this.sptemp, {
            region: [600, 600, 400, 300],
            threshold: 0.9
        });
        if (p) {
            click(1600, 300);
            sleep(SLEEP);
        } else {
            flag = false;
        }
    }
    reBack();
    reBack();
}

// 解拼图
function jigsaw(img, x, y) {
    var lst = [];
    for (var i = 1; i <= 12; i++) {
        var templ = images.read("./defult/" + i + ".jpg");
        var p = findImage(img, templ, {
            region: [100, 1000, 900, 500],
            threshold: 0.9
        });
        if (p) {
            var m = Math.round((p.x - x) / (HALFBLOCK * 2)) + 1;
            var n = Math.round((p.y - y) / (HALFBLOCK * 2));
            lst.push(m - 1 + n * 6);
        }
        templ.recycle();
    }
    log(lst);
    for (var i = 0; i < 12; i++) {
        if (lst[i] != i) {
            if (i > 5) {
                var x1 = (i - 6) * 2 * HALFBLOCK + HALFBLOCK + x;
                var y1 = HALFBLOCK * 2 + HALFBLOCK + y;
            } else {
                var x1 = i * 2 * HALFBLOCK + HALFBLOCK + x;
                var y1 = HALFBLOCK + y;
            }
            if (lst[i] > 5) {
                var x2 = (lst[i] - 6) * 2 * HALFBLOCK + HALFBLOCK + x;
                var y2 = HALFBLOCK * 2 + HALFBLOCK + y;
            } else {
                var x2 = lst[i] * 2 * HALFBLOCK + HALFBLOCK + x;
                var y2 = HALFBLOCK + y;
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

// 遍历任务序列
function main(task) {
    toast("将于" + WARN + "秒后开始");
    sleep(WARN * 1000);
    var spflag = true;
    sptemp = images.read("./defult/sp.jpg");
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

//循环运行
setInterval(function () {
    if (!PLAYING) {
        launchApp("江南百景图");
        sleep(SLEEP * 4);
    }
    // 判断是否有拼图，并把拼图左上坐标传入解拼图函数
    var screen_image = images.captureScreen();
    var templ = images.read("./defult/temps.jpg");
    var p = findImage(screen_image, templ, {
        threshold: 0.8,
    });
    templ.recycle();
    if (p) {
        log("发现拼图");
        jigsaw(screen_image, p.x + 80, p.y + 240);
    } else {
        screen_image.recycle();
    }

    main(TASKS);
}, MINS * 60 * 1000 + DELAY * 1000 - WARN * 1000 - SLEEP * 4)