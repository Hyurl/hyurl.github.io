# Concept

You may have seen the `logger` property in the [Service](./service) page, its 
backed by [sfn-logger](https://github.com/hyurl/sfn-logger) module actually.
You may want to learn more complicated details about this module, but in 
**SFN**, it's not necessary, for most of the case, you would only need to call
it from the `logger` property.

By default, logs are stored in `src/logs/` directory.

## How to use?

The `logger` object is very similar to the native `console` object, so does 
usage, you don't have to learn anything new before using it, just changing you 
habit, use `logger` instead of `console` when you want to log to a file.

### Example

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

## Difference between `console` and `logger`

There are two major differences between this two objects. 

- `logger` writes logs to a disk file.
- `logger` is asynchronous and non-blocking.

Apart from this two differences, there are some details that the `logger` acts
different than the `console`. e.g. the `logger` is save in multi-processing 
scenarios, all the logs will be written by the master instead of workers to 
protect writing one file from concurrency across workers.

## Configuration

You can set configurations in a service class definition, the `logConfig` 
property is you target, the following example shows you how to configure the 
logger to over-write the log file when it's size approaches 2Mb, and send file
contents to an e-mail address.

### Example of logger configurations

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

## Special performance in **SFN**

In the **SFN** framework, the `logger` property in the service, has some 
special performance different to the original `new Logger()` from 
**sfn-logger** module. 

First, logger instances are cached in memory and differed by filenames, that 
means even in different services, if only you set the `logConfig.filename` to 
a same name, that won't make a deference, only the first referenced 
configuration will be use.

Second, you can set the `logConfig.action` in a service, so that when the log 
is output, it will carry the information of the action you've triggered. But 
in a controller, setting this property will not work, the framework will 
automatically reset it to the controller filename along with the method that 
has been called. In the above example, when the method `index()` is called, it
will log something like this:

```plain
[2018-02-20 17:48:16] [LOG] default.index (d:/my-website/src/controllers/Example.ts) - An example log.
```