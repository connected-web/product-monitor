Product Monitor Changelog
=========================

### Unreleased Changes
* None at present

Release History
---------------
### Release 2.0.4
* Added content preview to `/docs/status-details` page
* Added correct product title to default `index.html` page template

### Release 2.0.3
* Exposed `page-template.html` as an editable file copied to the `user-content` folder

### Release 2.0.2
* Changed `instance` to `endpoint` in API files, documentation, and examples
* Moved API files into folders to match their virtual path
* Added descriptions to each built-in API endpoint
* Replaced double quotes with single quotes in multiple files

### Release 2.0.1
* Created `/api/monitor/routes` endpoint
* Moved `/docs/api` to `/docs/express-routes`
* Created new `/docs/api` page, sorted by user content, followed by built-in content
* Updated `/api/navigation` endpoint to reflect the above changes

### Release 2.0.0
* Cleaned up server start up messages to be more readable
* Changed default colours on `management console`
* Removed Local Repository Status `/docs/repo-status` endpoint
* Removed `/api/repo/status` endpoint
* Removed `/api/repo/pull/status` endpoint
* Removed `/api/repo/pull/confirm/:confirmationHash` endpoint

### Release 1.9.1
4th December 2015
* Updated `web-component.js` to 1.2.7
* Added local caching of external assets at `npm install` time

### Release 1.9.0
19th November 2015
* Disabled `npmStatus` check on start up
* Created images folder hosted out of the `userContentPath` directory
* Moved `favicon.ico` to be hosted out of the images folder

### Release 1.8.36
22nd August 2015
* Fixed inconsistent colour codes on `/docs/status-details` page

### Release 1.8.35
20th August 2015
* Changed `/api/statusOf` endpoint to support regex matching, backwards compatible to indexOf check

### Release 1.8.34
19th August 2015
* Changed `<status-button>` component content-type check to match on partial string

### Release 1.8.33
6th August 2015
* Accessibility: spark graph colour differentiation on `<status-button>`

### Release 1.8.32
6th August 2015
* Fix for syntax error in `<status-checker>` and `<status-button>`

### Release 1.8.31
4th August 2015
* Fix for `<status-checker>` to handle 200 error states correctly

### Release 1.8.30
4th August 2015
* Updated `<status-button>` component to support content-type checking

### Release 1.8.29
3rd August 2015
* Removed error message from `<status-button>` component to keep size consistent

### Release 1.8.28
3rd August 2015
* Fix for server breaking bug on `/api/statusOf` endpoint when no body is returned

### Release 1.8.27
2nd August 2015
* Added wiki-style Edit button to user content pages
* Added GET `/api/content/read/:contentPath` endpoint to read content as JSON
* Added POST `/api/content/save/:contentPath` endpoint to save content
* Fix for missing `.records` error on `<status-button>` component

### Release 1.8.26
26th July 2015
* Added sparkline bar chart to status button

### Release 1.8.25
26th July 2015
* Improved info and layout of status details page

### Release 1.8.24
26th July 2015
* Added status details page with record of last 10 results

### Release 1.8.23
25th July 2015
* Added `npmUpdate.disableUpdates` config property
* Allowed npm updates to be disabled by this property (i.e. disabling this feature on the `Software Updates` page)

### Release 1.8.22
25th July 2015
* Added recursive directory scanning of /api/ folders to support better structuring of features
* Implemented against `git pull` and `npm install` using the `/api/repo/pull/status` and `/api/repo/pull` endpoints
* Visit `/docs/repo-status` in your monitor for interactive details

### Release 1.8.21
22nd July 2015
* Added `repoStatus` page to reflect any differences between the local `git` repository and its remote, and any untracked changes.

### Release 1.8.20
22nd July 2015
* Fix for badly handled npmStatus error on systems running `npm <2.0.0` that don't support the `--json` flag

### Release 1.8.19
21st July 2015
* Added npm and nodejs version information to Software Updates page
* Hid non-current package information from Software Updates page when no updates are required

### Release 1.8.18
20th July 2015
* Fix for default binding on a service to be 0.0.0.0 instead of localhost

### Release 1.8.17
19th July 2015
* Improved display of Package Status, differentiating top level `product-monitor` packages from other libraries, and highlighting libraries that will actually be updated

### Release 1.8.16
19th July 2015
* Implemented restart (kill server) POST endpoint `/api/restart` with validation
* Added restart button to Monitor Status page which triggers a process kill on the server
* Created `/api/postMirror` to help test POST requests against server
* Created `<post-button post-url="/api/target" result-target="element-id"></post-button>` to auto-wire a button click to a POST operation and return the result to a HTML element
* Added `npm start` and `npm test` commands to package.json
* This release is primarily to test the `Update Server` button on Software Updates page in an external project

### Release 1.8.14
16th July 2015
* Added `<icon>type</icon>` component based on Bootstrap glyphicon support
* Significant cache improvements around `/api/npmStatus` endpoint
* Moved Package Status from Management Console to new Software Updates page
* Exposed the `apicache` object on the server config object for API modules to interact with

### Release 1.8.13
15th July 2015
* Added working support for the `/api/npmStatus` endpoint to report on out-of-date packages on the Management Console page

### Release 1.8.12
13th July 2015
* Added support for method parameter on the `/api/statusOf` endpoint, e.g. `/api/statusOf?method=post&url=http://my-website/api/submit`
* Added support for data-method parameter on the `<status-checker></status-checker>` component, e.g. `<status-checker data-method="put" data-url="http://my-website/api/submit">POST to My Website</status-checker>`

### Release 1.8.11
13th July 2015
* Added additional information to `<status-checker></status-checker>` component based on new information on the `/api/statusOf` endpoint

### Release 1.8.10
13th July 2015
* Added differing glyph icons to `<status-button></status-button>` component based on response
* Added additional error and message information to `/api/statusOf` end point
* Added header information to status button to `/api/statusOf` end point

### Release 1.8.9
12th July 2015
* Fix for / Index link in navigation
* Fixed links to github in octo-credits tags

### Release 1.8.8
11th July 2015
* Added /api/serverLog endpoint which captures any `console.log(...)` activity and exposes it to the client as JSON
* Added support for multiple routes per API file using an array property on `endpoint.routes`, e.g. to allow: `endpoint.routes = ['/api/pathOne', '/api/pathOne/:withVariable'];`
* Added support for registering a method verb on API files using a string property on `endpoint.method`, e.g. to allow `endpoint.method = 'post';` or `endpoint.method = 'put';`. Maps through to `express js` verbs.
* Upgraded to Web Component JS 1.2.5

### Release 1.8.7
7th July 2015
* Set timeout on statusOf calls to 250ms to prevent bad or inaccessible network addresses fouling up the request queue.
* Added `data-contains` property to the `status-checker` and `status-button` components to allow content to be checked for within the body od the `data-url` response.

### Release 1.8.6
26th June 2015
* Upgraded web-component.js to version 1.1.3
* Fixed deprecation warnings caused by web-component.js version 1.1.3
* Added styling for code blocks using Highlight.js

### Release 1.8.2
22nd June 2015
* Reintroduced the Jumbotron component `<jumbotron>Super-sized content goes here</jumbotron>`
* Styled the jumbotron correctly by shifting content around within the page.
* Updated the out-of-the-box help and advice in `index.content.html`

### Release 1.8.1
22nd June 2015
* [Breaking Change] Changed default `userContentPath` from `monitoring` to `user-content`
* This will mis-configure a server if the server is using the default path
* To fix add the `userContentPath` config option when starting your server, or rename your user content directory, e.g:
  ```js
  var optionalServerConfig = {
    "productInformation": {
      "title": "Example Monitor"
    },
    "userContentPath": "user-content"
  };
  server = monitor(optionalServerConfig);
  ```

### Release 1.7.2
18th June 2015
* Fix for render state of Status Checker and Status Button when server goes offline.

### Release 1.7.1
18th June 2015
* Added apicache as middleware to all registered API endpoints
* Default caching is set to `1 hour` for all registered `/api/` routes
* Added optional `endpoint.cacheDuration` property that can be set cacheDuration for individual endpoints in the form `[length] [unit]`, e.g. `30 seconds`, `10 minutes`, `1 hour`, `1 day`, etc.
* Fixed broken documentation link in `index.content.html` when starting a new project.
* **Removed** config property `statusCacheTimeInSeconds` in favour of `apicache` config:
    ```js
    "apiCache": {
      debug: false,
      enabled: true,
      defaultDuration: 3600000 // in ms, 3600 seconds, 1 hour
   }
   ```

### Release 1.7.0
17th June 2015
* Upgraded `web-component.js` from 1.0.1 to 1.1.1 to fix memory leak issue with nested data-loading components.
* Upgraded templates to use `for` attribute instead of `tagName` attribute to comply with deprecation warning in `web-component.js`

### Release 1.6.9
16th June 2015
* Added error catching block in `<octo-credits></octo-credits>` template
* Improved styling of `<octo-credits></octo-credits>` for small screens
* Fix for Issue #14, helping the `/api/statusOf` endpoint to query the local server

### Release 1.6.8
15th June 2015
* Created the changelog
* Updated `package.json` to use latest version of `octo-credits`
* Added `deletions` and `additions` badges to `<octo-credits></octo-credits>` component

### Release 1.6.7
15th June 2015
* Added `<product-title></product-title>` component to set product title in Navigation
* Added `{{product-title}}` tag to `page-template.html` to set `<title>Page Title</title>` in HTML head
* Added new server configuration option:
```js
{
  productInformation: {
    title: "Product Title Goes Here"
  }
}
```

### Release 1.6.6
14th June 2015
* Renamed `mainController` to `pageController`
* Added `Markavian/web-component` project to credits page
* Added `docs/package-info` route to render `api/packageInfo` data

### Release 1.6.2
14th June 2015
* Added the `docs/custom-api-endpoing-guide` to help document the server
* Massively improved the quality of the starting content available when starting a new server
* Moved `/api` endpoint to `/docs/api`

### Release 1.6.0
14th June 2015
* Updated `product-credits.content` template with more instructions
* Added `firstTimeInstall` script to set up `/api` and `/content` directories for a new server
* Added `test/scripts/install-local-npm-for-example-monitor.js` to simulate a local install of product-monitor via NPM

### Release 1.5.0
14th June 2015
* Added auto-scanning of API files - for both Server API modules, and custom User APIs.
* Changed license for `test/example-monitor` project from None to ISC
* Fixed the `lazyLoad` module
* Big refactor, moving files around to allow `/documentation` and `/content` endpoints to exist neatly together
* Removed conflict on `/credits` endpoint by renaming the example file
* Removed the `<jumbotron></jumbotron>` component
* Restyled the `<status-checker></status-checker>` component
* Switched local version of `web-component.js` for the publically available `https://cdn.rawgit.com/Markavian/web-component/1.0.1/lib/web-component.js`
* Created a new server `/status` endpoint, linked to from the `<monitor-status></monitor-status>` component
* Refactored `mainController.js` to generate other kinds of pages
* Added the `/api/expressRoutes` endpoint
* Added the `/api` endpoint to render the `/api/expressRoutes` data, and self-monitor the server
* Fixed issue if github secret key for `octo-credits` is unavailable by default
* Fixed the simple component example in the Component Showcase, which were using a deprecated method for templating

### Release 1.4.1
11th June 2015
* Added default config for `octo-credits`
* Removed `console.log` calls and deprecated functions from components.js
* Added support for dynamic navigation rendered using data from the `/api/navigation` endpoint
* Made all of the things work in `component.js`:
  * Added auto-scanning of document for components and component templates
  * Made the custom-on-the-fly templates and components work.
  * Replaced `expandTemplate` implementation with `Handlebars` library
* Recast all `<script></script>` template fragments as `<template></template>` fragments
* Added a credits page to render data from `/api/octo-credits` endpoint
* Fixed module paths for `component.js` when ran from the example project
* Removed the `<product-monitor><product-monitor>` component, was a bad way to inject header tags
* Restored `lib/moitor/componentMerger.js` as a way to inject components into the page template
* Added glyph icons to the `<status-button></status-button>` examples
* Added `favicon.ico` served up via express
* Added in Data Aware Custom Components using `data-source-url` and `data-source-template` attributes
* Restricted access to < 200 status codes on the `/api/generateStatusCode` endpoint
* Created the `<status-button></status-button>` component as a clone of the `<status-checker></status-checker>` component
* Returned a well formatted error message for DNS lookup failiures on the `/api/statusOf` endpoint
* Added the `/api/generateStatusCode` endpoint
* Added the `/api/navigation` endpoint, which scans the content directory at server startup

### Release 1.2.0
5th June 2015
* Upgraded the `<monitor-status></monitor-status>` component to track when its own hash becomes out of sync with the server, and trigger an automatic restart of the client
* Added rendering and templating to `component.js` based on properties
* Changed template style from `${var}` to `{{var}}`
* Moved `<navigation></navigation>` component into page template
* Created `/api/monitorStatus` endpoint
* Normalised the naming of /api/ endpoints to be `endpoint.render` in all cases
* Fixed default zero-time refresh on `<navigation></navigation>` and `<jumbotron></jumbotron>` components

Older releases
--------------
For older history, please see the Github commit history at https://github.com/johnbeech/product-monitor/commits/master
