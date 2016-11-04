var https = require('https');
var fs = require('fs');
var crypto = require('crypto');

function downloadFiles(files, folder) {
  var downloads = [];
  for (var file in files) {
    var url = files[file].url;
    var destination = folder + '/' + file;
    console.log('Downloading', url, 'to', file);
    downloads.push(download(url, destination));
  }

  return Promise.all(downloads).then((results) => {
    console.log(' Downloaded', downloads.length, 'files OK');
    return results;
  });
}

function validateFiles(files, folder) {
  var checks = [];
  for (var file in files) {
    var url = files[file].url;
    var destination = folder + '/' + file;
    // console.log('Generating hash for', file);
    checks.push(generateHashFor(destination));
  }

  return Promise.all(checks).then((results) => {
    var errors = [];
    Object.keys(files).forEach((file, index) => {
      var item = files[file];
      var destination = folder + '/' + file;
      var generatedHash = results[index];
      if (item.hash !== generatedHash) {
        var error = ['SECURITY WARNING', 'The hash for', item.url, `"${generatedHash}"`,
          'does not match the expected value', `"${item.hash}"`,
          'please review the contents of this file:', destination
        ];
        console.error.apply(null, error);
        errors.push(error);
      }
    });
    if (errors.length > 0) {
      throw errors;
    }
    return results;
  });
}

function download(url, file) {
  return new Promise((accept, reject) => {
    try {
      var stream = fs.createWriteStream(file);
      var request = https.get(url, function (response) {
        response.pipe(stream);
        // console.log('Download of', file, 'complete');
        setTimeout(() => {
          accept({
            file,
            url
          });
        }, 500 + Math.round(1000 * Math.random()));
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

function ensureExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function generateHashFor(file) {
  try {
    var hash = crypto.createHash('md5'),
      stream = fs.createReadStream(file);

    stream.on('data', function (data) {
      hash.update(data, 'utf8')
    })
  } catch (ex) {
    reject(ex);
  }

  return new Promise((accept, reject) => {
    stream.on('end', function () {
      var result = hash.digest('hex');
      accept(result);
    })
  });
}

var externalLibraries = {
  "bootstrap.min.css": {
    "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
    "hash": "eedf9ee80c2faa4e1b9ab9017cdfcb88"
  },
  "jquery.min.js": {
    "url": "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js",
    "hash": "5790ead7ad3ba27397aedfa3d263b867"
  },
  "handlebars.js": {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.js",
    "hash": "e9743e5120f6fd4c24d6f2c8e88d710f"
  },
  "web-component.js": {
    "url": "https://cdn.rawgit.com/Markavian/web-component/1.2.7/lib/web-component.js",
    "hash": "a2fa15b7a3f69e8edf8464dfc5df9bc9"
  },
  "bootstrap.min.js": {
    "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js",
    "hash": "8c237312864d2e4c4f03544cd4f9b195"
  },
  "marked.min.js": {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js",
    "hash": "53688aac51d47f2ff2b99005cdebfd76"
  },
  "github.min.css": {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/styles/github.min.css",
    "hash": "8f06f7e42e9c86cb92edcf8a36b29c0a"
  },
  "highlight.min.js": {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js",
    "hash": "5d64e69ed901fb5f3b5208fc1b0c8f7e"
  },
  "html5shiv.min.js": {
    "url": "https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js",
    "hash": "3044234175ac91f49b03ff999c592b85"
  },
  "respond.min.js": {
    "url": "https://oss.maxcdn.com/respond/1.4.2/respond.min.js",
    "hash": "afc1984a3d17110449dc90cf22de0c27"
  },
  "jquery.sparkline.min.js": {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js",
    "hash": "56be28a1645466dc675d2a204fca015c"
  },
  "d3.min.js": {
    "url": "https://cdn.rawgit.com/mbostock/d3/v3.5.16/d3.min.js",
    "hash": "d1784140c4634b660528c86fac758217"
  },
  "c3.min.js": {
    "url": "https://cdn.rawgit.com/masayuki0812/c3/0.4.10/c3.js",
    "hash": "33b0ad83f13f0d5671e810cfd46c9410"
  },
  "c3.min.css": {
    "url": "https://cdn.rawgit.com/masayuki0812/c3/0.4.10/c3.css",
    "hash": "b19601b600c51dbd6c2df4389871f0d8"
  }
};

var fonts = {
  "glyphicons-halflings-regular.eot": {
    "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.eot",
    "hash": "f4769f9bdb7466be65088239c12046d1"
  },
  "glyphicons-halflings-regular.woff2": {
    "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.woff2",
    "hash": "448c34a56d699c29117adc64c43affeb"
  },
  "glyphicons-halflings-regular.woff": {
    "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.woff",
    "hash": "fa2772327f55d8198301fdb8bcfc8158"
  },
  "glyphicons-halflings-regular.ttf": {
    "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.ttf",
    "hash": "e18bbf611f2a2e43afc071aa2f4e1512"
  },
  "glyphicons-halflings-regular.svg": {
    "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.svg",
    "hash": "89889688147bd7575d6327160d64e760"
  }
};

var libPath = __dirname + '/../../monitoring/external';
ensureExists(libPath);
var step1 = downloadFiles(externalLibraries, libPath).then(() => {
  console.log('Validating libraries');
  return validateFiles(externalLibraries, libPath).then((results) => {
    console.log(' Validated', results.length, 'library files OK');
    return results;
  });
});

var fontPath = __dirname + '/../../monitoring/fonts';
ensureExists(fontPath);
var step2 = downloadFiles(fonts, fontPath).then(() => {
  console.log('Validating font files')
  return validateFiles(fonts, fontPath).then((results) => {
    console.log(' Validated', results.length, 'font files OK');
    return results;
  });
});

Promise.all([step1, step2]).catch((ex) => {
  console.error('Unable to validate downloaded files', ex, ex.stack);
  process.exit(1);
});
