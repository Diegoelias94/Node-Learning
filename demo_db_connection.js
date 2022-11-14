var mysql = require('mysql');
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

var app = express();
var server = http.createServer(app);


// limit max num of requests per unit of time
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// open connection to DB
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "zentux"
});

// set bodyParser, path for express static files, and libs.
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'/public')));
app.use(helmet());
app.use(limiter);

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'/public/index.html'));
});

// send req to DB and update. This obviously needs further auth methods other than email, but
// with the limited DB model I'm working on, this works well enough to serve as an example.
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

// close connection in case it's needed
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

// set listener on port:3000 to get reqs. nodemon restarts sv on filechange for reusability.
server.listen(3000,function(){ 
  console.log("Server listening on port: 3000");
})
