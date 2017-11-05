## Send Your First E-mail from Cool-Node Project

Cool-Node use **Nodemailer** for sending e-mails, you can check out more 
information about it at [nodemailer.com](https://nodemailer.com).

Instead of using original Nodemailer functions, Cool-Node provides a more 
convenient wrapper on it, The `Mail` class. You can use this class to generate
a new e-mail, and send it.

Here is an example, using the Mail in a controller.

```javascript
const HttpController = require("./HttpController");
const Mail = require("cool-node").Mail;

module.exports = class extends HttpController{
    /** e.g. GET /HttpTest/SendEmail/email/example.gmail.com */
    getSendEmail(req){
        //Instanciate a new mail with a subject.
        var mail = new Mail("A test e-mail from my Cool-Node project.");
        mail.to(req.params.email)
            .text("The test content of the text version.")
            .html("<p>The test content of the HTML version.</p>");
        return mail.send().then(info=>{
            console.log(info);
            return "E-mail has been sent.";
        }).catch(err=>{
            console.log(err);
            throw new Error("500 E-mail sent failed.");
        });
    }
}
```

## Methods in Mail Class

Here is a list of all methods of the Mail class, most of them returns the 
current instance for function chaining, except `send()`, which returns a 
Promise:

- `construtor(options?: any)` Create a new Mail instance with specified 
    options or a subject.
- `from(addr: string)` Sets the from address, normally this address is set in 
    `/config.js`.
- `to(...addr: string | any[])` Sets receiver addresses, optionally you can 
    call this method multiple times to concatenate addresses.
- `cc(...addr: string | any[])` Sets receiver addresses on the CC field, 
    optionally you can call this method multiple times to concatenate 
    addresses. 
- `bcc(...addr: string | any[])` Sets receiver addresses on the BCC field, 
    optionally you can call this method multiple times to concatenate 
    addresses. 
- `subject(text: string)` Sets the subject of the e-mail.
- `text(content: string)` Sets the plain text version of the e-mail.
- `html(content: string)` Sets the HTML version of the e-mail.
- `attchment(path: string)` Sets a file as an attachment sent with the e-mail,
    optionally you can call this method multiple times to attach multiple 
    files.
- `send()` Sends the e-mail to all recipients.

You can use some features of the controller, like viewing system to send a
e-mail in a HTML version.

[Next Chapter](CommandLine)