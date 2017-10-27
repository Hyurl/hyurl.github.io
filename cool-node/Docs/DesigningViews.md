## Create a View

Cool-Node use **EJS** as its view system, you can check out more information 
about it at 
[https://www.npmjs.com/package/ejs](https://www.npmjs.com/package/ejs).

Here I will just give you a hint about how to use it in Cool-Node, after 
learning the articles about controllers, I guess you would already figure out 
how.

In this article, I will create a HTTP controller `HttpTest` as before to 
demonstrate the relations between a controller and a view. 

First, create a folder in `/App/Views/`, named `HttpTest`, then create a HTML 
file named `index.html` under it, the path would be 
`/App/Views/HttpTest/index.html`. This view corresponds to the method 
`index()` in the controller.

In JavaScript (`/App/Controllers/HttpTest.js`):

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    index(){
        return this.view({
            title: "Cool-Node Test",
            content: "Hello, World!"
        });
    }
}
```

And in the HTML (`/App/Views/HttpTest/index.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%=title%></title>
</head>
<body>
    <h1><%-content%></h1>
</body>
```

Done! Isn't it simple? Now restart the Cool-Node server and visit 
`http://localhost/HttpTest/` to check it out.

EJS has many features that let you evaluate code in a HTML file like PHP, JSP 
and ASP does. Do forget to check its documentation at 
[https://www.npmjs.com/package/ejs](https://www.npmjs.com/package/ejs) if you 
want to learn it well.

Also, you could use `controller.viewMarkdown()` to display a markdown file, 
the content will be automatically parsed to HTML. By the way it use 
`highlightjs` to prettify codes, so you have to load the theme file manually, 
all supported themes are stored in `/node_modules/highlightjs/styles/`, just 
copy the one you want to use to `/App/Assets/`, and load it from the HTML.

Until now, we've gone through all the basic lessons of Cool-Node, now let's 
have a look at the database level programing, meet the **Modelar** ORM.

[Next Chapter](Modelar)