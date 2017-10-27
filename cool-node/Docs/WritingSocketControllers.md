## Create a Socket Controller

Cool-Node use **Socket.io** to handle socket communications, you can check out
more information about it at [socket.io](https://socket.io/).

Writing a socket controller is pretty much the same as writing a HTTP 
controller, in fact, both the HttpController and the SocketController are 
subclasses of the basic Controller, so they share some basic properties and 
methods.

Like writing a HTTP controller, firstly, you create a JavaScript file at 
`/App/Controllers/` and name it as `SocketTest.js`, and code its content with 
a class definition like this:

```javascript
const SocketController = require("./SocketController");

module.exports = class extends SocketController{}
```

Very similar to writing a HTTP controller, isn't it? Of course it is. And 
many features that a HTTP controller has can also be used in a socket 
controller. Like returning values will be automatically sent to the client, 
all actions will be handle in a Promise, etc. Even viewing system can also be 
used in socket controllers as well.

But since socket controllers don't have a RESTful API, and don't require a 
request type, when calling from a client socket, you must give the full name 
of a socket controller method.

Oh, by the way, since the socket controller use **Socket.io**, so at the 
client side, you should use socket.io as well. Under the directory 
`/App/Assets/js/`, there is a version of socket.io client, but in case of it 
is out of date, you can copy the newest one at 
`/node_modules/socket.io-client/` and replace it.

The WebSocket server listens to the same port as HTTP server does, so on the 
client side, just connect to the same protocol and the same host:

```javascript
var socket = io("http://localhost");
```

This is a more complete example:

```javascript
const SocketController = require("./SocketController");

module.exports = class extends SocketController{
    /**
     * The socket controller will sent data back to the client with the same 
     * event name which is SocketTest/showHello in this case, so on the client
     * side, you should listen to the same event name as you will send data 
     * through it. This method can be accessed like this:
     * socket.on("SocketTest/showHello", function(data){
     *     console.log(data); //data will be 'Hello, World!'.
     * }).emit("SocketTest/showHello");
     */
    showHello(){
        return "Hello, World!";
    }

    /**
     * All socket controller methods accept two or more parameters:
     * `data` the data sent from the client side.
     * `socket` the corresponding socket object.
     * Other parameters place between `data` and `socket`, how many parameters
     * a method will accept is determined by how many parameters the client 
     * socket.emit() will pass.
     * This method can be accessed like this:
     * socket.on("SocketTest/sayHello", function(data){
     *     console.log(data); //data will be 'Hello, Client!'.
     * }).emit("SocketTest/sayHello", "Hello, Server");
     */
    sayHello(data, socket){
        console.log(data); //data will be 'Hello, Server'.
        return "Hello, Client";
    }
}
```

When the server starts, the framework will look up all available methods in a 
controller, if you don't want some method be accessed by clients, just name 
it beginning with an `_`, such a method will seem as private and will be 
filtered.

If you are not familiar with Socket.io, I suggest you have a look at 
[socket.io](http://socket.io).

## Send Data with a Common Structure

There are two methods in the Controller class (both HTTP and socket), you can 
use them to send successful or failed message to the client.

### controller.success()

*Sends successful action results to the response context.*

**parameters:**

- `data` The data that needs to be send.
- `[code]` A code represented the status of the action.

**return:**

Returns an object which carries these information:
- `success` Indicates if the action is successful, always true.
- `data` The same `data` given above.
- `code` The same `code` given above.

### controller.error()

*Sends failed action results to the response context.*

**parameters:**

- `msg` A message the indicates the failed reason.
- `[code]` A code represented the status of the action.

**return:**

Returns an object which carries these information:
- `success` Indicates if the action is successful, always false.
- `error` The same `msg` given above.
- `code` The same `code` given above.

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

Now we've talked about how to write controllers, next, let me show you how to 
write a view file.

[Next Chapter](DesigningViews)