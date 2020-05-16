const http = require('http')
const fs = require('fs')
const index = fs.readFileSync('index.html')

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(index);
}).listen(9615);