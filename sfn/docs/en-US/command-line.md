## Purpose

To making programming fast, **SFN** provides some commands, you can use them 
in the shell or CMD, to generate needed files for you. They're few and easy to
learn.

To enable this feature, you need to configure your computer a little bit, so 
that it can support Node.js command line program. All you need to do is 
adding the module directory into the environment variable `PATH`.

### Windows

In you Explorer's location bar, input this path: 
`Control Panel\System and Security\System`, then click **Advanced system** 
**settings** on the left sidebar, in the popup **System Properties** dialog, 
go to **Advanced** tab, click **Environment Variables...** on the bottom, find
and select **Path** in **User variables**, click **Edit** to modify it, add a 
new item of `.\node_modules\.bin` on the top. If **Path** doesn't exist, you 
can manually create a new one or edit the one in **System variables**.

### Linux

Open a terminal, then use the command `vim ~/.bashrc` to edit user 
configuration file, add a new line on the bottom with contents: 
`export PATH="./node_modules/.bin:$PATH"`, save it and use the command 
`source ~/.bashrc` to reload the configuration.

If you're not familiar with `vim`, you can use a visual editor instead.

### Mac OS

Open a terminal, then use the command `vi ~/.bash_profile` to edit user 
configuration file, add a new line on the bottom with contents: 
`export PATH=./node_modules/.bin:$PATH`, save it and use the command 
`source ~/.bash_profile` to reload the configuration.

If you're not familiar with `vi`, you can use a visual editor instead.

## `sfn -c <name> [-c <type>]`

Creates controller file according to the specified name. In a **SFN** 
application, I recommend you name your class file as **CamelCase** style with
a leading upper-cased character.

### Example

```sh
sfn -c Article
```

This command should create a file named `Article.ts` in `src/controllers/` 
directory.

By default, this command will generate a HttpController, you can specify the 
`-c <type>` option to generate different type of controllers, e.g.

```sh
sfn -c ArticleSocket -c websocket
```

This command will create a WebSocketController.

## `sfn -m <name>`

Creates a new model according to the specified name. **SFN** uses 
[Modelar](https://github.com/hyurl/modelar) as its ORM system, so you need to 
learn it as well.

### Example

```sh
sfn -m User
```

This command should create a file named `User.ts` in `src/models/` directory.
Be aware, the **User** class has special meaning in **SFN**, it is internally 
used by the auto-authorization system of the framework, which gives you the 
ability to accept or reject requests from a client.

## `sfn -l <name>`

Creates a language pack according to the specified name. Language packs are 
named according to [RFC 1766](https://www.ietf.org/rfc/rfc1766.txt) standard.

### Example

```sh
sfn -l zh-CN
```

This command should create a file named `zh-CN.json` in `src/locales/` 
directory, if the default language pack is available, the new pack will 
reference to it, and all you need to do is just translation.