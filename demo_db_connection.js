var mysql = require('mysql');
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

var app = express();
var server = http.createServer(app);



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


/*

  Creo que lo que tengo que hacer es encontrar otra manera de consumir la info de email.
  Posiblemente de alguna manera ese texto tiene que ir a parar a algun lado.
  https://medium.com/swlh/read-html-form-data-using-get-and-post-method-in-node-js-8d2c7880adbf
  Ahi tiene que estar.

*/



var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "zentux"
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'/public')));
app.use(helmet());
app.use(limiter);

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'/public/index.html'));
});

app.post('/send', function(req,res){
  var sql = 'UPDATE user SET termsAndConditionApproved = 1 WHERE email = "' + req.body.email + '"';
    con.query(sql, function (err, result) {
      if (err) throw err;
      if(result.changedRows == 0){
        res.statusCode = 302;
        res.setHeader('Location', '/failed.html');
        res.end();
      }else{
        res.statusCode = 302;
        res.setHeader('Location', '/success.html');
        res.end();
      };
    });
});

app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });
});


server.listen(3000,function(){ 
  console.log("Server listening on port: 3000");
})










/*
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = 'UPDATE user SET termsAndConditionApproved = 1 WHERE id = 2';
    con.query(sql, function (err, result) {
      if (err) throw err;
      let dbReturn = Object.values(JSON.parse(JSON.stringify(result)));
      truthChecker(dbReturn[0].termsAndConditionApproved.data[0]);
      //console.log(dbReturn[0].termsAndConditionApproved.data[0])
    });
  });

function truthChecker(checked){
    if(checked){
        console.log("dbReturn is true")
    }else{
        console.log("dbReturn is false")
    }
}



app.post('/send', function(req,res){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = 'UPDATE user SET termsAndConditionApproved = 1 WHERE email = "' + req.body.email + '"';
    con.query(sql, function (err, result) {
      if (err) throw err;
      if(result.affectedRows == 0){
        res.statusCode = 302;
        res.setHeader('Location', '/failed.html');
        res.end();
      }else{
        res.statusCode = 200;
        res.setHeader('Location', '/success.html');
        res.end();
      };
    });
  });
});

*/