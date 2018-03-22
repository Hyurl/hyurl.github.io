## Purpose

To making programming fast, **sfn** provides some commands, you can use them 
in the shell or CMD, to generate needed files for you. They're few and easy to
learn.

## `sfn -c <name> [-c <type>]`

Creates controller file according to the specified name. In a **sfn** 
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

Creates a new model according to the specified name. **sfn** uses 
[Modelar](https://github.com/hyurl/modelar) as its ORM system, so you need to 
learn it as well.

### Example

```sh
sfn -m User
```

This command should create a file named `User.ts` in `src/models/` directory.
Be aware, the **User** class has special meaning in **sfn**, it is internally 
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