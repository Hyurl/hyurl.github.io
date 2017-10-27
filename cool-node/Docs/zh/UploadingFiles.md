## 上传你的第一个文件

1.3.2 版本引入了一个新特性，现在你可以很轻松地上传文件，并且只需要简单地配置一个或
几个 HTTP 控制器的属性，它们包括：

- `uploadConfig.fields` 携带文件的表单字段.
- `uploadConfig.maxCount` 每个字段最多能携带文件的数量，默认是 `1`。
- `uploadConfig.savePath` 上传的文件保存的位置，默认的，它们会被保存到 
    `App/Uploads` 中。
- `uploadConfig.filter` 一个函数，返回 `true` 表示接受文件，`false` 或者抛出错误
    则拒绝。

请查看这个示例：

```javascript
// App/Controllers/File.js
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);

        this.uploadConfig.fields = ["file"];
    }

    postUpload(req, res){
        // req.files.file 可能是不可用的，但如果可用，它将会是一个数组。
        if(req.files.file && req.files.file.length){
            // 到调用这个方法的时候，文件已经上传完成并保存到相应位置了。
            
            var file = req.files.file[0];
            console.log(file);
            // 对应的文件信息包括：
            // fieldname: 这里是 `file`，
            // originalname: 原始文件名，
            // encoding: 文件编码格式，
            // mimetype: 文件的 MIME 类型，
            // destination: 文件保存的目录，
            // filename: 保存的文件名，
            // path: 保存文件的全名，
            // size: 文件体积。

            var tip = `File uploaded with filename '${file.filename}'.`;
            this.logger.log(tip);
            return tip;
        }else{
            return "File upload failed.";
        }
    }
}
```

And on client side:

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
    <form action="/File/Upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" id="file"/>
        <input type="submit" value="Submit">
    </form>
</body>
</html>
```

你可以设置一个过滤器函数来决定什么类型的文件可以通过这个控制器来上传。

```javascript
module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);

        this.uploadConfig.fields = ["file"];
        
        // 只接受图片。
        this.uploadConfig.filter = (file) => {
            // 这个 file 只包含 fieldname, originalname, encoding 和 mimetype。
            if(file.mimetype.indexOf("image/") === 0){
                return true;
            }else{
                throw new Error("400 File type not acceptable.");
            }
        }
    }
    // ...
}
```

默认地，上传的文件将会被保存到你的应用的 `Uploads` 文件夹中，它是不能被客户端直接
访问到的，如果你想要在客户端访问你上传的文件，你有两种选择：

1. 在你的应用中的 `Assets` 文件夹中创建一个指向 `Uploads` 的软链接。
2. 重新定义属性 `uploadConfig.savePath` 以改变存储的文件夹，比如写改为
    `App/Assets/uploads`。

在上面的文章中，我在控制器里使用了一个方法 `this.logger.log()`，你可能回疑惑，它
到底是用来做什么的，嗯，它是在 1.3.0 版本中引入的，用来记录一条信息到一个磁盘文件中，
我将会在下一篇文章里向你介绍更过关于它的细节。

[下一章](LoggingOperations)