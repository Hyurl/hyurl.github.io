const { App } = require("webium");
const fs = require("fs-extra");
const { endsWith } = require("lodash");

var app = new App();

app.get("/(.*)", async (req, res) => {
    let filename = process.cwd() + req.pathname,
        exists = await fs.pathExists(filename);

    if (exists) {
        let stats = await fs.stat(filename);

        if (stats.isDirectory()) {
            if (!endsWith(filename, "/")) {
                req.urlObj.pathname += "/";
                return res.redirect(req.urlObj.href);
            } else {
                filename += "index.html";

                exists = await fs.pathExists(filename);

                if (exists)
                    return res.sendFile(filename);
            }
        } else if (stats.isFile) {
            return res.sendFile(filename);
        }
    } else if (!endsWith(filename, "/")) {
        filename += ".html";
        exists = await fs.pathExists(filename);

        if (exists)
            return res.sendFile(filename);
    }

    res.status = 404;
    res.send(res.status);
});

app.listen(80, () => {
    console.log("HTTP Server started at http://localhost");
});