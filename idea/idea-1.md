# 第一版本的想法

有两处感觉特别蹩脚
1. 账单的文本信息是经由散布在各处的result变量 一点一点汇聚起来的。修改起来不方便，而且影响代码的逻辑流畅性。
2. 不同类型的订单，计算金额的逻辑比较抽象。需要一行一行理解比较复杂。


可以优化的地方
1. 剧目类型 可以作为枚举抽成enum，避免因拼写错误而出错
2. 具体的剧目 对应的场次 其实都可以处理成对象来处理