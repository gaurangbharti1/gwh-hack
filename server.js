var port = process.env.PORT; // Port of server

//Libraries
//var getenv = require('getenv'); // Library for Enviroment Variables, Used for Db Conn
//var mysql = require('promise-mysql'); // Mysql Library, With Node Promises
//var sha512 = require('sha512'); // Sha512 Library, Sha512 is a hash
var bodyParser = require('body-parser'); // Library for parsing data
var jsonParser = bodyParser.json(); // Using Data type Json
var cors = require("cors"); // Library for handling access headers
var analyser = require("./analyse.js")
var video = require("./video.js")
var express = require('express'); // Framework for Node
var app = express(); // Establishing Express App
app.use(express.logger());
app.use(cors()); // Cors to Handle Url Authentication 
app.use(bodyParser.json()); // Using Body Parser
var server = app.listen(port); // Set Port

app.use('/', express.static('client'));

app.get("/getTranscript", async function(req,res){
    //console.log("Hello")
    let name = req.query.name;
    console.log(name)
    let data = await analyser.transcription(name)
    res.status(200).json({
       data
    });
    
});
app.get("/getSummary",function(req,res){
    analyser.summary(req.query.transcript)
});
app.post("/newVideo",function(req,res){
//    let url = req.body.url;
    video.newVideo(req, res)
});