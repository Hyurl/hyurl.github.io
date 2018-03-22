# 基本概念

`WebSocketController` 处理来自 [socket.io](https://socket.io/) 客户端的消息。

由于这个模块使用 socket.io，你需要提前学习它，从而能够完全处理你的工作。

# 如何使用？

如同 **HttpController**，你创一个文件存储在 `src/controllers` 中，这个文件应该导出
一个默认的类并继承自 `WebSocketController`，然后它就能够在服务器启动时被自动的加载。

## 示例

```typescript
import { WebSocketController, event } from "sfn";

export default class extends WebSocketController {
    @event("/demo")
    index() {
        return "Hello, World!";
    }
}
```

## 事件和方法的关系

当一个方法被 `@event` 修饰时，这个方法将会被绑定到一个确定的 socket.io 事件上。当
一个客户端发送数据到这个事件上时，这个方法就会被自动地调用，其返回值将会被自动地以合适
的形式返回给客户端。

### 兼容 JavaScript

如果你正在使用纯 JavaScript 来编程，它并不支持装饰器（尚未支持），但框架提供了一种
兼容的方式能够让你使用相似的特性，通过使用 **jsdoc** 注释块配合 `@event` 标签。你
必须先在 `config.js` 中打开 `enableDocRoute` 选项才能使用这个特性。下面这个示例和
上面的效果是一样的。

```javascript
// config.js
exports.default = {
    // ...
    enableDocRoute: true,
    // ...
};
```

```javascript
// src/controllers/Demo.js
const { WebSocketController } = require("sfn");

exports.default = class extends WebSocketController {
    /**
     * @event /demo
     */
    index() {
        return "Hello, World!";
    }
}
```

## 方法的签名

所有在 WebSocketController 中绑定到唯一事件上的方法支持两个或更多的参数：

- `...data: any[]` sent by the client.
- `socket: WebSocket` the underlying socket.

剩余参数 `...data` 表示此处可能有超过一个的参数，请看这个例子：

```typescript
import { WebSocketController, WebSocket, event } from "sfn";

export default class extends WebSocketController {
    /**
     * On client side:
     *      socket.emit("event1", "Hello, World!");
     */
    @event("/event1")
    event1(data: any, socket: WebSocket) {
        return data; // => 'Hello, World!'
    }

    /**
     * On client side:
     *      socket.emit("event1", "Hello, World!", "Hi, sfn!");
     */
    @event("event2")
    event2(data1: any, data2: any, socket: WebSocket) {
        return [data1, data2]; // => ['Hello, World!', 'Hi sfn!']
    }
}
```

如你所见，无论有多少个 `data` 参数被传递，`socket` 永远是最后一个参数。

### 在 JavaScript 中

由于 JavaScript 不支持类型标注，当传递 `socket` 到方法中时，它的类型将会被自动地设置
为 `any`，这意味着你不通过它获取到任何类型提示。因此与其将它传递为参数，你可以在方法
中从 `this` 对象来获取它，这样就能够在一些 IDE 中为你提供类型提示，例如在 
**VS Code** 中。

```javascript
const { WebSocketController } = require("sfn");

exports.default = class extends WebSocketController {
    /**
     * @event /demo
     */
    index() {
        let { socket } = this;
        // ...
    }
}
```

### 构造函数

有些时候你可能想要在真正的方法被调用前做一些事情，你可能想要进行一些额外的配置，在类被
实例化前，你想要自定义类的 `constructor`。就像下面这样：

```typescript
import { WebSocketController, WebSocket } from "sfn";

export default class extends WebSocketController {
    constructor(socket: WebSocket) {
        super(socket);
        
        // your stuffs...
    }
}
```

如果我想要 **在构造函数中做一些异步的操作呢**？JavaScript 是不会允许你定义一个 
`async constructor()` 的，但不用担心，**sfn** 提供了一个特别的方式让你可以这么做。
你所需要做的，就是传递第三个参数 `next` 到 `constructor()` 中，然后在你准备好调用
实际方法时，调用 `next(this)`。

#### 读取文件的示例

```typescript
import * as fs from "fs";
import { WebSocketController, WebSocket, event } from "sfn";

export default class extends WebSocketController {
    txtData: string;

    constructor(socket: WebSocket, next: Function) {
        super(socket, next);
        
        fs.readFile("example.txt", "utf8", (err: Error, data: string) => {
            this.txtData = data;
            next(this);
        });
    }

    @event("/example")
    example() {
        return this.txtData;
    }
}
```

这个特性只是为你提供了一个小窍门，除此之外，你也可以直接定义一个 `async method()`，
然后在每一次调用绑定路由的方法进行任何操作前先调用这个方法。但某些时候，你必须要使用
这个技巧，由于框架会在控制器初始化时进行状态检查，然后才决定接下来该做什么，如果不将
`next` 传递过去，那些检查将永远不能工作。

### 关于 WebSocket 的提示

`WebSocekt` 是一个 TypeScript 接口，实际上在 **sfn** 框架中存在着很多的接口（和 
`type` 类型）。它们并不是类，因此也不能被实例化，或者使用 `instanceof` 来检测，如果
你在代码中有任何这样的代码，那只会给你自己造成麻烦。

```typescript
// These example is wrong and should be avoid.

var obj = new WebSocket;

if (obj instanceof WebSocket) {
    // ...
}
```

接口（和类型）在 JavaScript 中是不导出的，因此下面的代码是不正确的。

```javascript
const { WebSocket } = require("sfn"); // WebSocket would be undefined.
```

### 在控制器中抛出 SocketError

`SocketError` 是一个由框架定义的错误类，它是安全的，你可以在想要响应一个 HTTP 错误到
客户端时使用它。当一个 SocketError 被抛出时，框架将会对其进行合适的处理，并自动地发送
错误响应内容。

`SocketError` 和 `HttpError` 几乎是一样的，因此在 SocketError 中使用 HTTP 错误
代码是很常见的。

```typescript
import { WebSocketController, SocketError, event } from "sfn";

export default class extends WebSocketController {
    @event("/example")
    example() {
        let well: boolean = false;
        let msg: string;
        // ...
        if (!well) {
            if (!msg)
                throw new SocketError(400); // => 400 bad request
            else
                throw new SocketError(400, msg); // => 400 with customized message
        }
    }
}
```

当一个 SocketError 被抛出时，框架总是会发送一个包含着 
`{success: false, code, error}` 的消息到客户端，这个响应形式来自于控制器方法
 `error()`。

## WebSocketController 与服务

一个控制器实际上就是一个服务，你可以在一个控制器中使用任何在 [Service](./service) 
中有效的特性。