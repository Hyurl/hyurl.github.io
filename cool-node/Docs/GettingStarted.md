## Initiate the Project

To start your Cool-Node project, first, type and run the following command in 
your shell or CMD (assume that you have installed Node.js and NPM already):

```sh
npm init
```

This command will lead you to edit some details about your project, if you are
not familiar with **NPM** but do want to get some knowledge about it, you may 
want to check the documentation at [docs.npmjs.com](https://docs.npmjs.com/).

After initiation, a `package.json` file will be created at you project 
directory, and you have done your first job of website building. Next, let me 
show you how to install Cool-Node in you project.

## Install

To install Cool-Node, type and run the following command in you shell or 
CMD:

```sh
npm install cool-node --save
```

It's just the same as you installing other Node.js modules, but Cool-Node is 
not a normal module, it is not just `require`d as ordinary modules are, in 
fact, it's a top structure that organizes you code files.

**For 1.1.x or 1.0.x (deprecated)**

To use Cool-Node in your project, you have to copy all the files except 
`package.json` from `node_modules/cool-node` to the root directory of the 
project.

**For 1.2.x (deprecated)**

To use Cool-Node in your project, you have to copy `App-example`, `Middleware`
and `config.js` from `node_modules/cool-node` to the root directory of the 
project. You can also copy the entry file `index.js`, but if you don't, you 
must create your own entry file, and make sure it will `require("cool-node")`.

**For 1.3.0 or Higher**

Version 1.3.0 introduced a new feature, when you have installed Cool-Node, the
project will be automatically initiate with the main `App`, you don't need to 
copy any files, all work will be done by the framework itself.

After you've done this, the most important part of installation is done, you 
can keep reading the following sections to learn how to configure the program.

## Configuration

There are some options you may want to configure yourself with your website. 
The `config.js` in the root directory defines some useful settings that the 
whole program requires. Like server listening host and port, database 
information, email, etc., you can change these options to affect all your 
Cool-Node applications.

## You First App

If you've installed version 1.3.0 or higher, please ignore this section.

Cool-Node provides an example app, to start your first app, just rename the 
folder `App-example` to `App`, and that will be fine. You may edit the 
contents under this folder, and see what will happen after restart the server.

## Start the Server

After doing all the stuffs talked above, you can now type and run the 
following command in your shell or CMD to start the Cool-Node server and wait 
for requests.

```sh
node index.js
```

The Cool-Node server contains two parts, a HTTP server and a WebSocket server.
both two servers will be started after running the command. Since *1.2.3*, you
can change this behavior by setting `config.server.socket.autoStart` to 
`false` to disable the WebSocket server, and start it manually whenever you 
want.

You can now visit `http://localhost/` to see what will be presented to you in 
the browser.

## Keep Up To Date

Cool-Node is still growing, more features will be added to new versions, so
keep your program up-to-date is very recommended. You can type the following 
command in you shell or CMD to see what version you're using:

```sh
npm list cool-node
```

And type this command to check the latest version:

```sh
npm view cool-node
```

If you find there is a new version available, use the following command to 
update to the new version.

```sh
npm update cool-node
```

**For Updating to 1.1.x**

Once the new version has been downloaded, you need to copy all its files, 
except `config.js` and `package.json`, to the project root directory from 
`node_modules/cool-node`.

**From 1.1.x to 1.2.x or higher**

Version 1.2.0 has changed some details of the project, please check the 
[Migration Guide](/Docs/MigrationGuide).

Configurations might have been changed in new versions to add more settings, 
so you can also check what has been modified in `config.js`, and add them to 
you own file in the project.

This documentation may also be updated along with new versions, so 
occasionally re-visit this website is also very recommended. 

Isn't that simple? Alright, let's dive into the real depth of building your 
website.

[Next Chapter](Concepts)