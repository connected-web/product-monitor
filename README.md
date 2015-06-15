Product Monitor
===============

A HTML/JavaScript template for monitoring a product by encouraging product developers to gather all the information about the status of a product. The idea is to provide components to bring live monitoring, statistics, endpoints, and test results all into one place.

Uses a pattern of HTML/JavaScript components which can be created and customised in order to use your own declarative XML tags to create a monitor customised to your project's needs.

What it looks like out of the box
---------------------------------

![Product Monitor Example](images/product-monitor-example.png)

Which amounts to:
```html
<h3>Endpoints</h3>
<status-checker data-url="http://localhost:8080/">Product Monitor</status-checker>
<status-checker data-url="http://stage.mkv25.net/">Stage Environment</status-checker>
<status-checker data-url="http://mkv25.net/">Live Environment</status-checker>
<status-checker data-url="http://mkv25.net/test/a/404">404 Tester</status-checker>
```

### And with a bit of configuration:
```html
<octo-credits data-user="johnbeech" data-repo="product-monitor"></octo-credits>
```
![Product Monitor Example](images/product-monitor-credits.png)

How to get started
------------------

### Instructions to create your own product monitor via NPM

To use the latest release of `product-monitor` from NPM (https://www.npmjs.com/package/product-monitor) you can create your own NodeJS project as follows:

1\. Run `npm init` and enter in your project defaults

2\. Run `npm install product-monitor --save`  

3\. Create your own server.js file:  
```js
var monitor = require('product-monitor');
var server = monitor({
  "serverPort": 8080
});
```
4\. Run your server using the command `node server.js`, you should see the following output:
```sh
[Startup Check] Created user content directory: monitoring

[Startup Step Finished] checkForUserDirectory

[Startup Info] Creating user content directory at monitoring/content

Copying path /content

[Startup Info] Creating user API directory at: monitoring/api

Copying path /api

Copied /content done!

[Startup Step Finished] checkForContentDirectory

Copied /api done!

[Startup Step Finished] checkForApiDirectory

[All Checks Complete]

Product monitor started on http://localhost:8080
```
5\.	Visit http://localhost:8080 to see the monitor in action

6\. Now that your server is running, read the supplied documentation, and try out the examples!

![Product Monitor Example](images/product-monitor-documentation-example.png)

### Instructions to use a checkout from github

1.	Check out (or fork) this project
2.	From the project root, run: `npm install`
3.	Run `node server.js` to start the monitor
4.	Visit http://localhost:8080

**Warning**: you might miss out on the latest updates to the server and its documentation if you check out this project directly from github. The recommended method for setting up a monitor is to use the NPM setup instructions.

Library Credits
---------------
Supplied via CDN:
- [Bootstrap](http://getbootstrap.com/) - basic styling and layout for client-side components
- [jQuery](https://jquery.com/) - for remote calls to server to drive components
- [Node.js](https://nodejs.org/) - for package management and running the server instance
- [Strapdown.js](http://strapdownjs.com/) - for markdown rendering via `<markdown></markdown>` tags
- [web-component](https://github.com/Markavian/web-component) - for enriching the client DOM with web component templates, providing the client-side data-loading and rendering logic for the product monitor.

Supplied via Node Package Manager:
- [Express](http://expressjs.com/) - for defining the server, the api endpoints, and serving up the client
- [md5-node](https://www.npmjs.com/package/md5-node) - for hashing keys in an in-memory cache
- [request](https://www.npmjs.com/package/request) - for making server side requests to remote domains
- [utils-merge](https://www.npmjs.com/package/utils-merge) - for merging configuration together with the default config
- [ncp](https://www.npmjs.com/package/npc) - for copying files used during setup of a new server instance

Compatability
----------------
### Server

| NodeJS on | Support                       |
|-----------|-------------------------------|
| Windows 8 | Excellent                     |
| Mac OSX   | Excellent                     |
| Raspian   | Seems good                    |

### Client

| Browser  | Support                        |
|----------|--------------------------------|
| Chrome   | Excellent                      |
| Chromium | Seems good                     |
| Opera    | Works a treat                  |
| IE11     | Seems alright                  |
| Firefox  | Plays nice                     |

### Support and Feedback

Please get in touch for support and feedback by raising an issue here on this github project.
