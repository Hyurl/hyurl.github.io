## 迁移到 1.4.0

从这个版本起，服务器将不会再自动启动，你必须要在项目入口文件中通过调用 
`CoolNode.startServer()` 启动服务器。这个版本做出这个改变的原因是，它使你能够在系统
启动之前在任何地方 `require` Cool-Node，比如在控制器中，Cool-Node 导出了很多非常
有用并且强大的工具，将能够使你的应用更加强健。

这是你唯一需要做的工作，如果升级到了 1.4.0 版本，编辑你的如果文件（默认是 
`index.js`），并添加新的一行，内容为：

`CoolNode.startServer();`

这样就可以了，你现在可以像往常一样使用 Cool-Node 来进行软件开发了。

## 从 1.1.x 或 1.0.x 迁移到 1.2.0 版本

出于便利性考虑，Cool-Node 1.2.0 更改了项目的结构，在新版本中，你不再需要复制所有 
`node_modules/cool-node` 中的文件到项目的根目录中，并且你还可以创建自己的入口文件。

因此如果你已经安装了 1.1.x 或者 1.0.x 版本，当更新到新版本时，你还需要做下面这些工作
来使你的项目适合新的要求。


1. 使用命令 `npm update cool-node` 更新并下载新版程序文件;
2. 删除网站项目根目录下的文件夹 `Core`；
3. 编辑项目入口文件 `index.js`，将其内容修改为 
    `const CoolNode = require("cool-node");`；
4. 编辑 `App[.subdomain]/Controllers/HttpController.js`，将其内容修改为
    `module.exports = require("cool-node/Core/Controllers/HttpController");`.
5. 编辑 `App[.subdomain]/Controllers/SocketController.js`，将其内容修改为
    `module.exports = require("cool-node/Core/Controllers/SocketController");`.
6. 编辑 `App[.subdomain]/Modles/Model.js`，将其内容修改为 
    `module.exports = require("modelar/Model");`.
7. 编辑 `App[.subdomain]/Modles/User.js`，将其内容修改为 
    `const _User = require("modelar/User");`.
8. 【可选】复制 `node_modules/cool-node/App-example` 到项目的根目录下。