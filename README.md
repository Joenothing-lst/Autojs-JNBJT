# Autojs-JNBJT
基于[Auto.js](https://hyb1996.github.io/AutoJs-Docs/#/)框架编写的用于江南百景图（~~江南百井图~~）持久化挂机的脚本。  

## ----- 本代码仅供学习和参考使用，禁止任何利用此脚本的牟利行为 -----

## 优点
+ 无需root；  
+ 高容错性，低资源占用；  
+ 自动破解拼图；  
+ 自动使用特殊人物；  
**测试用机是小米8，挂了8小时，全程没有任何问题，那么别的手机型号呢？不知道，因为我没有（**  


## 安装
+ 安装**base.apk**，里面是Auto.js的App；
+ 安装完成后，允许Auto.js使用无障碍权限，各个手机品牌开启方法可能不同，具体百度；
+ 打开Auto.js，点击右下角+号导入**main.js**;
+ 新建文件夹，命名为defult，并将defult里的图片复制进去，或者直接复制粘贴defult文件夹（一般来说在 './脚本/' 文件夹下）。

## 使用
### 方法一(不推荐)：
+ 开启Auto.js的悬浮窗功能，使用悬浮窗运行一次main.js，此时Auto.js应该会提示请求权限，点击记住选择并确定；
+ 打开江南百井图，把界面放大到最大（当然也可以不放大，放到最大只是为了降低脚本的失误率以及方便固定位置），在井阵找到一个自己能记住的**固定位置**；
+ 进入Auto.js，编辑main.js并填入**井的位置坐标**（大部分机型的开发者模式里可以打开显示触摸坐标的选项），修改 SIMPLE=false ，以及其他配置；
+ 再次打开江南百井图，调整大小并移动到之前的固定位置，确保和填入井的位置坐标时的界面基本一致；
+ 使用悬浮窗，运行**main.js**。

### 方法二(无脑推荐)：
+ 开启Auto.js的悬浮窗功能，使用悬浮窗运行一次main.js，此时Auto.js应该会提示请求权限，点击记住选择并确定；
+ 将界面放大到最大，手机逆时针旋转90度，按照如下图所示摆放井阵，记住这个**固定位置**（中间的是雕像，井阵对准界面左边缘和上边缘）；
![示意图.jpg](https://s1.ax1x.com/2020/09/10/wJcmFA.jpg)
如果你想自定义井阵坐标，可以使用如下图所示的简单坐标系，默认是开启简单坐标模式的（仅作坐标示例，固定位置以图一为准）。
![示意图.jpg](https://s1.ax1x.com/2020/09/10/wJrZ8K.png)
+ 使用悬浮窗，运行**main.js**。
### ~~是的我知道这个过程很麻烦，但目前现就这样吧，以后再想办法简化。~~

## 注意：  
+ 在非Root情况下，Auto.js只能运行在>=Android7.0以上的系统，iOS就先洗洗睡吧。
+ 脚本只会刷井的第一档（若有空闲特殊人物则会自动使用），因为这是经过计算之后效率最高的刷钱方式（应该。
+ 税课司能很大程度上提高挂机时的井阵效率，建议拉满。


## 横屏版本使用说明（测试机华为p30标准版）
+ 1.安装**base.apk**，里面是Auto.js的App；
+ 2.安装完成后，允许Auto.js使用无障碍权限，各个手机品牌开启方法可能不同，具体百度；
+ 3.打开Auto.js，点击右下角+号导入**main_land.js**;
+ 4.拷贝land目录到 手机sdcard/脚本/ 文件夹下 
+ 5.水井摆放位置如图地图放大到最大，左下水井木桶与屏幕左侧相切。右下水井与屏幕底部相切
+ 6.点击悬浮窗运行**main_land.js**
![横屏版本水井摆放.jpg](https://s1.ax1x.com/2020/09/11/wtEAU0.jpg)
## 这里脚本中可能需要修改的地方
+ **TASKS** 点位集合。可在手机开发者选项中打开触摸点位显示
+ **REBACK** 无效点位。 屏幕中无建筑边缘点用于点击返回的
+ **BLOCKSTART** 第一块拼图的左上角点位坐标 用于计算拼图
+ **land目录下面的截图**  测试发现不同手机截图识别可能失败 最好自己制作这些截图 覆盖即可 12宫格拼图在线切割 https://www.qtool.net/piccutting