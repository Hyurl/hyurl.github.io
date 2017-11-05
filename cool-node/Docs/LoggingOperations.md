## The File Logging System

Since version 1.3.0, Cool-Node provides a logging system with controllers, the
`logger` object, it's usage is very similar to `console`, but instead of 
outputing information to the console, it stores logs in a disk file, so you 
can check them any time you want.

`logger` object has four main methods, as I said, their usage is pretty much 
the same as the version of `console`'s.

- `logger.log()`
- `logger.info()`
- `logger.warn()`
- `logger.error()`

By default, the log filename is `App/Logs/cool-node.log`, you can manually 
change it by redefining the property `controller.logConfig.filename`.

The log file will be rewrited when the file size reach `2MB`, old logs will be
automatically compressed to GZip and restored in folders odered by dates. 
Also, You can reassign the property `controller.logConfig.fileSize` to change 
the size limit.

Optionally, you can set an email address by defining 
`controller.logConfig.mailTo`, when the log file up to limit, instead of
 compressing to GZip, send it to an email box.

This is an exmaple of using `logger`:

 ```javascript
module.exports = class extends HttpController {
    constructor(options, req, res){
        super(options, req, res);

        this.logConfig.fileSize = 1024 * 1024 * 10; // 10MB
        
        // If you set this property, make sure you have set the right email 
        // configurations in config.js.
        this.logConfig.mailTo = "example007@gmail.com";
    }

    index(req){
        this.logger.log("User (UID: %d) visited.", req.user.id);
    }
}
```

Since version 1.4.0, when calling the methods above to make logs, the log 
won't be immediately saved to files, frequent IO operation will affect 
server's efficiency. So, Cool-Node provides a temporary scheme, now logs will 
be firstly saved to memory, then after a while, flushed to the file. By 
default, the time is `1000`ms, you can change it by reassigning 
`controller.logConfig.ttl`.

The new log scheme will affect to all controllers, which means if share the 
same log file, only one controller's configuration will work, and which one 
cannot be predicted. If you want all controllers sharing the same 
configuration, you can modify the `HttpController` and `SocketController` 
which under the `App/Controllers/` to do so.

You can create and export a new controller, so that all their children classes
will inherit its behavior. In fact, the reason why the framework keeps a copy 
of `HttpController` and `SocketController` in `App/Controllers/` is for 
handling such a scenario, you can customize the parent class freely.

Speaking of Email, the next chapter, I will give you more details about it.

[Next Chapter](Mail)