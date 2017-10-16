## 创建一个 HTTP 控制器

Cool-Node 使用 **Express** 来处理 HTTP 请求，你可以在 
[expressjs.com.cn](http://expressjs.com.cn/) 上查阅更多关于它的信息。

要创建一个控制器，你首先需要在 `/App/Controllers/` 目录下创建一个 JavaScript 文件。
在这个示例中，我将创建一个文件并命名为 `HttpTest.js`。不同于其他的一些框架，我不会
建议你将控制器命名为 ~~TestController.js~~ 的形式，并且出于便利性，你也应当在
Cool-Node 项目中始终去掉 *Controller* 部分。

这个示例定义了一个 HttpTest 控制器：

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{}
```

在第一行中，你需要导入 `HttpController`，并且这个文件必须导出一个继承于 
HttpController 的类，你不需要为这个类指定一个名字，尽管留其匿名就好了。

这个控制器现在什么也不做，下一步，我将向你展示如何定义满足 **自动路由系统** 的方法。

## 自动路由系统

大部分框架要求你手动地定义路由，这是一个控制操作地好方案，但有时候，当你的项目做大时，
这会成为一个沉重而繁杂地工作。

因此，Cool-Node 所提供地一个最重要地特性，就是 **自动路由处理器**。当你编写控制器的
时候，你不再需要显示地指定路由，当你定义一个控制器方法地那一刻，一个路由也就帮你隐式
地定义好了，你所需要做的，只是采用这一条原则：

>在控制器类中定义一个方法并使它的名字以请求方法的小写形式开头。

是不是很简单呢？我给你看看：

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    /**
     * 这个方法可以通过一个类似这样的 URL 地址来访问：
     * http://localhost/HttpTest/ShowHello
     */
    getShowHello(){
        // 返回值将会被自动发送到客户端。在一个 HTTP 控制器中，如果返回 null 或者 
        // undefined，那么一个不包含主体内容的响应会将会被发送。
        return "Hello, World!";
    }

    /**
     * 所有的 HTTP 控制器方法都接受两个参数：
     * `req` 对应的请求对象；
     * `res` 对应的响应对象；
     * 这个方法可以通过 POST 请求到此 URL 地址来访问：
     * http://localhost/RepeatWhatISaid
     */
    postRepeatWhatISaid(req, res){
        return "You said: " + JSON.stringify(req.body);
    }

    /**
     * 你可以传递更多的路径信息到 URL 地址中，所有在控制器和方法名之后的内容都会被
     * 视为请求参数来处理，下面的 URL 地址将调用该方法，并传递参数 
     * `{id: 1, name: 'test'}`。
     * http://localhost/ShowParams/id/1/name/test
     */
    getShowParams(req){
        // 如果一个对象被返回，那么一个 JSON 响应将会被发送到客户端。
        return req.params; // {id: 1, name: 'test'}
    }

    /**
     * 你也可以返回一个 Promise 对象，实际上，所有控制器的方法，当被客户端调用时，
     * 都是在一个 Promise 中执行的，因此你可以在方法中做任何你想要做的操作。
     */
    getShowPromisedData(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                // 该消息将会在 1 秒钟后发送给客户端。
                resolve("Hello, World!");
            }, 1000);
        });
    }
}
```

现在你已经学习了关于 HttpController 最重要的部分，但是，还有更多的特性，让我们继续
前行。

## 展示索引页面和 RESTful API

有一些方法，你并不需要显式地给出它们的请求方法，它们是预定义好的用来接受特殊请求类型
的方法。

- `index()` 监听 GET 请求，显示控制器的索引页面。
- `get()` 监听 GET，满足 RESTful API。
- `create()` 监听 POST，满足 RESTful API。
- `update()` 监听 PATCH，满足 RESTful API。
- `deleet()` 监听 DELETE，满足 RESTful API。

当调用这些请求的时候，你不需要显式地在 URL 地址中给出方法名，只需要控制器名字就可以
了，框架会检测请求类型并自动匹配对应的方法。

但是，如果你的控制器中同时有 `index()` 和 `get()` 方法，如果不在 URL 中给出方法名，
只有 index() 会被调用到。在这种情况下，你就需要显示地在 URL 中指出方法名。

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    /** GET http://localhost/HttpTest */
    index(){}

    /** 
     * GET http://localhost/HttpTest 如果 index() 未被定义, 否则, 使用
     * GET http://localhost/HttpTest/get
     */
    get(){}

    /** POST http://localhost/HttpTest */
    create(){}

    /** PATCH http://localhost/HttpTest */
    update(){}

    /** DELETE http://localhost/HttpTest */
    delete(){}
}
```

你可以更改 RESTful 映射，只需要重新定义 `controller.RESTfulMap` 属性，甚至增加更多
的方法来监听。**自 1.2.4 版本起，这个属性是通过 setter 来设置的，因此你必须定义**
**一个新的 setter，如果你想要重写它的话。**

好了，你现在已经学习了一个控制器所拥有大部分的特性，再让我们看看如何向客户端展示一个
视图文件（又称模板）。

## 视图系统

要展示一个视图文件，只需要调用 `controller.view()` 方法，它接受两个可选的参数：

- `tplName` 模板文件名。模板文件存放在 `App/Views/` 目录下，如果模板文件以 `.html`
    为扩展名，则你可以在传参时忽略它。如果该参数是缺省的，那么默认视图 `defaultView`
    将会被使用。
- `vars` 传递到模板的额外变量，这些变量会在模板中被运行。

这个方法返回一个 **Promise**，传递到 `then()` 的唯一参数则是模板返回的内容。

`tplName` 参数也是可选的原因，是因为框架会在客户端请求调用方法时自动设置一个默认的
视图文件到控制器中，让我向你展示一下它是如何工作的：

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    index(){
        // 这个操作会发送模板 /App/Views/HttpTest/index.html 到客户端。
        return this.view();
    }

    getShowOther(){
        // 这个操作会发送模板 /App/Views/HttpTest/ShowOther.html 到客户端，并且
        // 传递变量 title 到模板中。
        return this.view({title: "Cool-Node"});
    }

    getShowAnother(){
        // 你可以显示地指定模板文件名，如果它和控制器方法名不相对应地话。
        return this.view("HttpTest/show-another");
    }
}
```

还有另外一个方法 `controller.viewMarkdown()`，它用来展示一个 Markdown 文件（(其
扩展名为 `.md`）并将其解析为 HTML 文档。它表现得和 `controller.view()` 几乎一样，
但是它只支持 `tplName` 参数。

更多细节将会在文章  [设计视图](DesigningViews) 中被提到，现在让我们进入到
下一环节，学习如何编写一个 Socket 控制器。