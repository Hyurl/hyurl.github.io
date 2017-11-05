## 在你的 Cool-Node 项目中发送第一封邮件

Cool-Node 使用 **Nodemailer** 来发送邮件，你可以在其网站 
[nodemailer.com](https://nodemailer.com) 上查看更多关于它的信息。

与其使用原来的 Nodemailer 方法，Cool-Node 在它的外层提供了一个更为合适的包装器 —— 
`Mail` 类。你可以使用这个类来产生新邮件、然后发送它。

这是一个简单的示例，在控制器中使用邮件功能：

```javascript
const HttpController = require("./HttpController");
const Mail = require("cool-node").Mail;

module.exports = class extends HttpController{
    /** e.g. GET /HttpTest/SendEmail/email/example.gmail.com */
    getSendEmail(req){
        // 使用一个特定的标题来实例化一封邮件。
        var mail = new Mail("一封来自 Cool-Node 项目的电子邮件。");
        mail.to(req.params.email)
            .text("纯文本版本的测试内容。")
            .html("<p>HTML 版本的测试内容。</p>");
        return mail.send().then(info=>{
            console.log(info);
            return "邮件已发送。";
        }).catch(err=>{
            console.log(err);
            throw new Error("500 邮件发送失败。");
        });
    }
}
```

## Mail 类的方法

这里是一份包含所有 Mail 类方法的列表，它们绝大部分都返回当前实例以便能够链式调用，
除了 `send()`，它返回一个 Promise 对象。

- `construtor(options?: any)` 使用特定的标题创建一个新的邮件实例。
- `from(addr: string)` 设置来源地址，通常这个地址在 `/config.js` 中就设置好了。
- `to(...addr: string | any[])` 设置收件人地址，可选地，你可以多次调用该方法来设置
    多个收件人。
- `cc(...addr: string | any[])` 设置抄送人地址，可选地，你可以多次调用该方法来设置
    多个收件人。
- `bcc(...addr: string | any[])` 设置密送人地址，可选地，你可以多次调用该方法来设置
    多个收件人。
- `subject(text: string)` 设置邮件的标题，标题一般在实例化时就设置了。
- `text(content: string)` 设置纯文本版本的邮件内容。
- `html(content: string)` 设置 HTML 版本的邮件内容。
- `attchment(path: string)` 设置邮件的附件，可选地，你可以多次调用该方法来添加多个
    附件。
- `send()` 将邮件发送给所有的收件人。

你也可以使用控制器的一些特性，例如视图系统，来发送 HTML 版本的邮件。

[下一章](CommandLine)