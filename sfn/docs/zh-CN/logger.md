<!-- title: 日志 -->
# 基本概念

你可能已经在 [Service](./service) 页面中看到了 `logger` 属性，它实际上是由 
[sfn-logger](https://github.com/hyurl/sfn-logger) 模块提供支持的。你也许会想要
了解更多关于这个模块的复杂细节，但是在 **SFN** 框架中，这不是必须的，在大多数时候，你
只需要从 `logger` 属性中调用它。

默认地，日志文件将会保存在 `src/logs/` 目录中。

## 如何使用？

`logger` 对象非常类似于内置的 `console` 对象，其用法也相同，你不需要学习任何新的知识
便能够使用它，只需要改变一下习惯，使用 `logger` 来替代 `console`，当你需要将日志记录
到一个文件中时。 

### 示例

```typescript
import { Service } from "sfn";
import { User } from "modelar";

var srv = new Service;

(async (id: number) => {
    try {
        let user = <User>await User.use(srv.db).get(id);
        srv.logger.log(`Getting user (id: ${id}, name: ${user.name}) succeed.`);
        // ...
    } catch (e) {
        srv.logger.error(`Getting user (id: ${id}) failed: ${e.message}.`);
    }
})(1);
```

## `console` 和 `logger` 的区别

这两个对象之间有两个主要的区别：

- `logger` 将日志保存到一个磁盘文件中。
- `logger` 是异步非阻塞的。

除了这两点区别，还有一些细节上 `logger` 的行为也不同于 `console`。例如，`logger` 
在多进程场景中是安全的，所有的日志都会由主进程来进行写出，而不是由工作进程，从而防止
在跨进程时并发写出到同一文件。

## 配置

你可以在服务类的定义中进行设置，`logConfig` 属性就是你的目标，下面的示例将展示给你
如何配置日志对象从而将其重写为当其文件体积达到 2Mb 时，将其内容转发到一个电子邮件地址
上。

### 日志配置的示例

```typescript
// src/controllers/Example.ts
import { HttpController, Request, Response, config, route } from "sfn";

export default class extends HttpController {
    constructor(req: Request, res: Response) {
        this.logConfig.ttl = 0;
        this.logConfig.size = 1024 * 1024 * 2; // 2Mb
        this.logConfig.mail = Object.assign({}, config.mail, {
            subject: `[Logs] from my website`,
            to: "reciever@example.com"
        });
    }

    @route.get("/example")
    index() {
        this.logger.log("An example log.");
        return true;
    }
}
```

## 在 **SFN** 框架中的特殊表现

在 **SFN** 框架中，服务中的 `logger` 属性会有一些特殊的表现，不同于来自 
**sfn-logger** 模块的原始的 `new Logger()`。

首先，`logger` 的实例会被缓存到内存中且根据文件名作为区分，这意味着即使在不同的服务
中，只要你设置了 `logConfig.filename` 为相同的名字，那它们将没有任何作用，只有第一个
被引用的配置会被使用。

其次，你可以在一个服务中设置 `logConfig.action`，然后当日志被输出时，它会携带着你所
出发的操作的信息。但在控制器中，设置这个属性并不会产生作用，因为框架会自动将其重置为
控制器文件的名称，并包含被调用的方法名。在上述的例子中，当方法 `index()` 被调用时，
它将会记录类似这样的信息：

```plain
[2018-02-20 17:48:16] [LOG] default.index (d:/my-website/src/controllers/Example.ts) - An example log.
```