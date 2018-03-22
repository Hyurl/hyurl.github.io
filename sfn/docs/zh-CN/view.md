# 基本概念

在一个 **sfn** 应用程序中，视图系统是绑定到 `HttpController` 中的。

# 如何使用？

在一个 HttpController 中，你可以使用方法 `view()` 来展示模板。默认地，框架使用 
[Ejs](https://www.npmjs.com/package/ejs) 作为其模板引擎，我们将会在这份文档的后面
介绍其它引擎。

## 示例

```typescript
import { HttpController, route } from "sfn";

export default class extends HttpController {

    @route.get("/")
    index() {
        return this.view("index"); // the extension name will be .html.
    }

    @route.get("/with-extname")
    withExtname() {
        return this.view("index.ejs");
    }

    @route.get("/with-locals")
    withLocals() {
        // You can use these local variables in the template.
        let locals = {
            title: "My first sfn application.",
            author: "Luna"
        };

        return this.view("index", locals);
    }
}
```

## 模板路径

默认地，模板文件保存在 `src/views/` 目录中，你可以修改成任何路径，只需要设置属性
`viewPath` 为一个不同的值即可。

```typescript
import { HttpController, route, SRC_PATH } from "sfn";

export default class extends HttpController {
    viewPath: SRC_PATH + "/views/my-views/"; // => src/views/my-views/

    // ...
}
```

## 模板引擎

默认地，框架使用 [Ejs](https://www.npmjs.com/package/ejs) 作为其模板引擎，但是你
可以选择其他地引擎，如果你想要这么做。这里列举了几个可用的引擎：

- [sfn-pug-engine](https://github.com/Hyurl/sfn-pug-engine)
- [sfn-nunjucks-engine](https://github.com/Hyurl/sfn-nunjuncks-engine)

你必须自己去学习这些模板引擎，这份文档将不会介绍任何关于它们的细节。

### 使用 pug 引擎的示例

```typescript
// you need install sfn-pug-engine first.
import { HttpController, route } from "sfn";
import { PugEngine } from "sfn-pug-engine";

var engine = new PugEngine();

export default class extends HttpController {
    engine: PugEngine = engine;
    viewExtname = ".pug"; // set the default extension name of view files.

    @route.get("/pug-test")
    index() {
        return this.view("pug-test");
    }
}
```

### 适配你自己的引擎

如果你自己编写了一套模板引擎，或者想要使用那些已经存在但还没有适配到 **sfn** 的模板
引擎，你可以自己进行适配，这并不复杂。

你所需要做的，就是定义一个新的类，来扩展抽象类 `TemplateEngine`，并实现 
`renderFile()` 方法即可，请看这个示例：

```typescript
import { TemplateEngine, TemplateOptions } from "sfn";

export interface MyEngineOptions extends TemplateOptions {
    // TemplateOptions has two properties:
    // `cache: boolean` indicates wheter turn on cache, so your template should
    //     support caches.
    // `encoding: string` uses a specified encoding to load the file.
    // ...
}

export class MyEngine extends TemplateEngine {
    options: MyEngineOptions;

    /**
     * renderFile must accept two parameters, a filename and local variabls 
     * passed to the template, and returns a primise, you can use 
     * AsyncFunction as well.
     */
    renderFile(filename: string, vars: {
        [name: string]: any
    } = {}): Promise<string> {
        // ...
    }
}
```

如果你想要更多的细节，你可以看一下
[sfn-pug-engine](https://github.com/Hyurl/sfn-pug-engine) 和 
[sfn-nunjucks-engine](https://github.com/Hyurl/sfn-nunjuncks-engine)，看它们在
适配器中到底做了什么。