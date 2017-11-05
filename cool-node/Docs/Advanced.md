## Use Coroutine in a Controller

In a controller, there are two styles of using coroutine:

- `async/await` requires your Node.js higher than 7.6.0.
- `*/yield` Available since Cool-Node 1.3.4.

Coroutine is an alternative way of Promise, it makes asynchronous actions 
synchronous-like, with it, you can write you code more readable and efficient.

```javascript
const HttpController = require("./HttpController");
const User = require("modelar/User");

module.exports = class extends HttpController {
    /** e.g. GET /User/id/1 */
    async get(req) {
        if (!req.params.id) {
            throw new Error("400 Bad Request!");
        }
        var user = await User.use(req.db).get(req.params.id);
        // Do other stuffs...
        return user;
    }

    /** For Node.js lower than 7.6 */
    * get(req) {
        if (!req.params.id) {
            throw new Error("400 Bad Request!");
        }
        var user = yield User.use(req.db).get(req.params.id);
        // Do other stuffs...
        return user;
    }
}
```

It's recommended to use `async/await` in Node.js higher than 7.6.0, though 
`*/yield` could also be used.

## Create a Controller that Requires Authentication

From the articles we talked before, you've learned that there are two 
properties `req.user` and `socket.user`, but not knowing what they are used 
for. In this section, I will show you the most important usage that they 
possess.

All controllers (HTTP or socket) have two properties `requireAuth` and 
`authorized`, these properties indicate whether the controller can be access 
directly by a client, or needs to be authorized before calling it.

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    /**
     * Controller's constructor accept a parameter: options, when you 
     * rewrite the constructor, you must define it.
     * The second parameter, judging by the controller type, can be either 
     * `req` or `socket`.
     * 
     * Since version 1.2.5, HttpController accepts a third parameter `res`.
     */
    constructor(options, req, res){
        super(options, req, res);

        //If requireAuth is true, when calling the controller unauthorized, a 
        //401 error will be thrown.
        this.requireAuth = true;

        //You can even set the property authorized to indicate wheter the 
        //operation is permitted, by default, it's:
        this.authorized = req.user !== null;

        //Also, because this is a HTTP controller, you can define a fallbackTo
        //property, when calling the controller unauthorized, instead of 
        //throwing a 401 error, the client will be redirect to the given URL.
        this.fallbackTo = "/Login";
    }
}
```

But, remember this feature only works when the controller is called from the 
client side, if it is called from the server side, it won't work.

Since version 1.3.0, a HttpController's constructor shall at least pass 
`options` and `req`, and all parameters must be required; a SocketController's
constructor shall at least pass `options` and `socket`, also required.

## Asynchronous Actions in Constructor

The constructor of a controller, is designed to do some initial operations, 
and acts like middleware, but constructor cannot be set asynchronous. To 
resolve this problem, Cool-Node 1.3.0, like real middleware, allows you pass 
an additional parameter `next` to the constructor, and use it to accomplish 
calling the real method asynchronously.

```javascript
module.exports = class extends HttpController{
    // Must pass all params ordered, and must be required, no default values.
    constructor(options, req, res, next){
        super(options, req, res);
        // async requires your Node.js higher than 7.6.0, before that, you can
        // use Promise or callback functions instead.
        (async ()=>{
            // Do some asynchronous actions...
            next(this); // Must pass this.
        })();
    }
}
```

This feature can also be used in a cocket controller, in fact, unless 
specified, all features this documentation references can be used in both HTTP
and socket controllers.

In a socket controller, the constructor is defined like this:

```javascript
module.exports = class extends SocketController{
    constructor(options, socket, next){
        super(options, socket);
        // ...
    }
}
```

## Throw and Show Errors to the Client

It's very easy to display an error, like `404 Not Found!`, to the client, just 
throw an Error in the controller method, the framework will automatically 
capture the error and try to display it to the client. Look at this example:

```javascript
// /App/Controllers/HttpTest.js
module.exports = class extends HttpController{
    get404(){
        throw new Error("404 Not Found!");
    }
}
```

And when you visit `http://localhost/HttpTest/404`, an 404 error will be shown
to you. It might not be the error message that you thrown, that depends on 
your views. If you have a `404.html` in `/App/Views/`, then the view file will
be displayed, otherwise, the error message will be shown. This rule applies to
all error types, like 400, 401, 403, 500, etc.

If the error is thrown in a socket controller, then a failed message (e.g.
`{success: false, error: '404 Not Found!', code: 404}`) will be sent to the 
client.

Since version 1.3.4, when a HTTP error is thrown, the framework will pass the 
`error` object to the view of error page, it carries two usable properties: 
`error.message` and `error.stack`. If the client accepts, that means when a 
request header `accept: application/json` is present, the error page won't be 
displayed and no HTTP error will be triggered, instead, the error message will
be packed as json and sent to the client as a Socket controller does. 

## Dealing with XML

Since version 1.0.6, you can handle HTTP requests and responses with a header 
field `Content-Type: application/xml` (or `text/xml`). If this field presents 
in the request, the `req.body` will be automatically parsed to object; If you 
set this field to the response object, the response data will be automatically
transferred to XML.

```javascript
module.exports = class extends HttpController{
    getShowXML(req, res){
        //Send XML to the client, the object will be autoatically transferred
        //to XML.
        res.type("xml");
        return {a: "Hello", b: "World!"};
    }
}
```

## Dealing with JSONP

Since version 1.3.4, JSONP is supported by the framework, **BUT** it's not a 
recommended approach for Cross-Domain request, and it only supports `GET`.

To enable JSONP, you need to set a property `jsonp` to a callback function 
name in a HTTP controller.

```javascript
module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);
        this.jsonp = "callback"; // by default, jQuery uses callback.
    }
}
```

The framework will automatically transfer returning data to jsonp style, you 
don't need to configure any other things on the server.

## Broadcast Message in a HTTP Controller

Version 1.1.0 adds two global variables `wsServer` and `wssServer`, they 
reference to the corresponding WebSocket servers created by *Socket.io*, which
can be used in HTTP controllers to broadcast message through the WebSocket 
channel.

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController {
    postBroadcast(req, res){
        //wsServer or wssServer may be null if the corresponding server is not
        //running.
        if(wsServer){
            wsServer.emit("http-broadcast", req.body);
        }
        if(wssServer){
            wssServer.emit("http-broadcast", req.body);
        }
        return req.body;
    }
}
```

On the client side:

```javascript
socket.on("http-broadcast", function(data){
    console.log("HTTP Broadcast: ", data);
});
```

## Write Your Own Middleware

You can write you own middleware and put them in `/Middleware/` (HTTP ones 
in `http/` and socket ones in `socket/`), like controllers, they will be 
automatically loaded when the server is running.

For your most convenience, all middleware in the Cool-Node project keep all 
abilities to control the *Express* and *Socket.io*.

There are two examples showing you how to write your own middleware.

```javascript
module.exports = function(app){
    // /App/Middleware/http/test.js
    app.use((req, res, next) => {
        // Do stuffs here...
        next();
    });
};
```

```javascript
// /App/Middleware/socket/test.js
module.exports = function(io){
    io.use((socket, next)=>{
        // Do stuffs here...
        next();
    });
};
```

If you're using Node.js 7.6.0+, you can also using `async` functions in 
middleware, like this:

```javascript
// For Express:
app.use(async (req, res, next)=>{
    // Do staffs here...
    await next();
});

// For Socket.io
io.use(async (socket, next)=>{
    // Do staffs here...
    await next();
})
```

Be aware, because middleware files in `Middleware` are loaded automatically, 
the loading order is alphabetic, so if you have multiple files, you'd better 
name them beginning with a number starts from 0.

## Create Multiple Applications in One Project

Yes, that's right, you can build more than one application in just one 
Cool-Node project. And more important is, it's very easy. 

- Before version 1.3.0, you only need to make another copy of the 
    `node_modules/cool-node/App-example`, and name it with the style of 
    `App.subdomain`;
- Since version 1.3.0, you can use command line app generator to produce a new
    app, just type the command like this: `cool-node subdomain`.

And the job is done. The rest work is just the same as you will do with the 
main application in `App`.

Actually, the main application in `App` is also one of the apps in the
project, it reserves the subdomain `www`, which means, if you visit 
`http://www.localhost`, it is just the same as you visit `http://localhost`.
But if you visit `http://a.localhost`, and you don't have a folder in the 
project named `App.a`, a 404 error will be thrown.

This feature is complemented by setting the `host` name in `/config.js`, when 
a client makes a request to the server, the framework will split the 
subdomain out from the setting host. That means, if you have a `App.a` in you 
project, when you visit `http://a.localhost`, the app will run as expected, 
but if you visit `http://a.abc.com` (assume your DNS points abc.com to 
127.0.0.1), the app will never run properly.

Be aware, if you're using Windows as your development environment, you may not
be able to visit `http://a.localhost` on some browsers, In my experience, only
Chrome can access. If you're using other browsers like Firefox, Edge, etc., 
you may need to edit you `hosts` file in `C:\Windows\System32\drivers\etc\`, 
and add a line of contents like this:

```sh
127.0.0.1  a.localhost
```

If you have the same problem on other platforms, also edit the `hosts` file, 
make sure the subdomain points to `127.0.0.1`.

## Run Your Server Forever

`forever` is a simple CLI tool for ensuring that a given script runs 
continuously. The reason why I introduce you it is that Node.js server may 
crash for unknown reasons, using *forever* will guarantee that your server 
will run continuously, that means even if the script crashed, it can be 
auto-restarted.

To install `forever`, just run the following command (don't forget `-g`):

```sh
npm install forever -g
```

After installing, you can run the command `forever start index.js` in your 
Cool-Node project directory to check if you've installed *forever* properly.

*Forever* will ensure that a script can run continuously only if the operating
system is running. If the system has restarted, then all processes hosted by 
*forever* will stop. So we need to make *forever* auto-running after the 
system has rebooted.

If your system is CetOS (other Linux platforms may be the same), edit the file
`/etc/rc.local`, and add a new line to the bottom:

```sh
forever /root/cool-node-website/index.js > /dev/null
```

`/root/cool-node-website/index.js` is your Cool-Node project's entry file,
don't forget to replace it to your specific path. More details about `forever`
is covered at 
[www.npmjs.com/package/forever](https://www.npmjs.com/package/forever).

Now you have gone through all the lessons, you can now write your applications
as free as you want.