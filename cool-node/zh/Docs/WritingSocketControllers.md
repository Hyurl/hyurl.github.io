## 创建一个 Socket 控制器

Cool-Node 使用 **Socket.io** 来处理 Socket 通讯，你可以在 
[socket.io](https://socket.io/) 上查阅更多关于它得信息。

编写一个 Socket 控制器几乎是和编写一个 HTTP 控制器相同的，实际上，HttpController 
和 SocketController 都是基本的 Controller 类的子类，因此它们都有一些共同的基本属性
和方法。

如同编写一个 HTTP 控制器，首先，你在 `/App/Controllers/` 目录下创建一个 
JavaScript 文件并将其命名为 `SocketTest.js`，然后编写其代码并定义一个类，像这样：

```javascript
const SocketController = require("./SocketController");

module.exports = class extends SocketController{}
```

和编写 HTTP 控制器很像，不是吗？当然是。并且很多 HTTP 控制器所有的特性，也可以用在
Socket 控制器中，例如返回值将会被自动发送到客户端、所有操作都被包裹在 Promise 中，
等等。甚至视图系统也都可以使用在 Socket 控制器中。

但是由于 Socket 控制器没有 RESTful API，也不需要指定请求的类型，因此当一个客户端
进行调用时，你必须指定完整的 Socket 控制器方法名。

哦，顺便说一句，由于 Socket 控制器使用 **Socket.io** 因此在客户端，你也应该使用 
Socket.io。在 `/App/Assets/js/` 目录下，已经存放着一个 Socket.io 的客户端版本，
但是为了防止它过期，你可以从 `/node_modules/socket.io-client/` 目录中复制最新版本
来替换它。

WebSocket 服务器监听着和 HTTP 服务器相同的端口，因此在客户端，只需要使用 Socket.io 
连接到相同的协议和端口上。


```javascript
var socket = io("http://localhost");
```

这是一个更复杂的示例：

```javascript
const SocketController = require("./SocketController");

module.exports = class extends SocketController{
    /**
     * Socket 控制器会通过与方法名相同的事件名称将返回的数据发送给客户端，在这里，
     * 则是 SocketTest/showHello，因此在客户端，你也应该监听到与发送数据相同的事件
     * 名称上。这个方法可以通过此种方式来访问：
     * socket.on("SocketTest/showHello", function(data){
     *     console.log(data); // data 将会是 'Hello, World!'.
     * }).emit("SocketTest/showHello");
     */
    showHello(){
        return "Hello, World!";
    }

    /**
     * 所有的 Socket 控制器都接受两个参数：
     * `data` 客户端发送的数据。
     * `socket` 对应的 Socket 对象。
     * 这个方法可以用这种方式来访问：
     * socket.on("SocketTest/sayHello", function(data){
     *     console.log(data); // data 将会是 'Hello, Client!'.
     * }).emit("SocketTest/sayHello", "Hello, Server");
     */
    sayHello(data, socket){
        console.log(data); // data 将会是 'Hello, Server'.
        return "Hello, Client";
    }
}
```

当服务器启动的时候，框架会查找出控制器中所有可用的方法，如果你不想某个方法被客户端
访问到，只需要将其名称使用 `_` 开头即可，这样的方法将会被视为私有方法而被过滤掉。

如果你不熟悉 Socket.io，我建议你在 [socket.io](http://socket.io) 上瞄一眼它。

## 发送具有通用结构的数据

Controller 类（包含 HTTP 和 Socket）中有两个方法，你可以使用它们来发送成功或者失败
的消息到客户端。

### controller.success()

*发送成功的操作结果到响应的上下文。*

**参数：**

- `data` 需要发送的数据
- `[code]` 一个表示操作状态的代码。

**返回值：**

返回一个 Promise，传递给 `then()` 的唯一参数是一个对象并包含这些信息：
- `success` 表示操作是否成功，总是 `true`。
- `data` 上文中给出的 `data`。
- `code` 上文中给出的 `code`。

### controller.error()

*发送失败的操作结果到响应的上下文。*

**参数：**

- `msg` 一条表示操作失败的消息。
- `[code]` 一个表示操作状态的代码。

**返回值：**

返回一个 Promise，传递给 `then()` 的唯一参数是一个对象并包含这些信息：
- `success` 表示操作是否成功，总是 `false`。
- `msg` 上文中给出的 `msg`。
- `code` 上文中给出的 `code`。

```javascript
const SocketController = require("./SocketController");

module.exports = class extends SocketController{
    showGood(){
        return this.success(["Hello", "World"]);
    }

    showBad(){
        return this.error("Error reason.");
    }
}
```

现在我们已经讨论了如何编写控制器，接下来，让我向你展示如何编写一个视图文件。