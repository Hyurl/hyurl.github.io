## 项目结构

一个典型的 Cool-Node 项目有一个这样的结构:

<pre style="background: #ddd;padding: 10px;color: #333;font-size: 14px;">
/ --------------------- 表示项目的根目录。
|-- App/ -------------- 所含所有 App 的文件。
|   |-- Assets/ ------- 包含所有可以直接访问的文件，如 js, css 等。
|   |-- Controllers/ -- 包含所有控制器文件。
|   |   |-- Home.js --- 用于监听网站根目录的控制器。
|   |
|   |-- Models/ ------- 包含所有模型控制器。
|   |-- Views/ -------- 包含所有视图文件。
|
|-- Middleware/ -------- 包含所有用户定义的中间件文件。
|   |-- http/ ---------- 包含 HTTP 中间件的文件夹。
|   |-- socket/ -------- 包含 Socket 中间件的文件夹。
|
|-- node_modules/ ------ 所有依赖的 Node 模块都保存在这儿。
|
|-- config.js ---------- 项目的配置文件。
|-- index.js ----------- 程序入口文件。
|-- package.json ------- 管理项目及其依赖的文件。
</pre>

## 预留的属性

在一个 Cool-Node 项目中，有一些属性是预留的，你可以使用它们，但是一定要**小心**，
如果你尝试去重新定义它们。

- `global.ROOT` 一个表示项目根目录的字符串路径。
- `global.config` 项目的配置。
- `global.wsServer` 监听 `ws` 协议的 WebSocket 服务器。*(自 1.1.0 起)*
- `global.wssServer` 监听 `wss` 协议的 WebSocket 服务器。*(自 1.1.0 起)*
- `req.session` 当前 HTTP 请求的会话信息。
- `req.cookies` 请求时发送的 Cookie。*(自 1.4.0 起)*
- `req.lang` 请求时客户端接受的语言。*(自 1.4.0 起)*
- `req.subdomain` 当前 HTTP 请求的子域名。
- `req.db` 来自 Modelar ORM 模型系统的一个数据库连接实例。
- `req.files` 携带上传文件信息的对象。*(自 1.3.1 起)*
- `socket.session` 当前 Socket 请求的会话信息。
- `socket.cookies` 握手时发送的 Cookie。*(自 1.4.0 起)*
- `socket.lang` 握手时客户端接受的语言。*(自 1.4.0 起)*
- `socket.subdomain` 当前 Socket 请求的子域名。
- `socket.db` 来自 Modelar ORM 模型系统的一个数据库连接实例。
- `socket.protocol` `ws` 和 `wss` 两者中的一个。*(自 1.2.5 起)*
- `socket.hostname` 从握手的 `Host` 头部信息中获取的主机名称。*(自 1.2.5 起)*
- `socket.ip` 客户端 IP。*(自 1.2.5 起)*
- `socket.ips` 一个包含客户端 IP 和代理 IP 地址（如果有）的数组。*(自 1.2.5 起)*
- `socket.secure` 握手是否是安全的（当使用 `wss` 协议时为安全的）。*(自 1.2.5 起)*

你可以查看其他的 `req` 属性，它们在 Node.js 的 API 文档 
[nodejs.org](https://nodejs.org) 和 Express 的 API 文档
[expressjs.com.cn](http://expressjs.com.cn/) 中都有详细的介绍。同时也可以在 Socket.io 
的 API 文档 [socket.io](https://socket.io/) 中查看更多关于 `socket` 的属性。

同时，项目中还有另外一些预留的属性，如果你赋值给它们，它们将会产生一些特别的意义和作
用。

- `req.session.UID` 当前 HTTP 请求的授权用户的 ID。
- `req.user` 当前 HTTP 请求的授权用户，如果你赋值了 **req.session.UID**，那么该属
    性会自动被赋值为对应的用户。
- `socket.session.UID` 当前 Socket 请求的授权用户的 ID。
- `socket.user` 当前 Socket 请求的授权用户。如果你赋值了 **socket.session.UID**，
    那么该属性会自动被赋值为对应的用户。

### 更多关于 Session 和数据库连接的细节

由于 Cool-Node 是一个跨协议软件，在 HTTP 请求中的 Session，实际上也是对应的 Socket
请求中的 Session。因此当你设置一个属性到 Session 对象上时，无论时从 HTTP 中，还是 
Socket 中，另一端也会同时被影响。这意味着，当你从 HTTP 中登录后，Socket 这一端也
同时登录了，相反亦然。

同时，由于 `req.user` 只在当前请求中有效，因此你应该始终赋值 `req.session.UID`，
如果你是使用 Session 来识别用户的话。但是如果你使用其他的技术，例如 access token ，
那么你应该在对应的中间件中赋值 `req.user` 和 `socket.user`。

另一个关于 Session 的提示，Cool-Node 默认将 session 存储在内存中，在生产环境中，这
可能并不理想，因此，你应该在 `config.js` 中手动配置其它存储引擎，例如 
`connect-redis`。

不必担心当每一次你调用 `req.db` 或者 `socket.db` 时，一个新的数据库连接会被创建，
并不会。Modelar ORM 能够非常高效地控制数据库连接，连接并不会在你显式地调用 
`db.connect()`, 或者在运行一条 SQL 语句时隐式地建立。

从 1.1.0 版本起，`req.db` 和 `socket.db` 也可以被赋值或者预先定义，如果你没有赋值
给它们，当调用时，一个默认的实例则会被创建。

同时，当一个 HTTP 响应或者 Socket 消息被发送后，所有的连接都会被回收到内部的连接池
中，等待下一次请求。

[下一章](WritingHttpControllers)