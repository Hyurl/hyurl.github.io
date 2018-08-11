# Concept

`HttpController` manages requests come from a HTTP client.

# How to use?

You just create a file in `src/controllers`, this file should export a default
class that extends `HttpController`, and it will be auto-loaded when the 
server starts.

## Example

```typescript
import { HttpController, route } from "sfn";

export default class extends HttpController {
    @route.get("/demo")
    index() {
        return "Hello, World!";
    }
}
```

## Relations between the route and method

When a method is decorated with `@route`, this method is bound to a certain 
URL route. When visiting a URL that matches the route, the method will be 
automatically called, and the returning value will be sent back to the client 
with proper forms.

The decorator `route`, is a function, and a namespace. When calling as a 
function, it accept these forms:

- `route(routeStr: string)` e.g. `route("GET /demo")`
- `route(httpMethod: string, path: string)` e.g. `route("GET", "/demo")`

When using as namespace, it contains these methods, each one is a short-hand 
for corresponding HTTP request method.

- `route.delete(path: string)`
- `route.get(path: string)`
- `route.head(path: string)`
- `route.patch(path: string)`
- `route.post(path: string)`
- `route.put(path: string)`

### Compatible for JavaScript

If you're programming with pure JavaScript, there is no decorators (not yet). 
But the framework support a compatible way of doing this, by using a **jsdoc**
block with a `@route` tag. You must turn on `enableDocRoute` in `config.js` 
first before using this feature. The following example works the same as the 
above one.

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
const { HttpController } = require("sfn");

exports.default = class extends HttpController {
    /**
     * @route GET /demo
     */
    index() {
        return "Hello, World!";
    }
}
```

### Route formats

The framework uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 
to parse URL routes, here I will just give you some common usage to 
demonstrate those rules, for more details, you need to see the documentation 
of this module.

```typescript
import { HttpController, Request, route } from "sfn";

export default class extends HttpController {
    /**
     * Common URL path
     * GET /user
     */
    @route.get("/user")
    index() { }

    /**
     * The ':' indicates a URL parameter.
     * This route path will match /user/1, /user/2, /user/3, and so on.
     */
    @route.get("/user/:id")
    getUser(req: Request) {
        return req.params.id; // => 1
    }

    /**
     * The '?' indicates the parameter is optional.
     * This route path will match /user/1, /user/1/edit, and so on.
     */
    @route.get("/user/:id/:action?")
    getUser2(req: Request) {
        return {
            id: req.params.id, // => 1
            action: req.params.action // => undefined or any strings provided.
        };
    }

    /**
     * The '+' indicates one or more parameter matches
     * This route path will macth any URL that starts with /user/, 
     * e.g /user/, /user/1, /user/1/edit, and so on.
     */
    @route.get("/user/:path+")
    getUser3(req: Request) {
        return req.params.path; // => '', 1, 1/edit, etc.
    }

    /**
     * The '+' indicates one or more parameter matches
     * This route path will macth any URL that starts with /user, 
     * e.g /user, /user/, /user/1, /user/1/edit, and so on.
     */
    @route.get("/user/:path*")
    getUser4(req: Request) {
        return req.params.path; // => undefined, '', 1, 1/edit, etc.
    }
}
```

## Signature of methods

From the above example you see I pass a `req: Request` to the methods that 
bound to routes. Actually, all these methods accept two parameters:

- `req: Request` the underlying request.
- `res: Response` the underlying response.

```typescript
import { HttpController, Request, Response, route } from "sfn";

export default class extends HttpController {
    @route.get("/")
    index(req: Request, res: Response) {
        // ...
    }
}
```

### In JavaScript

Since JavaScript doesn't support type assignment, when pass `req` and `res` to
the method, their type is automatically set to `any`, that means you can't get
any type hints from them, so instead of passing these two parameters, you can 
get them from `this` in the method, it should give you hints in some IDEs, 
e.g. in **VS Code**.

```javascript
const { HttpController } = require("sfn");

exports.default = class extends HttpController {
    /**
     * @route GET /
     */
    index() {
        let { req, res } = this;
        // ...
    }
}
```

## Handle Asynchronous Operations

When dealing with asynchronous operations, you can define the method with 
modifier `async`, just like the following:

```typescript
import { HttpController, Request, Response, route } from "sfn";

export default class extends HttpController {
    @route.get("/")
    async index(req: Request, res: Response) {
        // you can use `await` here
    }
}
```

### In JavaScript

Either you're coding in TypeScript or JavaScript, if only you NodeJS version 
is higher than `7.6`, you can always use the `async/await` modifiers. But if 
you're coding in JavaScript and NodeJS version is lower than `7.6`, you can 
use another compatible approach to do so.

Edit your `config.js` file, set `config.awaitGenerator` to `true`, and then 
you can use the `GeneratorFunction` with `yield` to handle asynchronous 
actions, just like this:

```javascript
// config.js
exports.default = {
    // ...
    awaitGenerator: true,
    // ...
};
```

```javascript
const { HttpController } = require("sfn");

exports.default = class extends HttpController {
    /**
     * @route GET /
     */
    * index() {
        // you can use `yield` here
    }
}
```

### Handle Non-Promise Procedures

If your code includes some asynchronous functions, third-party modules that 
doesn't support `Promise`, then you can't use `await` or `yield` to handle 
them, to handle those asynchronous operations, you can either use the 
`promisify()` method from `util` module to wrap them (NodeJS version higher 
than `8.0`), or use them directly, and wherever you want to send data to 
front-end, just call `res.send()`. Look this example:

```typescript
import { HttpController, Request, Response, route } from "sfn";
import * as fs from "fs";
import * as util from "util";

export default class extends HttpController {
    filename = "somefile";

    @route.get("/check-file")
    checkFile() {
        fs.exists(this.filename, exists => {
            if (exists) {
                res.send(this.success("File exists!"));
            } else {
                res.send(this.error("File doesn't exist!"));
            }
        });
    }

    @route.get("/check-file-promisify")
    async checkFilePromisify() {
        // require NodeJs higher than 8.0
        var fileExists = util.promisify(fs.exists),
            exists = await fileExists(this.filename);

        if (exists) {
            return this.success("File exists!");
        } else {
            return this.error("File doesn't exist!");
        }
    }
}
```

## The Constructor

Some times you may want to do something before the actual method is called, 
you want to initiate some configurations before the class is instantiated, you
want to customize the `constructor` of the class. So this is how:

```typescript
import { HttpController, Request, Response } from "sfn";

export default class extends HttpController {
    constructor(req: Request, res: Response) {
        super(req, res);
        
        // your stuffs...
    }
}
```

What if I want to do **asynchronous operations in the constructor**? 
JavaScript will not allow you define an `async constructor()`, but don't worry,
**SFN** provides you the way to do it. All you need to do, is just passing the 
third parameter `next` to the `constructor()`, and calling `next(this)` when 
you're ready to call the actual method.

### Example of reading a file

```typescript
import * as fs from "fs";
import { HttpController, Request, Response, route } from "sfn";

export default class extends HttpController {
    txtData: string;

    constructor(req: Request, res: Response, next: Function) {
        super(req, res, next);
        
        fs.readFile("example.txt", "utf8", (err: Error, data: string) => {
            this.txtData = data;
            next(this);
        });
    }

    @route.get("/example")
    example() {
        return this.txtData;
    }
}
```

This feature just give you a little trick, apart from that, you can just 
define an `async method()`, and call that method in the route-bound method 
before doing any operations. But in some cases, you have to use the trick, 
because the framework will perform state checking once the controller has been 
instantiated, then decide what to do the next, without the `next` passed, 
those checking will never work.

### One tip of Request and Response

`Request` and `Response` are TypeScript interfaces, actually there are a lot 
of interfaces (and `type`s) in **SFN**, they are not class, so can't be 
instantiated, or check `instanceof`, if you have any of these code in your 
application, you just got yourself troubles.

```typescript
// This example is wrong and should be avoid.

var obj = new Request;

if (obj instanceof Request) {
    // ...
}
```

Interfaces (and types) are not exported in JavaScript as well, so this code is
also incorrect.

```javascript
const { Request } = require("sfn"); // Request would be undefined.
```

## Throw HttpError in the controller

`HttpError` is a customized error class that safe to use when you're going to 
response a HTTP error to the client. when a HttpError is thrown, then 
framework will handle it properly, and sending error response automatically.

```typescript
import { HttpController, HttpError, route } from "sfn";

export default class extends HttpController {
    @route.get("/example")
    example() {
        let well: boolean = false;
        let msg: string;
        // ...
        if (!well) {
            if (!msg)
                throw new HttpError(400); // => 400 bad request
            else
                throw new HttpError(400, msg); // => 400 with customized message
        }
    }
}
```

The framework will check what response type the client accepts, and send the 
error properly. More often, a common HTTP error will be responded. But if an 
`Accept: application/json` is present in the request headers, a `200` status 
will be responded with a JSON that contains `{success: false, code, error}`, 
according to the specification of the controller method `error()`.

If this header isn't present, then the framework will check if there is a 
template in the `src/views/` named just the same as the error code 
(e.g. `400.html`). If the file exists, then it will be sent as an error page. 
Otherwise, a simple error response will be sent.

### Customize error page

By default, the framework will send a view file according to the error code, 
and only pass the `err: HttpError` object to the template, it may not suitable
for complicated needs. For this reason, the framework allows you to customize 
the error view handler by rewriting the static method 
`HttpController.httpErrorView`, the following example will show you how.

```typescript
// src/bootstrap/http.ts
import { HttpController, date } from "sfn";

HttpController.httpErrorView = function httpErrorView(
    err: Error,
    instance: HttpController
): Promise<string> {
    let vars = {
        err,
        title: err.toString(),
        copyRight: "&copy; " + date("Y") + " My Website.",
        // ...
    };
    return instance.view(err.code.toString(), vars);
}
```

## Common API response

Either in a HttpController or in a WebSocketController, you can always use 
method `succes()` and method `error()` to send a structured response that 
indicates a successful or failed operation.

```typescript
import { HttpController, route } from "sfn";
import { User, NotFoundError } from "modelar";

export default class extends HttpController {

    @route.post("/login")
    async login(req: Request) {
        try {
            let email = req.body.email,
                password = req.body.password,
                user = await User.use(this.db).login({ email, password });

            req.session.uid = user.id;

            return this.success(user);
            // { success: true, code: 200, data: user }
        } catch (err) {
            return this.error(err, err instanceof NotFoundError ? 404 : 500);
            // { success: false, code: 404 | 500, error: err.message }
        }
    }
}
```

## HttpController and service

A controller is actually a service, you can use any features that works in 
[Service](./service) in a controller.