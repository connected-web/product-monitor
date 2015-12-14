var endpoint = function () {}

endpoint.route = '/api/generateStatusCode';
endpoint.description = 'Generates a status code. To use: pass ?statusCode=418 to this endpoint.';

endpoint.configure = function (config) {}

endpoint.render = function (req, res) {
  var statusCode = req.query.statusCode || 0;
  var statusMessage = knownStatusCodes[statusCode] || 'Unrecognised status code';

  var response = {
    statusCode: statusCode,
    message: statusMessage
  };

  if (statusCode >= 200) {
    res.status(statusCode).jsonp(response);
  } else {
    response.additionalInformation = 'Status codes below 200 will generate 200 codes from this endpoint.';
    res.status(200).jsonp(response);
  }
}

var knownStatusCodes = {
  '100': 'Continue',
  '101': 'Switching Protocols',
  '103': 'Checkpoint',
  '117': 'Spartan Friendly',

  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '306': 'Switch Proxy',
  '307': 'Temporary Redirect',
  '308': 'Resume Incomplete',

  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Request Entity Too Large',
  '414': 'Request-URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Request Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'I\'m a teapot (RFC 2324)',
  '419': 'Authentication Timeout',
  '420': ['Method Failiure (Spring)', 'Enhance Your Calm'],
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity (WebDAV; RFC 4918)',
  '423': 'Locked (WebDAV; RFC 4918)',
  '424': 'Failed Dependency (WebDAV; RFC 4918)',
  '426': 'Upgrade Required',
  '428': 'Precondition Required (RFC 6585)',
  '429': 'Too Many Requests (RFC 6585)',
  '431': 'Request Header Fields Too Large (RFC 6585)',
  '440': 'Login Timeout (Microsoft)',
  '444': 'No Response (Nginx)',
  '449': 'Retry With (Microsoft)',
  '450': 'Blocked by Windows Parental Controls (Microsoft)',
  '451': ['Unavailable For Legal Reasons', 'Redirect (Microsoft)'],
  '494': 'Request Header Too Large (Nginx)',
  '495': 'Cert Error (Nginx)',
  '496': 'No Cert (Nginx)',
  '497': 'HTTP to HTTPS (Nginx)',
  '498': 'Token expired/invalid (Esri)',
  '499': 'Token required (Esri)',

  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
  '511': 'Network Authentication Required',
  '598': 'Network read timeout error',
  '599': 'Network connect timeout error'
};

module.exports = endpoint;