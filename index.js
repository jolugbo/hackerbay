const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/',function(req,res){
    res.sendFile(__dirname+'/login.html');
});

app.post('/authenticate',(req,res)=>{
    jwt.sign();
});

app.post('/upload',(req,res)=>{

})
app.listen(8080,function(){console.log('Server running...')});