# Concept

Session is enabled by default in **sfn** framework, and shared between HTTP 
and WebSocket. the framework uses 
[express-session](https://www.npmjs.com/package/express-session) to back 
session support, and uses 
[session-file-store](https://www.npmjs.com/package/session-file-store) as the 
default storage engine.

## Configuration

You can modify `config.ts` to set property configurations for your own session
needs, the following is what the framework does.

```typescript
import * as Session from "express-session";
import * as FileStore from "session-file-store";

let Store = <any>FileStore(Session);

export var config: SFNConfig = {
    // ... 
    session: {
        secret: "sfn",
        name: "sfn-sid",
        resave: true,
        saveUninitialized: true,
        secure: true,
        unset: "destroy",
        store: new Store()
    },
    // ...
}
```

Also, you can change to other available storage engine if you want to.

## Share state between HTTP and WebSocket

This feature is very important in **sfn** framework, session sharing allows 
you changing the state in one end and affecting the other without doing 
repeating work, it guarantees that once you logged in from a HTTP request, 
and you WebSocket will be in as well (and vice versa).

## How to use?

The `session` property is bound to the `req` and `socket` object in a 
controller (and in the middleware of **webium** and **socket.io**), it's very 
the same that [express-session](https://www.npmjs.com/package/express-session)
told you, you must have a look at this module if you're not familiar with 
it.

In the HTTP end, the session will be automatically saved when the response 
channel is closed, but in the WebSocket end, for efficiency concerns, the 
framework won't save the the session automatically, you must do it yourself, 
just like this:

```typescript
import { WebSocketController, WebSocket, event } from "sfn";

export default class extends WebSocketController {
    @event("/example")
    index(socket: WebSocket) {
        socket.session.data = "something";
        socket.session.save(() => null);
        return "anything";
    }
}
```