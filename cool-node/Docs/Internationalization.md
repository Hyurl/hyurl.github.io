## I18n Multi-Language and Locale

Since, version 1.4.0, Cool-Node provides a locale scheme based on i18n, and 
its easy to use.

All language packs are stored in app's `Locales` folder, e.g. `App/Locales`
in the main app. Every language file named as RFC1766 says, e.g. `es-US`, 
`zh-CN`, the file could be js or json.

This is a language pack example (App/Locales/zh-CH.js):

```javascript
module.exports = {
    "How are you?": "你好吗？",
    "I'm fine, thank you!": "我很好，谢谢",
    "My name is %s, what's yours?": "我的名字是 %s，你的呢？",
    "I'm %d, what about you?": "我 %d 岁了，你呢？"
}
```

In this example, we use English as the main language, because the exported 
object uses English words as keys. But its not mandatory, you can use any 
languages and any words to combine key-value pairs. But there is one thins, 
keys in all language packs must be the same, they may not cover all 
translations, but if any presents, you must provide the same key, the system 
matches translations by keys.

You can also set a default language, when a specified language or translation 
doesn't exist, the system will try to load the default language, if no 
translation was found in the default language, then output without and 
translating. A default language usually share the same keys and values, so for
convenience, you can just output an array, like this:

```javascript
module.exports = [
    "How are you?",
    "I'm fine, thank you!",
    "My name is %s, what's yours?",
    "I'm %d, what about you?"
]
```

## Use Translations in a Controller

Have finish writing a language pack, we now have a look at how to use it in
controllers and views. Cool-Node based on the **Controller First** principle, 
so language packs and controllers are bound together, setting of language pack
is also in a controller.

```javascript
module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);
        // Default language is the only option you may set.
        this.defaultLang = "en-US";
    }

    index(req){
        // In a controller, use this.i18n() to load the translation.
        return this.view({
            greeting: this.i18n("How are you?"),
            answer: this.i18n("I'm fine, thank you!"),
            askName: this.i18n("My name is %s, what's yours?", "Ayon"),
            askAge: this.i18n("I'm %d, what about you?", 20)
        });
    }
}
```

The approach of first loading the translations, then pass them to a view is a 
little bit inconvenient, so Cool-Node also provides an alternative way, you 
can use the function `i18n()` in a view directly.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cool-Node View</title>
</head>
<body>
    <p><%= i18n("How are you?") %></p>
    <p><%= i18n("I'm fine, thank you!") %></p>
    <p><%= i18n("My name is %s, what's yours?", "Ayon") %></p>
    <p><%= i18n("I'm %d, what about you?", 20) %></p>
</body>
</html>
```

## How Does a Client Choose the Language

The server side will automatically display the corresponding language 
according to this information (ordered by priority):

1. `req.query.lang`
2. `req.cookies.lang`
3. `req.lang`

in a socket communication, it's:

1. `socket.cookies.lang`
2. `socket.lang`

E.g. the following URL will render views with language *zh-CN*:

```
GET /?lang=zh-CN
```

Also you can use cookie to set the language, so that in the life time of the 
cookie, the whole website will be displayed according to that language:

```javascript
document.cookie.lang = "zh-CN";
```

If no URL parameter is specified and no cookie is set, then the server side 
will automatically determine the language by request header `Accept-Language` 
to render views.

[Next Chapter](Advanced)