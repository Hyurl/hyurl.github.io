## 创建一个视图

Cool-Node 使用 **EJS** 作为它的视图系统，你可以在 
[https://www.npmjs.com/package/ejs](https://www.npmjs.com/package/ejs) 
上查阅更多关于它的信息。

在这里，我将会给你一个简单的提示，介绍如何在 Cool-Node 中使用它。在学习了关于控制器
的文章之后，我猜想你已经揣摩出它是怎么一回事儿了。

在这篇文章中，我将会创建一个 HTTP 控制器 `HttpTest`，就像之前那样，去阐述控制器和
视图的关系。

首先，在 `/App/Views/` 目录中创建一个文件夹，叫做 `HttpTest`，然后在里面创建一个 
HTML 文件，叫做 `index.html`，完整的路径将是 `/App/Views/HttpTest/index.html`。
这个视图对应控制器中的 `index()` 方法。

在 JavaScript 中 (`/App/Controllers/HttpTest.js`):

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    index(){
        return this.view({
            title: "Cool-Node Test",
            content: "Hello, World!"
        });
    }
}
```

然后在 HTML 中 (`/App/Views/HttpTest/index.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%=title%></title>
</head>
<body>
    <h1><%-content%></h1>
</body>
```

完成！是不是很简单呢？现在，重启 Cool-Node 服务器，然后访问 
`http://localhost/HttpTest/` 查看发生了什么。

EJS 拥有许多优秀的特性，它使你能够像 PHP、JSP、和 APS 那样，在 HTML 中运行程序代码。
不要忘了去查看更多关于 EJS 的信息如果你想要学习好它，地址
[https://www.npmjs.com/package/ejs](https://www.npmjs.com/package/ejs)。

同时，你可以使用 `controller.viewMarkdown()` 去展示一个 Markdown 文件，其内容将会
被自动解析为普通的 HTML 文档。顺便提醒一下，它使用 `highlightjs` 来美化显式代码块，
因此你必须手动加载主题文件，所有支持的主题都保存在 
`/node_modules/highlightjs/styles/` 中，只要赋值你想要的那一份到 `/App/Assets/` 
中，然后从 HTML 中载入它就可以了。

直到现在，我们已经走过了所有 Cool-Node 的基本课程。现在，让我们目睹一下数据库层面上
的开发体验，参见 **Modelar** ORM 模型系统。