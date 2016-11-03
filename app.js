var fs = require('fs');
var http = require('http');
var url = require('url');
var firstName = "Visitor";
var role = "guest";
var ROOT_DIR = "html/";
const Emitter = require('events');
var emtr = new Emitter();
var loginLink = '<a href="/login">Click here to log in.</a>';

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    //console.log(urlObj);

    var html = '{name}';
    var qstr = urlObj.query;

    if (req.headers.cookie) {
        var cookies = getCookie(req);
        console.log(":::::::" + cookies);
        console.log(cookies[0] + "--->" + cookies[1]);
        firstName = cookies[1];
        role = cookies[3];
        loginLink = '<a href="/logout">Click here to log out.</a>';
    } else {
        loginLink = '<a href="/login">Click here to log in.</a>';
        console.log("no cookie found.");
    }

    if (urlObj.pathname === '/' || urlObj.pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        html = getWebpage('index');
    } else if (urlObj.pathname === '/login') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        html = getWebpage('login');
    } else if (urlObj.pathname === '/logout') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'set-cookie': [
                "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC",
                "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
            ]

        });
        firstName = 'Visitor';
        html = getWebpage('logout');
    } else if (urlObj.pathname === '/post') {

        if (cookies[3] == 'writer') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            html = getWebpage('post');
        } else {
            res.writeHead(404);
        }
    } else if (urlObj.pathname === '/action_page.html') {
        console.log("user: " + qstr.user);
        console.log("password: " + qstr.password);
        if (qstr.user === qstr.password) {
            html = getWebpage('index');
            res.writeHead(200, {
                'set-cookie': ['name=' + qstr.user,
                'role=' + qstr.role]
            });
            loginLink = '<p>Thank you for loggin in ' + cookies[1] + '</p>';
            firstName = qstr.user;
        } else {
            html = '<p>User name and password do not match.</p>';
            html += getWebpage('login');
        }
    }

    html = html.replace('{logged}', loginLink);
    html = html.replace('{name}', firstName);

    res.end(html);
}).listen(3000, '127.0.0.1');

function getWebpage(siteName) {
    var webpage = fs.readFileSync(ROOT_DIR + 'header.html', 'utf8');
    webpage += fs.readFileSync(ROOT_DIR + siteName + '.html', 'utf8');
    webpage += fs.readFileSync(ROOT_DIR + 'footer.html', 'utf8');
    return webpage;
}

function getCookie(request) {
    var cookies = [];
    var rc = request.headers.cookie;
    var temp = '';

    for (var i = 0; i < rc.length; i++) {
        if (rc[i] == '=' || rc[i] == ';') {
            cookies.push(temp);
            temp = '';
        } else if (rc[i] == ' ') {
        } else {
            temp += rc[i];
        }
    }
    if (temp != '') {
        cookies.push(temp);
    }
    return cookies;
}

