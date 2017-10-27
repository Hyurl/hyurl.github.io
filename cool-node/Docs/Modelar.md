## Brief Introduction of Modelar

Modelar is an expressive Model with Promise functionality and Query 
constructor. It provides a very simple API to manipulate database records, so 
you can use very little code to accomplish sophisticated missions in a very 
short time. For more details, please visit 
[modelar.hyurl.com](http://modelar.hyurl.com).

## Create a Model

To create a model, first, create a JavaScript file in `/App/Models/`. In this
example, I will create an Article model, and show you how to use it in a 
controller.

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

Isn't it cool? Of course it is. But, you have to visit 
[modelar.hyurl.com](http://modelar.hyurl.com) for more details about
Modelar. I assure you, once you are familiar with it, you will love it.

[Next Chapter](UploadingFiles)