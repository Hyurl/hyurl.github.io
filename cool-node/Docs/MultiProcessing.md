## Fully Utilize Your Server's Resources

If you server has two or more CPUs, then you can use multi-processing to run 
multiple server instances, they can make the best usage of your computer's 
CPUs resources, there for improving the efficiency of the website.

Starting multi-processing to run the server is very easy. Since version 1.4.0,
Cool-Node core is optimized to suit multi-processing environment. You don't 
need to care about too much inside details, just, in your configuration file, 
modify or add one option:

`config.server.workers`

This option is added in version 1.4.0, so if you just updated from an old 
version, you need to add it yourself. It's `0` by default, meaning doesn't 
start any worker process, just run in single process. To turn on 
multiprocessing, you just need to set it to a number that not more than your 
CPU count. Normally, you could set it to `require("os").cpus().length`, then 
it will be the same amount of your CPU count.

### Multi-Processing Model

The multi-processing model of Cool-Node is designed as **Master to control,** 
**and workers to manage connections.** When run in multiprocessing, the master
will fork several worker processes as set, they all start a server instance, 
to work on different CPUs and handle logics. And the master, which doesn't, as 
a role of host, to manage these workers, when some worker accidentally exits, 
the master will fork a new one immediately, so that to keep the same process 
count.

The master also handles some miscellaneous, like flushing logs. In a single 
process, logs are handle by the current process, but with multiprocessing, if 
several processes read and write a same log file at same time, that will be a 
problem. So in multiprocessing environment, logs are no longer handled by the 
worker, but instead submitted to the master, the master will handle logs. And,
this will reduce the work of a worker, so that it can focus on its jobs, and 
leave other things to the master.

### Communications Between Processes

Multiprocessing is complemented by Node.js  `cluster` module, it allows 
several child processes to listen on a same port, and provides a good way to 
communicate between processes.

Cool-Node wrapped a more easier tool to cluster, the **Channel**, it's 
recommended to use for sending and receiving messages between processes.

To use the Channel, just import it via 
`const { Channel } = require("cool-node");`, it contains these properties and 
methods:

- `Channel.isMaster` Whether the current process is the master.
- `Channel.isWorker` Whether the current process is a worker.
- `Channel.cluster` A reference to `cluster`.
- `Channel.code` Worker code, ordered from `A` to `Z`.
- `Channel.on(event, handler)` Adds an event listener to the specified event.
- `Channel.once(event, handler)` Adds an event listener to the specified event
    that will run only once.
- `Channel.emit(event, ...data)` Sends a massage to the master or to workers,
    if the current process is the master, then the message will be sent to all
    workers; if the current process is a worker, then it will be sent to the 
    master.
- `Channel.emitTo(id, event, ...data)` Sends a message to a specified worker, 
    `id` could be either the worker id or pid (process id) or a worker code.
- `Channel.broadcast(event, ...data)` broadcast a message to all workers, 
    include the current process.

Very similar to Socket.io, isn't it? If you are familiar to Socket.io, then 
they won't be hard for you to use. There is an example:

```javascript
const { Channel } = require("cool-node");

if(Channel.isMaster){
    Channel.on("greeting", (msg, pid)=>{
        // Receiving greeting from workers.
        console.log(msg, pid);
    });
    setTimeout(()=>{
        // This message will be sent to all workers in 2s.
        Channel.emit("greeting", "Hello, everyone, I'm your master %d.", process.pid);
    }, 2000);
}else if(Channel.isWorker){
    Channel.on("greeting", (msg, pid)=>{
        // Receiving greeting from the master.
        console.log(msg, pid);
        // Greeting back to the master.
        Channel.emit("greeting", "Hi, master, I'm your worker %d.", process.pid);
    });
}
```

You see, it's very easy yo communicate between the master and a worker. But 
it's not that simple between workers, though `Channel.emmiTo()` allows one 
worker sending messages to another, but you must provides its worker id or the
pid. But, in a child process, there is no way you can predict such information.

To resolve this problem, Cool-Node binds a code ordered from `A` to `Z` to all
workers, no matter how worker id and pid are assigned, the worker code would 
be the same. Let's say you start 4 workers, then their code would be `A`, `B`,
`C` and `D`. Say `A` accidentally exits, a new worker will replace it, and the
the worker's code will still be `A`.

```javascript
const { Channel } = require("cool-node");

if(Channel.isWorker){
    // Communications between workers must wait until the channel is ready.
    Channel.on("ready", ()=>{
        if(Channel.code === "A"){
            Channel.on("greeting", (msg, code)=>{
                console.log(msg, code);
            });
        }else{
            Channel.emitTo("A", "greeting", "Hi, worker A, I am worker %s.", Channel.code);
        }
    });
}
```

Normally, logics in child processes are the same, so sending messages from one
to another is meaningless. If a worker has some work it won't handle, it 
should leave it to the master. And, if a worker needs to broadcast messages, 
you can call `Channel.broadcast()` to do so. It will send messages to all 
workers, include the current worker, so that you just need to write one piece 
of code, instead writing one in the current process, and another in where 
listens the process messages.

### Avoid Doing These Things with Multi-Processing

**Do not use session engines that relies on memory**. The framework use 
MemoryStorage by default to store sessions in memory, but it's not suitable 
for production environment, and not suitable for multiprocessing. Imaging, 
when you logged in in a process, it store the session in memory, then you 
visit another page, the request is handled by another process, then your 
session will become invalid, I believe you don't want something thing like 
that happens. So, in production environment, **MUST** switch to other storage 
engines, e.g. [connect-redis](https://www.npmjs.com/package/connect-redis). 
You can import it in `config.js`, and configure to the right place.

**Do not use Socket.io adapter that relies on memory**. Cool-Node uses 
Socket.io to handle WebSocket connections, which by default saves clients in 
memory. As talked above, objects saved in memory are not suitable for 
multiprocessing. Say there are two clients, each one connect two processes A 
and B, then they wouldn't know if the other one is online or not, and cannot 
send message to each other. When broadcasting via WebSocket, only the clients 
connected to the current process can receive the message, none of these is our
hope. To solve such a problem, Socket.io officially provides a 
[socket.io-redis](https://www.npmjs.com/package/socket.io-redis) adapter, if 
you want WebSocket with multiprocessing, please check it out.

[Next Chapter](Security)