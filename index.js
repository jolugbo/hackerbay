//'use strict'
//import dependencies 
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const jspatch = require('jsonpatch');

//configure app to encode call values
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post('/authenticate', (req, res) => {
    user = {};
    patch = [
        { "op": "add", "path": "/username", "value": req.body.username },
        { "op": "add", "path": "/password", "value": req.body.password }
    ];
    userPatch = jspatch.apply_patch(user, patch);
    //res.json(userPatch);
    jwt.sign({ userPatch }, 'secret', (err, token) => {
        res.json({ token });
    });
});

app.post('/upload', verification, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            res, sendStatus(403);
        } else {
            res.json({
                message: 'Post Created',
                authData
            });
        }
    })
});
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

function authenticate(user){
    user = {};
    patch = [
        { "op": "add", "path": "/username", "value": user.username },
        { "op": "add", "path": "/password", "value": user.password }
    ];
    userPatch = jspatch.apply_patch(user, patch);
    //res.json(userPatch);
    jwt.sign({ userPatch }, 'secret', (err, token) => {
        res.json({ token });
    });
}