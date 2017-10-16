## Create a HTTP Controller

Cool-Node use **Express** to handle HTTP requests, you can check out more 
information about it at [expressjs.com](http://expressjs.com/).

To create a controller, you need to first create a JavaScript file in 
`/App/Controllers/`, in this example, I will create a file named 
`HttpTest.js`. Unlike other frameworks, I won't recommend you to name it like 
~~TestController.js~~, and for convenience, you should always leave the 
*Controller* part away in a Cool-Node project.

This is a simple definition of the HttpTest controller:

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{}
```

At the first line, you need to import the `HttpController`, and this file must
export a class that extends HttpController, you don't need to give it a name, 
just leave it anonymous and it is ok.

This controller doesn't do anything now, the next step I will show you how to 
define methods that are fulfilled with the **auto-routing system**.

## Auto-Routing System

Most frameworks require you to define routes manually, this is good to 
control actions, but sometimes, when your project getting big, this will 
become a very heavy and boring job.

So, the most important feature that Cool-Node provides is, **auto-routing** 
**handler**. When you're writing controllers, you don't have to explicitly 
define routes, the moment you define a controller method, a route will be 
implicitly defined for you, all you have to do is following this directive.

>Define a method in the controller class that its name begins with a 
>lower-case request method.

Isn't it simple? let me show you:

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    /**
     * This method can be accessed through the URL like:
     * http://localhost/HttpTest/ShowHello
     */
    getShowHello(){
        // The returning value will be automatically sent back to the client.
        // In a HTTP controller, If a null or undefined is returned, a 
        // response without body will be sent.
        return "Hello, World!";
    }

    /**
     * All HTTP controller methods accept two parameters:
     * `req` the corresponding request object;
     * `res` the corresponding response object.
     * This method can be accessed through the URL via a POST request:
     * http://localhost/HttpTest/RepeatWhatISaid
     */
    postRepeatWhatISaid(req, res){
        return "You said: " + JSON.stringify(req.body);
    }

    /**
     * You can pass more paths to the URL, anything after the controller and 
     * the action will be treated as request parameters. The following URL 
     * will call the method, and pass parameters `{id: 1, name: 'test'}`.
     * http://localhost/HttpTest/ShowParams/id/1/name/test
     */
    getShowParams(req){
        //If an object is returned, then a json response will be sent to the 
        //client.
        return req.params; //{id: 1, name: 'test'}
    }

    /**
     * You can also return a Promise, actually, all controller methods, when 
     * called by a client request, are handled in a Promise, so you can do 
     * whatever you want in the method.
     */
    getShowPromisedData(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                //This message will be sent after 1 second timeout.
                resolve("Hello, World!");
            }, 1000);
        });
    }
}
```

Now you've already learn the most important part of the HttpController, but, 
this is more, let's continue on.

## Showing Index Page and RESTful API

There are some methods you don't need to explicitly give their request type, 
they are pre-defined to accept particular request types.

- `index()` Listening GET, showing the index page of the controller.
- `get()` Listening GET, fulfilling RESTful API.
- `create()` Listening POST, fulfilling RESTful API.
- `update()` Listening PATCH, fulfilling RESTful API.
- `deleet()` Listening DELETE, fulfilling RESTful API.

When calling these methods, you don't need to explicitly give the method name 
in the URL, just the controller name is OK, the framework will automatically 
match them by detecting the request type.

But, if you both have a `index()` and a `get()` in the controller, if no 
method name is present in the URL, only the index() will be called. In such a 
case, you need to explicitly point out the method name.

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    /** GET http://localhost/HttpTest */
    index(){}

    /** 
     * GET http://localhost/HttpTest if index() is not difined, otherwise, use
     * GET http://localhost/HttpTest/get
     */
    get(){}

    /** POST http://localhost/HttpTest */
    create(){}

    /** PATCH http://localhost/HttpTest */
    update(){}

    /** DELETE http://localhost/HttpTest */
    delete(){}
}
```

You can change the RESTful map by reassigning the `controller.RESTfulMap` 
property, even add more methods. **Since version 1.2.4, this property is set**
**by a setter, so you must define a new setter if you want to rewrite it.**

Ok, now you have acrossed most of the features that a controller have, let's 
see how to display a view file (A.K.A template) to the client.

## The Viewing System

To display a view file, just call `controller.view()`, it accept two optional
arguments:

- `tplName` The template name. Template files are stored in `App/Views/`, if 
    the filename ends with a `.html` as its extension name, you can pass this
    argument without one. If this argument is missing, then the 
    `defaultView` will be used.
- `vars` Additional variables passed to the template, these variables will 
    be evaluate in the template.

This method returns a **Promise**, and the only argument passed to the 
callback of `then()` is the returning contents of the template.

The reason why `tplName` is optional is because the framework will 
automatically set a default view when the method is called by a client 
request. let me show yo how it works:

```javascript
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    index(){
        //This operation will send the template /App/Views/HttpTest/index.html
        //to the client.
        return this.view();
    }

    getShowOther(){
        //This operation will send the template 
        // /App/Views/HttpTest/ShowOther.html to the client, and pass the 
        //variable `title` to it.
        return this.view({title: "Cool-Node"});
    }

    getShowAnother(){
        //You can explicitly give the template name if the template does not
        //match the method name.
        return this.view("HttpTest/show-another");
    }
}
```

There is another method `controller.viewMarkdown()`, it is used to display a
markdown file (which extension name is `.md`) and parse it to HTML. It acts 
almost the same as `controller.view()`, except it only accept the argument 
`tplName`.

More details will be covered at the article [Designing Views](DesigningViews),
Now let's move to the next step, learning how to write a socket controller.