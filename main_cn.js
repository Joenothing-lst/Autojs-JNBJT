var 手机尺寸 = [device.height, device.width]; // 手机尺寸，因为横屏所以要反着写
var 返回 = [390, 150]; // 无效点，地图上一个没有建筑的点，用于返回操作
var 半边 = 62; // 拼图边长的一半，一般不用动
var 休息 = 500; // 休眠（ms），一般不用动
var 循环用时 = 3; // 循环用时（min）
var 循环延迟 = 5; // 循环延迟（s）
var 提醒时间 = 5; // 提醒时间（s）
var 简单坐标模式 = true; /* 简单坐标模式，true代表开启，false代表关闭，
                       开启后可以通过简单坐标来代替实际坐标，坐标原点为雕像，举例:
                       雕像正下方的第一个井坐标为(0,-2)
                       雕像正左方的第一个井坐标为(-2,0) 
                    */
var 挂机模式 = true; /* 挂机模式，true代表开启，false代表关闭，
                       关闭后每运行一次循环时都会自动返回桌面，此时您可以用手机干别的事情，
                       直到提示循环的下一次执行，会自动打开江南百景图app。
                       挂机模式仅建议1级井使用，因为5级井循环用时是一分半，基本来不及干什么事。
                    */
var 任务 = [
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
function 点击井(i, j) {
    click(1100 + i * 202, 512 - j * 101)  // 横屏
}

// 回退操作
function 返回() {
    click(返回[0], 返回[1]);
    sleep(休息);
}

// 对每一个被点击的井，进入第一档工作状态
function 工作(flag) {
    sleep(休息);
    click(900, 300);
    sleep(休息);
    if (flag) {
        var p = findImage(images.captureScreen(), this.sptemp, {
            region: [600, 600, 400, 300],
            threshold: 0.9
        });
        if (p) {
            click(1600, 300);
            sleep(休息);
        } else {
            flag = false;
        }
    }
    返回();
    返回();
}

// 解拼图
function 拼图(img, x, y) {
    var lst = [];
    for (var i = 1; i <= 12; i++) {
        var templ = images.read("./defult/" + i + ".jpg");
        var p = findImage(img, templ, {
            region: [100, 1000, 900, 500],
            threshold: 0.9
        });
        if (p) {
            var m = Math.round((p.x - x) / (半边 * 2)) + 1;
            var n = Math.round((p.y - y) / (半边 * 2));
            lst.push(m - 1 + n * 6);
        }
        templ.recycle();
    }
    log(lst);
    for (var i = 0; i < 12; i++) {
        if (lst[i] != i) {
            if (i > 5) {
                var x1 = (i - 6) * 2 * 半边 + 半边 + x;
                var y1 = 半边 * 2 + 半边 + y;
            } else {
                var x1 = i * 2 * 半边 + 半边 + x;
                var y1 = 半边 + y;
            }
            if (lst[i] > 5) {
                var x2 = (lst[i] - 6) * 2 * 半边 + 半边 + x;
                var y2 = 半边 * 2 + 半边 + y;
            } else {
                var x2 = lst[i] * 2 * 半边 + 半边 + x;
                var y2 = 半边 + y;
            }
            swipe(x1, y1, x2, y2, 休息 + i * 20);
            log("%d %d => %d %d", x1, y1, x2, y2);
            var a = lst[i];
            lst[i] = lst[lst[i]];
            lst[a] = a;
            sleep(休息 * 2);
        }
    }
    返回();
}

// 遍历任务序列
function main(task) {
    toast("将于" + 提醒时间 + "秒后开始");
    sleep(提醒时间 * 1000);
    var 有特殊人物 = true;
    sptemp = images.read("./defult/sp.jpg");
    for (var i in task) {
        if (简单坐标模式) {
            点击井(task[i][0], task[i][1]);
        } else {
            click(task[i][0], task[i][1]);
        }
        工作(有特殊人物);
    }
    sptemp.recycle();
    if (!挂机模式) {
        home();
    }
}


images.requestScreenCapture();
launchApp("江南百景图");
sleep(2000);
main(任务);

//循环运行
setInterval(function () {
    if (!挂机模式) {
        launchApp("江南百景图");
        sleep(休息 * 4);
    }
    // 判断是否有拼图，并把拼图左上坐标传入解拼图函数
    var 当前截图 = images.captureScreen();
    var templ = images.read("./defult/temps.jpg");
    var p = findImage(当前截图, templ, {
        threshold: 0.8,
    });
    templ.recycle();
    if (p) {
        log("发现拼图");
        拼图(当前截图, p.x + 80, p.y + 240);
    } else {
        当前截图.recycle();
    }

    main(任务);
}, 循环用时 * 60 * 1000 + 循环延迟 * 1000 - 提醒时间 * 1000 - 休息 * 4)