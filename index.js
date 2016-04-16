var app = require('./server/server.js');
var http = require('http');
var https = require('https');
var fs = require('fs');
var httpPort = 8070;
var httpsPort = 8071

// var ca = [];
// var chain = fs.readFileSync('ssl-bundle.crt', 'utf8');
// chain = chain.split('\n');
// var cert = [];

// for (var i = 0; i < chain.length; i++) {
//   var line = chain[i];
//   if (!(line.length !== 0)) {
//     continue;
//   }
//   cert.push(line);
//   if (line.match(/-END CERTIFICATE-/)) {
//     ca.push(cert.join('\n'));
//     cert = [];
//   }
// }

// var options = {
//   ca: ca,
//   key: fs.readFileSync('ssl.key'),
//   cert: fs.readFileSync('instaroomie_co.crt'),
//   requestCert:        true,
//   rejectUnauthorized: false
// };

var httpServer = http.createServer(app);
// var httpsServer = https.createServer(options, app);
httpServer.listen(httpPort, console.log('http Express server listening on port ', httpPort));
// httpsServer.listen(httpsPort, console.log('https Express server listening on port ', httpsPort));
