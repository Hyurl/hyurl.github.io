## I18n 多语言本地化

自 1.4.0 版本起，Cool-Node 提供了一套基于 i18n 规范而实现的多语言本地化方案，并且，
你可以很轻松的使用它。

语言包文件统一存储在每一个应用的 `Loacles` 文件夹中，例如主应用就是 `App/Locales`。
每一个语言文件都采用 RFC1766 文件所规定的标准来命名，例如 `en-US`、`zh-CN`，文件
类型可以是 js 或者 json。

这是一个语言包文件的示例（App/Locales/zh-CH.js）：

```javascript
module.exports = {
    "How are you?": "你好吗？",
    "I'm fine, thank you!": "我很好，谢谢",
    "My name is %s, what's yours?": "我的名字是 %s，你的呢？",
    "I'm %d, what about you?": "我 %d 岁了，你呢？"
}
```

在这个示例中，我们使用英语作为主语言，因为语言包所导出的对象键名都是英语。但这并
不是强制性的，你可以用任何文字作为翻译语句的键值对。但有一点，所有语言包的键名必须是
一致的，它们可能并不包含所有的翻译，但是只要有，就必须使用相同的键名，系统是根据键名
来匹配翻译语句的。

你也可以设置一个默认语言，在指定的语言或翻译不存在时，系统会尝试使用默认语言，如果
默认语言也不存在或者没有对应的翻译，那么将不会进行任何翻译，而是原样输出。默认语言
一般来说都是键值对相同的，因此，为了方便，你也可以直接导出一个数组。例如像这样：

```javascript
module.exports = [
    "How are you?",
    "I'm fine, thank you!",
    "My name is %s, what's yours?",
    "I'm %d, what about you?"
]
```

## 在控制器中调用翻译语句

介绍完了语言包的编写，我们再来看看如何在控制器和视图中使用它。Cool-Node 奉行控制器
之上的原则，因此，语言包和控制器是捆绑在一起的，关于语言包的设置，也在控制器中进行。

```javascript
module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);
        // 只有默认语言需要设置
        this.defaultLang = "en-US";
    }

    index(req){
        // 在控制器中，使用 this.i18n() 来调用翻译语句
        return this.view({
            greeting: this.i18n("How are you?"),
            answer: this.i18n("I'm fine, thank you!"),
            askName: this.i18n("My name is %s, what's yours?", "Ayon"),
            askAge: this.i18n("I'm %d, what about you?", 20)
        });
    }
}
```

上面在控制器中先调用翻译再传递到视图的方案，显得有些麻烦，因此 Cool-Node 还提供了
一个替代的方案，可以直接在视图中使用 `i18n()` 函数来获取翻译。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cool-Node View</title>
</head>
<body>
    <p><%= i18n("How are you?") %></p>
    <p><%= i18n("I'm fine, thank you!") %></p>
    <p><%= i18n("My name is %s, what's yours?", "Ayon") %></p>
    <p><%= i18n("I'm %d, what about you?", 20) %></p>
</body>
</html>
```

## 客户端是如何选择语言的

服务端会根据客户端提供的下面这些信息，来自动为访问者展示相应的语言（按优先级排序）：

1. `req.query.lang`
2. `req.cookies.lang`
3. `req.lang`

在 Socket 通讯中，则是：

1. `socket.cookies.lang`
2. `oocket.lang`

例如，下面的 URL 将展示使用 *zh-CN* 语言渲染的页面

```
GET /?lang=zh-CN
```

也可以使用 cookie 来存储语言，这样在 cookie 的有效期内，整个网站都会按照既定的语言
来展示给用户：

```javascript
document.cookie.lang = "zh-CN";
```

如果既没有指定 URL 参数，也没有设置 Cookie，那么服务端就会通过 `Accept-Language` 
请求头来自动决定使用哪一种语言渲染页面。

[下一章](Advanced)