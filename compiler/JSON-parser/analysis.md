## JSON解析器

### 基本规则

参考[视频](https://www.youtube.com/watch?v=iw_BkoAY_fk&list=PLOech0kWpH8-njQpmSNGSiQBPUvl8v3IM&index=3)，JSON格式解析规则如下：

+ VALUE
  + STRINGLITY | NUMBER | OBJECT | ARRAY
+ OBJECT
  + 判断条件：起止分别为”{“、”}“
  + 包含一个或多个PAIR
+ PAIR
  + 键值对
  + STRINGLIT: VALUE
+ ARRAY
  + 判断条件：起止分别为"["、"]"
  + 包含n(n>=0)个VALUE



### 目标

生成对应的AST树

### 方法

有限状态机+递归实现