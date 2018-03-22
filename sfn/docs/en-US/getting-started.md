### Initiate Your Project

Create a directory to store files of your project, then use the command

```sh
npm init
```

to initiate your project, assume you have some knowledge of **npm** and have 
**Node.js** installed.

### Install TypeScript

**sfn** is written in **TypeScript**, which your own files should as well, 
but it's not necessary, we will talk about that later.

```sh
npm i -g typescript
```

If you're not familiar with TypeScript, you may need to learn it first, but 
if you're not going to using it, this procedure is optional.

### Trun On TypeScript Support

To turn on TypeScript support of your project, just add a new file named 
`tsconfig.json` in your project directory, it's contents should be like the 
following:

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es2015",
        "preserveConstEnums": true,
        "rootDir": "src/",
        "outDir": "dist/",
        "newLine": "LF",
        "experimentalDecorators": true,
        "sourceMap": true,
        "importHelpers": false,
        "pretty": true,
        "removeComments": true,
        "lib": [
            "es2015",
            "es2016.array.include"
        ]
    },
    "files": [
        "src/index.ts",
        "src/config.ts"
    ],
    "include": [
        "src/controllers/*.ts",
        "src/controllers/*/*.ts",
        "src/bootstrap/*.ts",
        "src/locales/*.ts",
        "src/models/*.ts"
    ],
    "exclude": [
        "node_modules/*"
    ]
}
```

Just copy this example, and it will be fine for most cases. If `tsconfig.json`
is missing, the framework will run in pure JavaScript mode.

### Install Framework

After you have initiated your project, you can now install **sfn** by using 
this command.

```sh
npm i sfn
```

After all files downloaded, the framework will perform initiating procedure, 
creating needed files and directories for you.

### Start Demo Server

**sfn** provides a demo, so you can now start server and see what will happen.
firstly, compile the source code with the command: `tsc` (for TypeScript only), 
then type the command:

```sh
node dist/index
```

Or `node src/index` in JavaScript.

And the server should be started in no second.