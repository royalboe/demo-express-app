const fs = require('fs');

const requestHandler = (req, res) => {
     // console.log(req.url, req.method, req.headers);
        const url = req.url;
        const method = req.method;

        // This routes user to /message
        if (url ==='/') {
            res.setHeader("Content-Type", "text/html");
            res.write('<html>');
            res.write('<head><title> Fill form </title></head>');
            res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send me</button></input></form></body>');
            res.write('</html>');
            return res.end();
        }

        // This takes it back to the root path
        if (url === '/message' && method === 'POST') {
            const body = []
            req.on('data', chunk => {
                console.log(chunk);
                body.push(chunk);
            });
            return req.on('end', () => {
                const parsedBody = Buffer.concat(body).toString();
                const message = parsedBody.split('=')[1];
                fs.writeFile('message.txt', message, err => {
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    return res.end();
                });
            });
        }

	// Default response
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>NodeJs</title></head>");
        res.write("<body><h1>Hello from nodejs!!!</h1></body>");
        res.write("</html>");
        res.end();
        // process.exit();
}

module.exports = requestHandler;
