## 文件日志系统

自 1.3.0 版本起，Cool-Node 在控制器中提供了一个日志系统 —— `logger` 对象，它的用法
和 `console` 极为相似，但相比将信息输出到控制台，它则将日志保存到一个磁盘文件中，
从而你可以选择在任何时候查看它们。

`logger` 对象拥有四个主要的方法，如我所说的，它们的用法和 `console` 版本的同名方法
是如出一辙的。

- `logger.log()`
- `logger.info()`
- `logger.warn()`
- `logger.error()`

默认地，日志的文件名称是 `App/Logs/cool-node.log`，你可以手动修改它，只需要从新定义
属性 `controller.logConfig.filename`。

当文件的体积达到 `2MB` 时，它将会被重写，旧的日志内容则将会被压缩为 GZip，并重新保存
到根据日期编排的的文件夹中。同时，你也可以重新赋值属性 
`controller.logConfig.fileSize`，来更改文件体积的上限。

可选地，你也可以设置一个电子邮件地址，通过设置 `controller.logConfig.mailTo` 属性，
在日志文件的体积达到上限时，不压缩为 GZip，而是将其发送到电子邮件的收件箱中。

这是一个使用 `logger` 的示例:

 ```javascript
module.exports = class extends HttpController {
    constructor(options, req, res){
        super(options, req, res);

        this.logConfig.fileSize = 1024 * 1024 * 10; // 10MB

        // 如果你设置这个属性，请确保你已经在 config.js 中正确地设置了电子邮件配置。
        this.logConfig.mailTo = "example007@gmail.com";
    }

    index(req){
        this.logger.log("User (UID: %d) visited.", req.user.id);
    }
}
```

自 1.4.0 版本起，在调用上述方法存储日志时，日志不会立即被保存到文件中，频繁的 IO 
操作会极大地影响服务器的性能，因此，Cool-Node 提供了一个缓存方案，新日志将会先被存储
在内存中，然后在一定时间之后，才会被刷送到文件中。默认的，这个时间是 `1000`ms，但是
你可以通过修改 `controller.logConfig.ttl` 来设置为其它的值。

新的日志记录方案将会对所有控制器造成影响，这意味着只要日志文件名称相同，那么只有一个
控制器的设置会生效，而具体是那一个控制器会生效，这并不能预知。如果你想要为所有的控制
器设置一份相同的配置，可以通过修改 `App/Controllers/` 下面的 `HttpController` 和 
`SocketController` 来实现。

你可以创建并导出新的控制器父类，这样所有继承于它们的子控制器类也会继承它们的行为。
实际上，之所以框架会在 `App/Controllers/` 中导出一份 `HttpController` 和 
`SocketController` 的拷贝的原因，就是为了应对此类情况，你可以自由地定制你想要继承的
类。

说到电子邮件，在下一个章节中，我将会介绍给你更多关于它地细节。

[下一章](Mail)