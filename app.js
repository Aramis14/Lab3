var fs = require('fs');
var http = require('http');
var url = require('url');
var firstName = "Visitor";
var lastName = '';
var ROOT_DIR = "html/";
const Emitter = require('events');
var emtr = new Emitter();

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    console.log(urlObj);
    var cookie = req.headers["set-cookie"];
    var html = '{name}';

    if (cookie) {
        firstName = cookie.name;
    } else {
        console.log("no cookie found");
    }

    if (urlObj.pathname === '/' || urlObj.pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        html = getWebpage('index');
    } else if (urlObj.pathname === '/login.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        html = getWebpage('login');
    }

    html = html.replace('{name}', firstName);
    res.end(html);

}).listen(3000, '127.0.0.1');

function getWebpage(siteName) {
    var webpage = fs.readFileSync(ROOT_DIR + 'header.html', 'utf8');
    webpage += fs.readFileSync(ROOT_DIR + siteName + '.html', 'utf8');
    webpage += fs.readFileSync(ROOT_DIR + 'footer.html', 'utf8');
    return webpage;
}
/*
var headers = {
    'Host': 'www.example.com',
    'Cookie': cookie,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data, 'utf8')
};
*/