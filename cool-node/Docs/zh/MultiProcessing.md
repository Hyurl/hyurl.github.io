## 充分利用你的服务器资源

如果你的服务器 CPU 核心数在两个或以上，那么你可以通过使用多进程来运行多个服务器实例，
它们能够最大限度的利用计算机的 CPU 资源，从而提高网站的运行效率。

要使用多进程来运行服务器，是非常简单的。自 1.4.0 版本起，Cool-Node 内核模块专门为多
进程环境进行了优化，因此你不需要考虑太多内部的细节，只要在配置文件中，修改或添加一处：

`config.server.workers`

这个配置项是 1.4.0 版本加上的，如果你是从旧版本升级过来的，需要自行加上。它的默认值是
`0`，也就是不开启任何工作进程，只使用单进程。要开启多进程，你需要将它设置为一个不超过
服务器 CPU 数量的正整数，一般的，你可以设置为 `require("os").cpus().length`，这样
它就被设置为了和 CPU 核心数相同的进程数了。

### 多进程模型

Cool-Node 的多进程模型被设计为 **由主进程管控大局，工作进程负责处理客户端连接**。在
使用多进程时，主进程会 fork 出所设置数量的工作进程，它们都开启一个服务器实例，来在
不同的 CPU 核心上处理业务逻辑。而主进程，它并不会开启服务器实例，而是作为一个管家的
角色，来管理这些工作进程，例如当某一个工作进程以外挂掉时，主进程会立即 fork 一个新的
工作进程，从而保持工作进程的数量始终不变。

主进程同时处理一些杂项，例如日志的刷送。在单进程下，日志是由当前进程来处理的，在多
进程时，如果几个进程同时对一个日志文件进行读写，那肯定会产生问题。因此在多进程环境下，
日志不再由工作进程处理，而是被自动提交给主进程，由主进程来负责日志的管理。并且，这也
能减少工作进程的负担，让其专心做好自己的事情，而把杂项留给主进程去处理。

### 进程间通信

多进程是基于 Node.js 的 **cluster** 模块来实现的，它使得多个子进程之间能够共用一个
端口，并且提供了一套出色的方案来实现进程之间的通信。

Cool-Node 对 cluster 稍稍封装了一个更为易用的工具——**Channel**，在进程中，推荐使用
它来发送和接收消息。

要使用 Channel 工具，只需要使用 `const { Channel } = require("cool-node");` 来
引入，它包含了下面这些属性和方法：

- `Channel.isMaster` 是否为主进程；
- `Channel.isWorker` 是否为工作进程；
- `Channel.cluster` 一个 cluster 的引用；
- `Channel.code` 进程的代号，由 `A` 至 `Z`；
- `Channel.on(event, handler)` 添加一个事件处理函数到指定事件上；
- `Channel.once(event, handler)` 添加一个只会运行一次的事件处理函数到指定事件上；
- `Channel.emit(event, ...data)` 发送一条消息到主进程或工作进程，如果当前进程是主
    进程，则发送到所有工作进程；如果当前进程是工作进程，则消息会被发送到主进程；
- `Channel.emitTo(id, event, ...data)` 发送一条消息到指定的工作进程，`id` 可以是 
    worker id 或者进程的 pid，或者一个 Worker Code。
- `Channel.broadcast(event, ...data)` 向所有工作进程广播消息，这包括工作进程本身。

和 Socket.io 很像对吧？如果你已经熟悉了 Socket.io，那么它们对你来说将不难使用。下面
是一个使用示例：

```javascript
const { Channel } = require("cool-node");

if(Channel.isMaster){
    Channel.on("greeting", (msg, pid)=>{
        // 接收子进程的问候
        console.log(msg, pid);
    });
    setTimeout(()=>{
        // 这条消息将会在 2s 后发送给所有子进程
        Channel.emit("greeting", "Hello, everyone, I'm your master %d.", process.pid);
    }, 2000);
}else if(Channel.isWorker){
    Channel.on("greeting", (msg, pid)=>{
        // 接收父进程的问候
        console.log(msg, pid);
        // 回敬父进程的问候
        Channel.emit("greeting", "Hi, master, I'm your worker %d.", process.pid);
    });
}
```

我们可以看到，父子进程之间的通讯是相当简单的。但是子进程和子进程之间的通讯可就不是
那么简单了。虽然 `Channel.emitTo()` 方法允许一个子进程将消息发送给另一个子进程，
但是必须要提供对方的 worker id 或者 pid，然而，在子进程中，是无法预知其它进程的这些
信息的。

为了解决这个问题，Cool-Node 在所有的 Worker 上捆绑了一个由 `A` 到 `Z` 排序的 Code，
无论进程的 pid 和 worker id 怎么分配，Worker 的 Code 是始终不变的，例如开启了 4 个
工作进程，那么它们的 Code 依次为 `A`, `B`, `C`, `D`。假设 Worker A 意外退出，那么
一个新的进程就会自动启动，来弥补空缺，新进程的 Code 也是 A。

```javascript
const { Channel } = require("cool-node");

if(Channel.isWorker){
    // 需要在通道准备就绪后才能执行工作进程间的通讯
    Channel.on("ready", ()=>{
        if(Channel.code === "A"){
            Channel.on("greeting", (msg, code)=>{
                console.log(msg, code);
            });
        }else{
            Channel.emitTo("A", "greeting", "Hi, worker A, I am worker %s.", Channel.code);
        }
    });
}
```

一般而言，子进程之间的逻辑是相同的，因此在它们之间相互发送消息并没有多大的意义。如果
子进程有不需要自己来处理的事务，则应该交给主进程来处理。同时，如果子进程需要将消息广播
到其它进程时，则可以通过 `Channel.broadcast()` 来实现。它会向包括当前进程在内的所有
工作进程发送消息，从而使你能够只编写一份代码来处理逻辑，而不需要在当前进程写一份代码，
在进程监听消息的地方又再写一份。

### 多进程中避免做这些事

**不要使用基于内存的 Session 存储引擎**。框架默认使用 MemoryStorage 来将 Session 
存储在内存中，但是它并不适合真正的生产环境，更不适合多进程。想象一下，当你在一个进程
完成登录时，它将 Session 存储在了那个进程的内存对象中，而访问下一个页面的时候，由另
一个进程来处理请求，那么你的登录信息将会失效，我相信你肯定不愿意发生这种情况。因此，
在生产环境中，请务必更换其它的存储引擎，例如 
[connect-redis](https://www.npmjs.com/package/connect-redis)。你可以在 
`config.js` 中引入它，并简单地配置到相应的位置。

**不要使用基于内存的 Socket.io 存储引擎**。Cool-Node 使用 Socket.io 来处理 
WebSocket 连接，但是它默认也是将客户端连接存储在内存中的。如上面所说，存储在内存中的
对象是不适合多进程环境的。例如有两个客户端，分别连接了 A 和 B 两个工作进程，那么它们
就无法知道对方是否在线，也不能向对方发送信息。在进行 WebSocket 广播时，也永远只有连接
到当前进程的客户但能够接收到消息，这些都不是我们所希望的。为了解决这个问题，Socket.io
官方推荐了一个 [socket.io-redis](https://www.npmjs.com/package/socket.io-redis) 
存储引擎，如果你希望在多线程中使用 WebSocket，请务必草参考它。

[下一章](Security)