## 创建一个要求授权的控制器

从之前我们谈论的文章中，你已经学习到了两个特别的属性 `req.user` 和 `socket.user`，
但是还没有清楚它们到底是用来做什么的。在这个章节中，我将向你展示它们最重要的用途。

所有的控制器 (HTTP or socket) 都拥有两个属性：`requireAuth` 和 `authorized`，这些
属性表示着该控制器是能够直接被一个客户端所访问的？还是在调用它之前必须获取授权。

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    /**
     * 控制器的构造方法支持一个参数：options，当你重写构造方法时，必须定义这个参数。
     * 第二个参数，根据控制器类型的不同，它可能时 `req` 或者 `socket`。
     * 
     * 自 1.2.5 版本起，HttpController 接受第三个参数 `res`。
     */
    constructor(options, req, res){
        super(options, req, res);

        // 如果 requireAuth 为真，当未授权时调用这个控制器，一个 404 错误将会被
        // 抛出。
        this.requireAuth = true;

        // 你甚至可以设置 authorized 属性来表名调用操作是否一斤被授权，默认地，它是
        // 这样定义的：
        this.authorized = req.user !== null;

        // 同时，因为这是一个 HTTP 控制器，你因此可以定义一个 `fallbackTo` 属性，
        // 当未授权而调用控制器时，与其抛出 404 错误，链接将会被重定向到你所设置的 
        // URL 地址中。
        this.fallbackTo = "/Login";
    }
}
```

但是记住，这个特性只在控制器被客户端访问时才会生效，如果控制器是在服务器端被调用的，
它不会有任何作用。

自版本 1.3.0 起，HttpController 的构造方法应至少传入 `options` 和 `req`，并且所有
参数都是必须的；SocketController 的构造方法则至少传入 `options` 和 `socket`，也是
必须的。

## 在构造方法中使用异步处理

控制器的构造方法，本来的设计目的是使其做一些初始化的操作，并能够像一个中间件那样工作，
但是构造方法本身是不能被设置为异步的。为了解决这个问题，Cool-Node 1.3.0 也学习真正
的中间件那样，允许你在构造器中传入一个额外的 `next` 参数，借由它来实现异步地调用真正
的控制器方法。

```javascript
module.exports = class extends HttpController{
    // 必须将所有的参数依次传入，并且是必须参数，即没有默认值。
    constructor(options, req, res, next){
        // async 需要你的 Node.js 版本在 7.6.0 以上，之前的版本，可以使用
        // Promise 或者回调函数。
        (async ()=>{
            // 做一些异步的操作...
            next(this); // 必须传入 this。
        })();
    }
}
```

这个特性也可以用在 Socket 控制器中，实际上，除非特别说明，否则这份文档所介绍到的所有
特性都可以同时在 HTTP 和 Socket 控制器中使用。

在 Socket 控制器中，构造器则是这样定义的：

```javascript
module.exports = class extends SocketController{
    constructor(options, socket, next){
        // ...
    }
}
```

## 在一个项目中创建多个应用

是的，你可以在一个 Cool-Node 项目中建立一个以上的应用。更重要的是，这非常简单。

- 在 1.3.0 版本以前，你只需要拷贝一份 `node_modules/cool-node/App-example` 到项目
    的根目录下，并将其以 `App.subdomain` 的形式命名；
- 在 1.3.0 版本以后，你可以使用命令行应用生成器来快速生成新应用，只需要使用这样的
    命令：`cool-node subdomain`。

这样工作就做完了。其他的工作，就如同你在主应用 `App` 中会做的那样。

实际上，在 `App` 目录下的主应用，也是项目中的一个子应用，它保留着子域名 `www`, 这
意味着，如果你访问 `http://www.localhost`，将会和访问 `http://localhost` 一样。
但是，如果你访问 `http://a.localhost`，而你没有一个名为 `App.a` 的文件夹在项目根
目录下，一个 404 错误将会被抛出来。

这个特性是通过在 `/config.js` 的 `host` 配置项来实现的，当一个客户端发起到服务器的
请求时，框架就会通过设置的主机名来分割出所使用的子域名。这意味着，如果你有一个 
`App.a` 文件夹在项目中，当访问 `http://a.localhost` 时，里面的应用就能够像预料的
那样正确运行。但是如果你访问 `http://a.abc.com` （假设你的 DNS 将 abc.com 指向到
127.0.0.1），应用就永远不会被运行。

请注意，如果你使用 Windows 作为你的开发环境，你可能会无法在某些浏览器中访问 
`http://a.localhost`，在我的经验中，只有 Chrome 浏览器能够正确访问。如果你使用其他
浏览器，如 Firefox，Edge 之类的，你可能需要修改你电脑中的 `hosts` 文件，它在 
`C:\Windows\System32\drivers\etc\` 目录下，然后添加一行新内容如下：

```sh
127.0.0.1  a.localhost
```

如果你在其他平台上也遇到了相似的问题，也同样编辑 `hosts` 文件，确保子域名正确地指向 
`127.0.0.1`。

## 抛出并显示错误到客户端

向客户端展示错误信息是非常简单的，如 `404 Not Found!`，只需要在控制器方法中抛出一个 
Error 错误，框架就能够自动地捕捉错误，并尝试向客户端展示它。请看这个示例：

```javascript
// /App/Controllers/HttpTest.js
module.exports = class extends HttpController{
    get404(){
        throw new Error("404 Not Found!");
    }
}
```

然后当你访问 `http://localhost/HttpTest/404` 时，一个 404 错误就会显示给你。它可能
并不是你所抛出的错误消息，这取决于你的视图。如果你有一个 `404.html` 文件在 
`/App/Views/` 目录下，那么该视图将会被用于来展示错误。否则，所抛出的错误消息就会被
显示到客户端。这个规则同时也适用于其他类型的错误，如 400、401、403、500，等等。

如果错误是在 Socket 控制器中抛出的，那么一个表示操作失败的消息就会被发送到客户端，如
`{success: false, error: '404 Not Found!', code: 404}`。

## 编写你自己的中间件

你可以编写自己的中间件，然后将它们存放在 `/App/Middleware/` 目录下（HTTP 中间件放在
`http/` 中，而 Socket 中间件放在 `socket/` 中），如同控制器一样，它们也会在服务器
启动时自动装载到系统中。

为了最大限度方便你使用，在 Cool-Node 项目中的中间件都保留了 **Express** 和 
**Socket.io** 的所有能力。

这是两个简单的示例，向你展示如何编写一个你自己的中间件。

```javascript
module.exports = function(app){
    // /App/Middleware/http/test.js
    app.use((req, res, next) => {
        // 在这里执行操作...
        next();
    });
};
```

```javascript
// /App/Middleware/socket/test.js
module.exports = function(io){
    io.use((socket, next)=>{
        // 在这里执行操作...
        next();
    });
};
```

如果你使用 Node.js 7.6.0 以上版本，你也可以在中间件中使用 `async` 异步函数，像这样：

```javascript
// For Express:
app.use(async (req, res, next)=>{
    // 在这里执行操作...
    await next();
});

// For Socket.io
io.use(async (socket, next)=>{
    // 在这里执行操作...
    await next();
})
```

请注意，因为在 `Middleware` 中的中间件是自动加载的，其加载顺序是按照字母表来的，因此
如果你有很多个中间件文件，你最好将他们按照数字开头的方式来命名，并且数字从 0 开始
计算。

## 处理 XML

自 1.0.6 版本其，你可以通过一个头部信息字段 `Content-Type: application/xml` (或者
 `text/xml`) 来操作 HTTP 请求和响应。如果这个头字段是出现在请求中的，那么 
 `req.body` 属性将会被自动解析为一个对象；如果你将这个字段设置在响应对象上，那么响应
 的数具将会被自动转换成 XML 文档。

```javascript
module.exports = class extends HttpController{
    getShowXML(req, res){
        // 发送 XML 到客户端，这个返回的对象将会被自动转换为 XML 文档。
        res.type("xml");
        return {a: "Hello", b: "World!"};
    }
}
```

## 在 HTTP 控制器中广播消息

1.1.0 版本新增了两个全局变量，`wsServer` 和 `wssServer`，它们代表着由 *Socket.io*
所创建的对应的 WebSocket 服务器，并可以用来在 HTTP 控制器中通过 WebSocket 通道向
客户端广播消息。

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController {
    postBroadcast(req, res){
        // wsServer 或 wssServer 可能为 null，如果对应的服务器没有启动的话。
        if(wsServer){
            wsServer.emit("http-broadcast", req.body);
        }
        if(wssServer){
            wssServer.emit("http-broadcast", req.body);
        }
        return req.body;
    }
}
```

而在客户端中：

```javascript
socket.on("http-broadcast", function(data){
    console.log("HTTP Broadcast: ", data);
});
```

## 在控制器中使用 Async/Await

自 Node.js 7.6.0 起，你可以使用 `async` 来定义异步的函数或者方法，它是 Promise 的
另一个替代方案。同时通过协程的能力，你可以将你的代码写得更具可读性，并且更高效。使用 
Cool-Node，这很容易这么做到。

```javascript
const HttpController = require("./HttpController");
const User = require("modelar/User");

module.exports = class extends HttpController {
    /** e.g. GET /User/id/1 */
    async get(req) {
        if (!req.params.id) {
            throw new Error("400 Bad Request!");
        }
        var user = await User.use(req.db).get(req.params.id);
        console.log(user);
        return user;
    }
}
```

## 永久地运行你的服务器

`forever` 是一个简单的 CLI 工具，用来确保所设置的脚本能够持续地运行。我向你介绍它的
原因，是由于 Node.js 服务器可能会因为未知的原因而崩溃，使用 *forever* 将能确保你的
服务器持续地运行，意味着即使脚本崩溃了，它也能够自动重启。

要安装 `forever`，只需要运行下面的命令（不要忘了 `-g` 参数）：

```sh
npm install forever -g
```

安装之后，你可以直接在你的 Cool-Node 项目的目录中使用命令 `forever start index.js`
来检查你是否正确安装了 *forever*。

*Forever* 只有个在操作系统运行时才能确保脚本的持续运行，如果系统重启了，那么所有由
*forever* 托管的进程都将会被停止。所以我们还需要使 *forever* 能够在系统重启之后自动
运行。

如果你的系统是 CetOS (其他 Linux 平台也该也是一样)，编辑 `/etc/rc.local` 文件，并
添加新的一行内容到其底部：

```sh
forever /root/cool-node-website/index.js > /dev/null
```

`/root/cool-node-website/index.js` 表示你的 Cool-Node 项目的入口文件，不要忘了将
其替换成你自己的路径。更多关于 `forever` 的细节，在 
[www.npmjs.com/package/forever](https://www.npmjs.com/package/forever) 
上有介绍。

现在你已经走过了所有的课程，你现在可以按照自己的想法来自由地编写你的应用了。