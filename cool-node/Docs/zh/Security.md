## 开启 CSRF 防御

自 1.3.4 版本起，框架自身实现了 CSRF 防御的支持，你所需要做的，只是简单地在 HTTP 
控制器中设置一个 `csrfToken` 属性为 `true`，然后在客户端中，当你提交一个表单的时候，
伴随数据，同时发送一个 `x-csrf-token` 字段到服务器上。

```javascript
// CsrfTokenTest.js
module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);
        // 启用 CSRF token 检查
        this.csrfToken = true;
    }

    index(req){
        // 当 CSRF token 检查开启时，你可以调用 `req.csrfToken` 来获取自动生成的
        // token，并将它传递到视图中。
        return this.view({
            crsfToken: req.csrfToken
        });
    }

    create(req){
        // Do some stuffs here...
        return this.success("Resource created.");
    }
}
```

在视图中：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- Output the csrfToken as a meta -->
    <meta name="x-csrf-token" content="<%= csrfToken %>">
    <title>Document</title>
</head>
<body>
    <!-- contents -->
</body>
</html>
```

启用后，当一个 `GET` 请求发生时，框架会自动地生成 token 并将它们存储在 session 中，
然后当你在客户端开始另一个 `DELETE`、`PATCH`、`POST` 或 `PUT` 请求时，你必须同时
发送一个 `x-csrf-token` 字段，可以通过 header、URL 参数、URL 查询字符串或请求主体
数据的方式（优先级从左到右）来发送。框架会检查客户端提供的 token 与服务器上的是否
匹配，如果不匹配，那么一个 `403 Forbiden!` 错误将会被抛出。下面是一个使用 jQuery 的
示例。

```javascript
$.ajax({
    url: "/CsrfTokenTest",
    type: "POST",
    data: {},
    headers: {
        "X-CSRF-Token": $('meta[name="x-csrf-token"]').attr("content")
    },
    success: function(res){
        console.log(res);
    }
});
```

CSRF token 是通过操作来区分存储的，因此不必担心如果你打开了多个表单页面它们会混乱。

在 1.4.0 版本之后，框架提供了一个函数，可以方便地自动在渲染的视图中的表单中插入 CSRF 
token 隐藏字段。

```javascript
const { injectCsrfToken } = require("cool-node").Functions;

module.exports = class extends HttpController{
    // ...
    async index(req){
        var html = await this.view();
        // 这个函数并不是很可靠的，在模板中书写 <form> 标签时不要换行。
        return injectCsrfToken(html, req.csrfToken);
    }
    // ...
}
```

## 防止网站遭受 XSS 攻击

用户的输入是不可信的，因此需要防范来自客户端的恶意内容。攻击者可能会提交一些恶意的
代码，如果服务器不经过滤就将其输出，那么当其他人访问的时候，被嵌入到页面的恶意代码就
会执行，从而发起 XSS 攻击。在提交内容中嵌入恶意 JavaScript 代码主要通过这些方式：

1. 提交包含 `<script>` 标签的内容；
2. 提交包含 `<a href="javascript:...">` 脚本链接的内容；
2. 提交包含 `onload`、`onclick` 等事件属性的内容。

如果这些内容没有经过过滤就输出到网页上，那将是一件非常危险的事，它们比 CSRF 的危害要
更直接和致命。 

框架提供了几个特别的工具函数，来在用户提交数据时过滤上面这些不合法的内容：

1. `escapeTags(html, [tags = "<script><style><iframe><object><embed>"])`
2. `escapeScriptHrefs(html)`
3. `escapeEventAttributes(html)`

这些函数假设所有要过滤的内容都包含 HTML 标签和属性，对于标签，`escapeTags()` 会将
指定标签的的 `<` 和 `>` 分别转换成 `&lt;` 和 `&gt;`；对于脚本链接，
`escapeScriptHrefs(html)` 会将用于执行脚本的 `href` 属性转换为 `data-href`，而 
`escapeEventAttributes()` 则会将 `onload`、`onlcick` 之类的事件属性转换成 
`data-onload` 和 `data-onclick` 的形式，这样既保证了所提交内容的正确输出，又不会
导致恶意代码被运行。

因为并不是所有地方都需要进行 XSS 防御，因此框架并没有使用自动过滤机制，因此你可以在
需要过滤的地方，手动调用它们来过滤内容。并且，你可以根据自己的需要，来执行想要的过滤，
例如，你不但可以过滤 `request.body`，也可以用来过滤 URL 参数，这在 GET 请求中，例如
搜索页面，还是很有用的。

```javascript
const {
    escapeTags,
    escapeScriptHrefs,
    escapeEventAttributes
    } = require("cool-node").Functions;

module.exports = class extends HttpController{
    create(req){
        // 假设有一个需要过滤的 content 字段
        var content = req.body.content;
        content = escapeTags(content);
        content = escapeScriptHrefs(content);
        content = escapeEventAttributes(content);
        // ...
    }
}
```

[下一章](Internationalization)