## Project Structure

A typical Cool-Node project has a structure like this:

<pre style="background: #ddd;padding: 10px;color: #333;font-size: 14px;">
/ --------------------- Indicates the root directory of the project.
|-- App/ -------------- Contains files of an App.
|   |-- Assets/ ------- Contains files which can be directly accessed from 
|   |                   clients, like css, js, etc.
|   |-- Controllers/ -- Contains all controller files.
|   |   |-- Home.js --- A controller that listens to the root path of the URL.
|   |
|   |-- Models/ ------- Contains all model files.
|   |-- Views/ -------- Contains all view files.
|
|-- Middleware/ -------- Contains all middleware files.
|   |-- http/ ---------- A folder contains HTTP middleware files.
|   |-- socket/ -------- A folder contains socket middleware files.
|
|-- node_modules/ ------ All node modules are stored here.
|
|-- config.js ---------- Configurations of the project.
|-- index.js ----------- Entry file of the program.
|-- package.json ------- A file manages the project and dependencies.
</pre>

## Reserved Properties

In a Cool-Node project, there are several properties reserved, you can use 
them, but **BE CAREFUL** when you're trying to reassign them.

- `global.ROOT` A path string indicates the project root directory.
- `global.config` Configurations of the project.
- `global.wsServer` WebSocket server listens `ws` protocol. *(Since 1.1.0)*
- `global.wssServer` WebSocket server listens `wss` protocol. *(Since 1.1.0)*
- `req.session` The session of the current request.
- `req.subdomain` The subdomain of the current request.
- `req.db` A database instance from the Modelar ORM.
- `req.files` An object that carries uploaded files information. 
    *(Since 1.3.1)*
- `socket.session` The session of the current socket.
- `socket.subdomain` The subdomain of the current socket.
- `socket.db` A database instance from the Modelar ORM.
- `socket.protocol` Either `ws` or `wss`. *(Since 1.2.5)*
- `socket.hostname` The hostname derived from the handshake `Host` header. 
    *(Since 1.2.5)*
- `socket.ip` The client IP. *(Since 1.2.5)*
- `socket.ips` An array including client IP and proxy IPs, if any. 
    *(Since 1.2.5)*
- `socket.secure` Whether the handshake is secure or not (secure when using 
    `wss` protocol). *(Since 1.2.5)*

You can see other `req` properties in the Node.js API documentation at 
[nodejs.org](https://nodejs.org) and the Express API documentation at 
[expressjs.com](http://expressjs.com/), and other `socket` properties in 
Socket.io API documentation at [socket.io](https://socket.io/).

Also, there are some reserved properties in the project, they will mean 
something if you assign values to them.

- `req.session.UID` The authorized user ID of the current request.
- `req.user` The authorized user of the current request. If you have assigned 
    **req.session.UID**, this property will be automatically assigned.
- `socket.session.UID` The authorized user ID of the current socket peer.
- `socket.user` The authorized user of the current socket peer. If you have 
    assigned **socket.session.UID**, this property will be automatically 
    assigned.

### More Details about Sessions and Database Connections

Since Cool-Node is a cross-protocol program, the session in a HTTP request is 
actually the session in a corresponding socket. So when you assigning a 
property to the session object, whether from HTTP or socket, the other one 
will also be affected. Meaning, when you logged-in from a HTTP request, the 
socket will be logged-in as well, and vise versa.

And since `req.user` is only available in the current request, you should 
always assign `req.session.UID` instead, if you are using session to recognize 
the user. But if you are using other techniques like access token, then you 
should assign `req.user` and `socket.user` in a middleware instead.

Another tip for sessions, By default, Cool-Node stores sessions in memory, in 
production environment, it may not be ideal, so, you should set another 
storage engine in `config.js` manually, e.g. `connect-redis`.

Don't worry that when you call `req.db` or `socket.db`, a new database 
connection will be created, it won't. Modelar ORM handle database connections 
very efficient, connections won't be established until you explicitly calling
`db.connect()` of implicitly created by executing a query.

Since version 1.1.0, `req.db` and `socket.db` can be reassigned or 
pre-defined, if you don't assign a value to them, then a default value will
be used when accessing them.

Also, all connections will be recycled to a internal pool and wait for the 
next time acquiring after a HTTP response or a socket message is sent.

[Next Chapter](WritingHttpControllers)