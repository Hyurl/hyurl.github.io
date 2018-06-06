const { App } = require("webium");
const serveStatic = require("serve-static");

var app = new App();

app.use(serveStatic(__dirname, {
    extensions: ["html", "htm"],
    index: ["index.html", "index.htm"]
}));

app.listen(3000, () => {
    console.log("HTTP Server started at http://localhost:3000");
});