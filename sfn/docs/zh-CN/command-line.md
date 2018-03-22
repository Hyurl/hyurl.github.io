## 设计目的

为了使编程更迅速，**sfn** 提供了一些控制台命令，你可以在 shell 或者 CMD 中使用它们，
来为你生成需要的文件。它们数量很少，并且容易学习。

## `sfn -c <name> [-c <type>]`

根据给定的名称创建控制器文件。在 **sfn** 应用程序中，我建议你使用 **驼峰法** 来为类
文件命名，并且首字母使用大写。

### 示例

```sh
sfn -c Article
```

这个命令将会创建一个名为 `Article.ts` 的文件并存储在 `src/controllers/` 目录下。

默认地，这个命令会创建一个 HttpController，你可以指定 `-c <type>` 选项来生成不同
类型的地控制器，例如：

```sh
sfn -c ArticleSocket -c websocket
```

这个命令将创建一个 WebSocketController。

## `sfn -m <name>`

根据给定的名称创建一个新的模型。**sfn** 使用 
[Modelar](https://github.com/hyurl/modelar) 作为它的 ORM 系统，因此你应该先去学习
如何使用它。

### 示例

```sh
sfn -m User
```

这个命令将会创建一个名为 `User.ts` 的文件并存储在 `src/models/` 目录下。请注意，
**User** 类在 **sfn** 框架中具有特殊意义，它被框架内部用于自动授权检查，从而能够使你
接受或者拒绝来自客户端的请求。

## `sfn -l <name>`

根据指定的名称创建一个新的语言包。语言包文件命名基于
[RFC 1766](https://www.ietf.org/rfc/rfc1766.txt) 标准。

### 示例

```sh
sfn -l zh-CN
```

这个命令将创建一个名为 `zh-CN.json` 的文件并存储在 `src/locales/` 目录下，如果默认
的语言包使可用的，那么新的语言包将会自动引用它，你所需要做的，就是进行翻译而已。