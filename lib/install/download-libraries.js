var http = require('https');
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
  'bootstrap.min.css': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',
  'jquery.min.js': 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js',
  'handlebars.js': 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.js',
  'web-component.js': 'https://cdn.rawgit.com/Markavian/web-component/1.2.7/lib/web-component.js',
  'bootstrap.min.js': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js',
  'marked.min.js': 'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js',
  'github.min.css': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/styles/github.min.css',
  'highlight.min.js': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js',
  'html5shiv.min.js': 'https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js',
  'respond.min.js': 'https://oss.maxcdn.com/respond/1.4.2/respond.min.js',
  'jquery.sparkline.min.js': 'https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js',
  'd3.min.js': 'https://cdn.rawgit.com/mbostock/d3/v3.5.16/d3.min.js',
  'c3.min.js': 'https://cdn.rawgit.com/masayuki0812/c3/0.4.10/c3.js',
  'c3.min.css': 'https://cdn.rawgit.com/masayuki0812/c3/0.4.10/c3.css'
};

var fonts = {
  'glyphicons-halflings-regular.eot': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.eot',
  'glyphicons-halflings-regular.woff2': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.woff2',
  'glyphicons-halflings-regular.woff': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.woff',
  'glyphicons-halflings-regular.ttf': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.ttf',
  'glyphicons-halflings-regular.svg': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/fonts/glyphicons-halflings-regular.svg'
};

var libPath = __dirname + '/../../monitoring/external';
downloadFiles(externalLibraries, libPath);

var fontPath = __dirname + '/../../monitoring/fonts';
downloadFiles(fonts, fontPath);
