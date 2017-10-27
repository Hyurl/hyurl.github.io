## Modelar 的简要介绍

Modelar 是一个富于表现的模型系统，拥有 Promise 功能以及 Query 查询构造器。它提供了
一个非常简便的 API 来操纵数据库记录，因此你可以使用非常少的代码来实现复杂的任务，而只
花费极短的时间。更多关于 Modelar 的细节，请访问 
[modelar.hyurl.com](http://modelar.hyurl.com)。

## 创建一个模型

要创建一个模型，首先，创建一个 JavaScript 文件，放在 `/App/Models/` 目录下。在这份
示例中，我将会创建一个文章模型，并向你展示如何在控制器中使用它。

```javascript
// /App/Models/Article.js
const Model = require("./Model");

class Article extends Model {
    constructor(data = {}) {
        super(data, {
            table: "articles",
            primary: "id",
            fields: [ "id", "title", "content" ],
            searchable: [ "title", "content" ]
        });
    }
}

module.exports = Article;
```

```javascript
// /App/Controllers/Article.js
const HttpController = require("./HttpController");
const Article = require("../Models/Article");

module.exports = class extends HttpController {
    // e.g. GET /Http/Article/id/1
    index(req){
        return this.get(req).then(article => {
            return this.view({
                title: article.title,
                content: article.content
            });
        });
    }

    // POST /Http/Article
    create(req) {
        return Article.use(req.db).insert(req.body);
    }

    // e.g. GET /Http/Article/get/id/1
    get(req) {
        if (!req.params.id) {
            throw new Error("400 Bad Request!");
        }
        return Article.use(req.db).get(req.params.id);
    }

    // e.g. PUT /Http/Article/id/1
    update(req) {
        return this.get(req).then(article => {
            return article.update(req.body);
        });
    }

    // e.g. DELETE /Http/Article/id/1
    delete(req) {
        return this.get(req).then(article => {
            return article.delete();
        });
    }
}
```

是不是非常 Cool 呢？当然是这样。但是，你必须要前往 
[modelar.hyurl.com](http://modelar.hyurl.com) 来学习更多关于 Modelar 
的细节。我向你保证，一旦你熟悉它，你会爱上它。

[下一章](UploadingFiles)