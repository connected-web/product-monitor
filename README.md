Product Monitor
===============

A HTML/JavaScript template for monitoring a product by encouraging product developers to gather all the information about the status of a product. The idea is to provide components to bring live monitoring, statistics, endpoints, and test results all into one place.

Uses a pattern of HTML/JavaScript components which can be created and customised in order to use your own declarative XML tags to create a monitor customised to your project's needs.

What it looks like out of the box
---------------------------------

![Product Monitor Example](images/product-monitor-example.png)

How to get started
------------------

### Checkout from github

1.	Check out (or fork) this project
2.	From the project root, run: `npm install`
3.	Run `node server.js` to start the monitor
4.	Visit http://localhost:8080

### Using product monitor via NPM

To use the latest realease of `product-monitor` from NPM (https://www.npmjs.com/package/product-monitor) you can create your own NodeJS project as follows
1. Run `npm init`
2. Run `npm install product-monitor --save`
3. Create your own server.js file:
```js
    var monitor = require('./lib/product-monitor');
    var server = monitor({
      "serverPort": 8080,
      "contentPath": "monitoring/content/"
    }).listen();
```
4.	Create your own `index.content.html` content fragment in `monitoring/content/`
```html
  <h3>Endpoints</h3>
  <status-checker data-url="http://localhost:8080/">Product Monitor</status-checker>
  <status-checker data-url="http://localhost:8080/some/404">404 Example</status-checker>
```
5.	Run `node server.js` to run your monitor server
6.	Visit http://localhost:8080 to see your monitor in action

Library Credits
---------------
Supplied via CDN:
- [Bootstrap](http://getbootstrap.com/) - basic styling and layout for client-side components
- [jQuery](https://jquery.com/) - for remote calls to server to drive components
- [Node.js](https://nodejs.org/) - for package management and running the server instance

Supplied via Node Package Manager:
- [Express](http://expressjs.com/) - for defining the server, the api endpoints, and serving up the client
- [md5-node](https://www.npmjs.com/package/md5-node) - for hashing keys in an in-memory cache
- [request](https://www.npmjs.com/package/request) - for making server side requests to remote domains
- [utils-merge](https://www.npmjs.com/package/utils-merge) - for merging configuration together with the default config
