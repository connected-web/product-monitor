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

### Checkout from github

1.	Check out (or fork) this project
2.	From the project root, run: `npm install`
3.	Run `node server.js` to start the monitor
4.	Visit http://localhost:8080

### Using product monitor via NPM

To use the latest release of `product-monitor` from NPM (https://www.npmjs.com/package/product-monitor) you can create your own NodeJS project as follows  
1\. Run `npm init`  
2\. Run `npm install product-monitor --save`  
3\. Create your own server.js file:  
```js
    var monitor = require('product-monitor');
    var server = monitor({
      "serverPort": 8080,
      "contentPath": "monitoring/content/",
      "statusCacheTimeInSeconds": 60  //optional
    }).listen();
```
4\.	Create your own `index.content.html` content fragment in `monitoring/content/`  
```html
  <h3>Endpoints</h3>
  <status-checker data-url="http://localhost:8080/">Product Monitor</status-checker>
  <status-checker data-url="http://localhost:8080/some/404">404 Example</status-checker>
```
5\.	Run `node server.js` to run your monitor server  
6\.	Visit http://localhost:8080 to see your monitor in action  

Library Credits
---------------
Supplied via CDN:
- [Bootstrap](http://getbootstrap.com/) - basic styling and layout for client-side components
- [jQuery](https://jquery.com/) - for remote calls to server to drive components
- [Node.js](https://nodejs.org/) - for package management and running the server instance
- [Strapdown.js](http://strapdownjs.com/) - for markdown rendering via `<markdown></markdown>` tags

Supplied via Node Package Manager:
- [Express](http://expressjs.com/) - for defining the server, the api endpoints, and serving up the client
- [md5-node](https://www.npmjs.com/package/md5-node) - for hashing keys in an in-memory cache
- [request](https://www.npmjs.com/package/request) - for making server side requests to remote domains
- [utils-merge](https://www.npmjs.com/package/utils-merge) - for merging configuration together with the default config

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
| Opera    | Flakey, but not as bad as IE11 |
| IE11     | Flakey at best                 |
| Firefox  | Plays nice sometimes           |

### Why is client support so bad?

Client support is bad because the order of component rewrites is out of order from the declaration order of the tags. A better, nested, walk-through of the tree should solve this problem, but nested data-loading components may not be desirable in the long run. The simplicity comes from having familiar, easy-to-template, data-driven templates that you can reuse right away.
