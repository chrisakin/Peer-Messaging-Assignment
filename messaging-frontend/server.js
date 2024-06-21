const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.use((req, res, next) => {
	if (req.hostname.startsWith('www.')) {
	  return res.redirect(301, `https://${req.hostname.slice(4)}${req.url}`);
	}
	next();
  });

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8084
app.listen(port)
console.log(`app is listening on port: ${port}`)