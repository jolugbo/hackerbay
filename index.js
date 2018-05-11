//'use strict'
//import dependencies 
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const jspatch = require('jsonpatch');
const formidable = require('formidable');
const fs = require('fs');
const jimp = require('jimp');
//configure app to encode call values
app.use(bodyParser.urlencoded({ extended: false }))

//default routes to login page
app.get('/', function (req, res) {
    fs.readFile('views/login.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
        return res.end();
    });
});

//autentication handler
app.post('/authenticate', (req, res) => {
    user = {};
    patch = [
        { "op": "add", "path": "/username", "value": req.body.username },
        { "op": "add", "path": "/password", "value": req.body.password }
    ];
    userPatch = jspatch.apply_patch(user, patch);
    jwt.sign({ userPatch }, 'secret', (err, token) => {
        res.json({ token });
    });
});

//upload form generator for test 
app.get('/uploadForm', (req, res) => {
    fs.readFile('views/uploadform.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
        return res.end();
    });
});

//code to resize and return download link url
app.post('/resizeAction', verification, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            res, sendStatus(403);
        } else {
            var form = new formidable.IncomingForm();
            var oldpath, newpath;
            form.parse(req, function (err, fields, files) {
                oldpath = files.filetoupload.path;
                newpath = "uploadPath/"+ files.filetoupload.name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
                jimp.read(newpath).then(function (imgFile) {
                    imgFile.resize(50, 50)
                        .write(newpath); // save
                }).catch(function (err) {
                    console.error(err);
                });
                response = {};
                patch = [
                    { "op": "add", "path": "/message", "value": "Resize Completed Successfully" },
                    { "op": "add", "path": "/imgResizeUrl", "value": newpath },
                ];
                responsePatch = jspatch.apply_patch(response, patch);
                res.json({
                    responsePatch,
                    authData
                });
                res.end();
            });
        }
    })
});

//code to verify token validity
function verification(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        next();
    }
    else {
        res.sendStatus(403);
    }
}
app.listen(8080, function () { console.log('Server running...') });
