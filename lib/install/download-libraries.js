var http = require('http');
var fs = require('fs');

function downloadFiles(files, folder) {
  ensureExists(folder);
  for (var file in files) {
    var url = files[file];
    var destination = folder + '/' + file;
    console.log('Downloading', url, 'to', file);
    download(url, destination);
  }
}

function download(url, file) {
  var file = fs.createWriteStream(file);
  var request = http.get(url, function (response) {
    response.pipe(file);
  });
}

function ensureExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

var externalLibraries = {
  'bootstrap.min.css': 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',
  'jquery.min.js': 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js',
  'handlebars.js': 'http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.js',
  'web-component.js': 'http://cdn.rawgit.com/Markavian/web-component/1.2.7/lib/web-component.js',
  'bootstrap.min.js': 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js',
  'marked.min.js': 'http://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js',
  'github.min.css': 'http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/styles/github.min.css',
  'highlight.min.js': 'http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js',
  'html5shiv.min.js': 'http://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js',
  'respond.min.js': 'http://oss.maxcdn.com/respond/1.4.2/respond.min.js'
};

var fonts = {
  'glyphicons-halflings-regular.eot': 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.eot',
  'glyphicons-halflings-regular.woff2': 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.woff2',
  'glyphicons-halflings-regular.woff': 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.woff',
  'glyphicons-halflings-regular.ttf': 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.ttf',
  'glyphicons-halflings-regular.svg': 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.svg'
};

var libPath = __dirname + '/../../monitoring/external';
downloadFiles(externalLibraries, libPath);

var fontPath = __dirname + '/../../monitoring/fonts';
downloadFiles(fonts, fontPath);