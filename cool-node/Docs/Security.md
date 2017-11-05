## Turn On CSRF Protection

Since version 1.3.4, CSRF protection is supported by the framework itself, all
you need to do, is just set the property `csrfToken` to `true` in a HTTP 
controller, and on the client side, when you submit a form, send a 
`x-csrf-token` field along with data.

```javascript
// CsrfTokenTest.js
module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);
        // Enable CSRF token checking.
        this.csrfToken = true;
    }

    index(req){
        // When CSRF token checking is enabled, you can call req.csrfToken to 
        // get the auto-generated token, and pass it to a view.
        return this.view({
            crsfToken: req.csrfToken
        });
    }

    create(req){
        // Do some stuffs here...
        return this.success("Resource created.");
    }
}
```

In the view:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- Output the csrfToken as a meta -->
    <meta name="x-csrf-token" content="<%= csrfToken %>">
    <title>Document</title>
</head>
<body>
    <!-- contents -->
</body>
</html>
```

When enabled, the framework will automatically generate tokens and store them 
in the session when a `GET` request fires, and when you start a `DELETE`, 
`PATCH`, `POST` or `PUT` request, you must send a `x-csrf-token` field on the 
client via header, URL parameters, URL query or the request body (priority 
left to right). The framework will check whether the token a client provides 
matches the one on the server or not, if not, then a `403 Forbiden!` error 
will be thrown. There is an example with jQuery:

```javascript
$.ajax({
    url: "/CsrfTokenTest",
    type: "POST",
    data: {},
    headers: {
        "X-CSRF-Token": $('meta[name="x-csrf-token"]').attr("content")
    },
    success: function(res){
        console.log(res);
    }
});
```

CSRF tokens are differed by actions, so you don't need to worry that if you 
open several form pages, the token will be massed.

Since version 1.4.0, the framework provides a function, it could be used to 
inject a CSRF token hidden field into forms of the rendered view 
automatically.

```javascript
const { injectCsrfToken } = require("cool-node").Functions;

module.exports = class extends HttpController{
    // ...
    async index(req){
        var html = await this.view();
        // This function is not very much reliable, so don't break lines when 
        // writing <form> tags.
        return injectCsrfToken(html, req.csrfToken);
    }
    // ...
}
```

## Prevent the Website from XSS Attacks

User input cannot be trust, there for need to protect dangerous contents from
clients. An attacker may submit some spiteful code, if the server output that 
without any filters, when other people visit the page, the injected code will 
run and become an XSS attack. There are some major ways to inject spiteful 
JavaScript code into submitted contents.

1. Submit contents include `<script>` tags.
2. Submit contents include `<a href="javascript:...">` script links.
3. Submit contents include event attributes, like `onload`, `onclick`.

If these contents output to web pages without any filters, that would be a 
very serious danger, their dangers are even more direct and deadly than CSRF.

The framework provides some special tool functions, used to escape illegal 
contents when a user submit data.

1. `escapeTags(html, [tags = "<script><style><iframe><object><embed>"])`
2. `escapeScriptHrefs(html)`
3. `escapeEventAttributes(html)`

These functions assume that all contents may contain HTML tags and attributes,
for specified tags, `escapeTags()` will transfer `<` and `>` to `&lt;` and 
`&gt;`; for script links, `escapeScriptHrefs(html)` will transfer `href` to 
`data-href`; and `escapeEventAttributes()` will transfer event attributes 
like `onload`, `onlcick` to `data-onload` and `data-onclick`. This mechanism 
will guarantee the submitted contents output properly, and prevent unsafe code
from running.

Because not everywhere needs to protect XSS, the framework doesn't use 
auto-escaping mechanism, so you could call these functions wherever you need 
to escape contents. Besides, according to your specific needs, you can do any 
filters you want. You not only can use them to escape `req.body`, but also can
escape URL parameters, it could be helpful with GET requests, e.g. in a search
page. 

```javascript
const {
    escapeTags,
    escapeScriptHrefs,
    escapeEventAttributes
    } = require("cool-node").Functions;

module.exports = class extends HttpController{
    create(req){
        // Assume that there is a content field needs to be escaped.
        var content = req.body.content;
        content = escapeTags(content);
        content = escapeScriptHrefs(content);
        content = escapeEventAttributes(content);
        // ...
    }
}
```

[Next Chapter](Internationalization)