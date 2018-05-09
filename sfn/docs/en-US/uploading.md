# Concept

The `HttpController` provides simple uploading approach that let you upload 
files via an HTTP POST request.

## How to use?

Uploading a file is just easy as you doing other stuffs in a **SFN** 
application, you just need to configure some options, and the rest work will 
be handled by the framework automatically.

In a HttpController, use the decorator `@upload` to set accept fields that may
contain files.

### Example

```typescript
import { HttpController, Request, route, upload } from "sfn";

export default class extends HttpController {

    @route.post("/upload")
    @upload("field1", "field2") // In js: /** @upload field1, field2 */
    upload(req: Request) {
        // The req.files property will carry the uploaded files,
        // each field may carry several files.
        console.log(req.files.field1[0]);
        console.log(req.files.field2[0]);
    }
}
```

### Configure uploading options

```typescript
import { HttpController, Request, Response, route, upload } from "sfn";

export default class extends HttpController {

    constructor(req: Request, res: Response) {
        super(req, res);

        // Set each field to carry no more than 5 files.
        this.uploadConfig.maxCount = 5;

        // Set the uploaded filename (extension exclusive) to be a random 
        // string.
        this.uploadConfig.filename = "random";
    }
}
```

The `uploadConfig` is an `UploadOptions`, which contains these properties:

- `maxCount` Maximum number of files that each form field can carry (default:
     `1`).
- `savePath` A path in the disk that stores the uploaded files (default: 
    `uploads/`), in the directory, files are separated by date.
- `filter` A callback function, returns `true` to accept, `false` to reject.
- `filename` Could be `auto-increment` (by default), `random` or a function 
    returns the filename. `auto-increment` indicates when the filename exists,
    it will be suffixed with a number, e.g. `example.txt` => `example (1).txt`.

### The file state

The file state in the constructor and the route-bound method is different, in 
the constructor, the file is in uploading state, while in the method, it's 
uploaded.

```typescript
import { HttpController, Request, Response, UploadingFile } from "sfn";

export default class extends HttpController {

    constructor(req: Request, res: Response) {
        super(req, res);

        this.uploadConfig.filter = (file: UploadingFile) => {
            // Do not try to access `req.files` in the constructor, it's 
            // undefined because the file is not yet uploaded.
            // ...
        }
    }
}
```