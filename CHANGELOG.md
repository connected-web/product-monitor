Product Monitor Changelog
=========================

### Unreleased Changes
* None at present

Release History
---------------

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
* Moved `/api` endpoing to `/docs/api`

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
* Normalised the naming of /api/ endpoints to be instance.render in all cases
* Fixed default zero-time refresh on `<navigation></navigation>` and `<jumbotron></jumbotron>` components

Older releases
--------------
For older history, please see the Github commit history at https://github.com/johnbeech/product-monitor/commits/master
