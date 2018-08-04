# Concept

`WebSocketController` manages messages come from a 
[socket.io](https://socket.io/) client.

Since this module uses socket.io, you need to learn it before you can fully 
handle your work.

# How to use?

Like **HttpController**, you create a file in `src/controllers`, this file 
should export a default class that extends `WebSocketController`, and it will 
be auto-loaded when the server starts.

## Example

```typescript
import { WebSocketController, event } from "sfn";

export default class extends WebSocketController {
    @event("/demo")
    index() {
        return "Hello, World!";
    }
}
```

## Relations between the event and method

When a method is decorated with `@event`, this method is bound to a certain 
socket.io event. When a client emits data to this event, the method will be 
automatically called, and the returning value will be sent back to the client 
with proper forms.

### Compatible for JavaScript

If you're programming with pure JavaScript, there is no decorators (not yet). 
But the framework support a compatible way of doing this, by using a **jsdoc**
block with a `@event` tag. You must turn on `enableDocRoute` in `config.js` 
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

## Signature of methods

All methods bound to a unique event in the WebSocketController accept two or 
more parameters:

- `...data: any[]` sent by the client.
- `socket: WebSocket` the underlying socket.

The rest parameter `...data` indicates that there could be more than one 
parameter, see this example:

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
     *      socket.emit("event2", "Hello, World!", "Hi, sfn!");
     */
    @event("event2")
    event2(data1: any, data2: any, socket: WebSocket) {
        return [data1, data2]; // => ['Hello, World!', 'Hi sfn!']
    }
}
```

As you can see, no matter how many `data` parameters are passed, the `socket` 
would be the last one.

### In JavaScript

Since JavaScript doesn't support type assignment, when pass `socket` to the 
method, their type is automatically set to `any`, that means you can't get any
type hints from them, so instead of passing this parameter, you can get it 
from `this` in the method, it should give you hints in some IDEs, e.g. in
**VS Code**.

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

### The constructor

Some times you may want to do something before the actual method is called, 
you want to initiate some configurations before the class is instantiated, you
want to customize the `constructor` of the class. So this is how:

```typescript
import { WebSocketController, WebSocket } from "sfn";

export default class extends WebSocketController {
    constructor(socket: WebSocket) {
        super(socket);
        
        // your stuffs...
    }
}
```

What if I want to do **asynchronous operations in the constructor**? 
JavaScript will not allow you define an `async constructor()`, but don't worry,
**SFN** provides you the way to do it. All you need to do, is just passing the 
second parameter `next` to the `constructor()`, and calling `next(this)` when 
you're ready to call the actual method.

#### Example of reading a file

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

This feature just give you a little trick, apart from that, you can just 
define an `async method()`, and call that method in the event-bound method 
before doing any operations. But in some cases, you have to use the trick, 
because the framework will perform state checking once the controller has been 
instantiated, then decide what to do the next, without the `next` passed, 
those checking will never work.

### One tip of WebSocket

`WebSocekt` is a TypeScript interface, actually there are a lot of interfaces 
(and `type`s) in **SFN**, they are not class, so can't be instantiated, or 
check `instanceof`, if you have any of these code in your application, you 
just got yourself troubles.

```typescript
// This example is wrong and should be avoid.

var obj = new WebSocket;

if (obj instanceof WebSocket) {
    // ...
}
```

Interfaces (and types) are not exported in JavaScript as well, so this code is
also incorrect.

```javascript
const { WebSocket } = require("sfn"); // WebSocket would be undefined.
```

### Throw SocketError in the controller

`SocketError` is a customized error class that safe to use when you're going 
to response a error to the client. when a SocketError is thrown, then 
framework will handle it properly, and sending error response automatically.

`SocketError` is much the same as `HttpError`, so using HTTP error code is 
very common with the SocketError.

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

When a SocketError is thrown, the framework will always send a message that 
contains `{success: false, code, error}` to the client according to the 
specification of the controller method `error()`.

## WebSocketController and service

A controller is actually a service, you can use any features that works in 
[Service](./service) in a controller.