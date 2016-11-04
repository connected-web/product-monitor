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
    console.log('Downloaded', downloads.length, 'files');
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
        accept({
          file,
          url
        });
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
    "hash": "671c86c78c8555605b242aa0c4d6476a"
  },
  "jquery.min.js": {
    "url": "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js",
    "hash": "23d75dbeb1d3cadb1757943f6ca2829b"
  },
  "handlebars.js": {
    "url": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.js",
    "hash": "324b9fff7cc6e3d7fdcbf5d583cedb40"
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
    "hash": "98789b8b729138e352783a4365b156bd"
  },
  "c3.min.js": {
    "url": "https://cdn.rawgit.com/masayuki0812/c3/0.4.10/c3.js",
    "hash": "ea1df44b94ffc0f62440361414ae8ba3"
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
    "hash": "b11f776854b247dc4ad174f4c60c64f0"
  },
  "glyphicons-halflings-regular.svg": {
    "url": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.svg",
    "hash": "6ba40078aa7ebd4861376f85a97500fe"
  }
};

var libPath = __dirname + '/../../monitoring/external';
ensureExists(libPath);
downloadFiles(externalLibraries, libPath).then(() => {
  console.log('Validating libraries');
  return validateFiles(externalLibraries, libPath);
}).catch((ex) => {
  console.error('Unable to validate downloaded libraries', ex, ex.stack);
  process.exit(1);
});

var fontPath = __dirname + '/../../monitoring/fonts';
ensureExists(fontPath);
downloadFiles(fonts, fontPath).then(() => {
  console.log('Validating font files')
  return validateFiles(fonts, fontPath);
}).catch((ex) => {
  console.error('Unable to validate downloaded fonts', ex, ex.stack);
  process.exit(1);
});
