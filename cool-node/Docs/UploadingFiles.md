## Upload Your First File

Version 1.3.2 introduced a new feature, now you can upload files by just 
configuring one or several properties in a HTTP controller, they are:

- `uploadConfig.fields` Fields that carry files.
- `uploadConfig.maxCount` Max number of files that each field can carry, default
    is `1`.
- `uploadConfig.savePath` Where the uploaded files will be stored in, by 
    default, they will be stored in `App/Uploads`.
- `uploadConfig.filter` A function, returns `true` to accept the file, 
    `false` or throw an error to reject.

Please check this example:

```javascript
// App/Controllers/File.js
const HttpController = require("./HttpController");

module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);

        this.uploadConfig.fields = ["file"];
    }

    postUpload(req, res){
        // req.files.file may not be available, but if it is, it will be an 
        // array.
        if(req.files.file && req.files.file.length){
            // Till calling this method, files are already uploaded and 
            // stored.
            
            var file = req.files.file[0];
            console.log(file);
            // The corresponding file info contains:
            // fieldname: which is `file`,
            // originalname: the original filename,
            // encoding: file encoding,
            // mimetype: MIME type of the file,
            // destination: where the file is stored in,
            // filename: the stored filename,
            // path: the full path of stored file,
            // size: file size.

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

You can set a filter function to determine what kind of files can be uploaded 
via this controller.

```javascript
module.exports = class extends HttpController{
    constructor(options, req, res){
        super(options, req, res);

        this.uploadConfig.fields = ["file"];
        
        // Only accept images.
        this.uploadConfig.filter = (file) => {
            // This file only contains fieldname, originalname, encoding and 
            // mimetype.
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

By default, uploaded files will be stored in your app's `Uploads` folder, 
which cannot be accessed on the client side. If you want your uploaded file be
accessed, you have two options:

1. Make a soft link in the app's `Assets` folder to `Uploads`.
2. Redefine the property `uploadConfig.savePath` to change the storage 
    directory, say `App/Assets/uploads`.

In the above article, I used a method `this.logger.log()` in the controller, 
you may wonder what it would do, well, it's introduced since version 1.3.0, 
used to log a message to a disk file, I will show you more details in the next
article.

[Next Chapter](LoggingOperations)