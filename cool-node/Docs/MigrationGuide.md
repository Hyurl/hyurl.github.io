## Migrate to 1.4.0

Since this version, the server won't start automatically, you have to call 
`CoolNode.startServer()` in your entry file to launch the server. The reason 
why this version made this change is to allow you `require`ing Cool-Node 
anywhere before the server is started, say in a controller, Cool-Node exposes 
some useful and powerful tools that will make your applications even more 
stronger.

This is the only thing you need to do if you update to 1.4.0, edit your entry 
file (`index.js` by default), add a new line says:

`CoolNode.startServer();`

And that will be fine, you can now enjoin programming with Cool-Node like the 
old times.

## Migrate to 1.2.0 from 1.1.x or 1.0.x.

For convenience reasons, Cool-Node 1.2.0 changed the structure of the project,
in the new version, you don't need to copy all the files from 
`node_modules/cool-node` to the root directory of the website any more, and 
you're able to create your own entry file.

So if you've installed version 1.1.x or 1.0.x, when updating to the new 
version, you have to do some work to make your program fits the new 
requisites.

1. Use the command `npm update cool-node` to update and download new files.
2. Delete the folder `Core` in the root directory of the website.
3. Edit entry file `index.js`, change its contents to 
    `const CoolNode = require("cool-node");`.
4. Edit `App[.subdomain]/Controllers/HttpController.js`, change the contents
    to 
    `module.exports = require("cool-node/Core/Controllers/HttpController");`.
5. Edit `App[.subdomain]/Controllers/SocketController.js`, change the contents
    to 
    `module.exports = require("cool-node/Core/Controllers/SocketController");`.
6. Edit `App[.subdomain]/Modles/Model.js`, change the contents to 
    `module.exports = require("modelar/Model");`.
7. Edit `App[.subdomain]/Modles/User.js`, change the the first line to
    `const _User = require("modelar/User");`.
8. Copy `node_modules/cool-node/App-example` to the root directory of the 
    project.