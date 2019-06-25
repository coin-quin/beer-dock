/*jslint node: true */
/*jshint unused: false */
'use strict';

//Modules
var beerlib = require('../lib/beer_love');
var MongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');
var fs = require('fs');
var http = require('http');

//Database
var url = "mongodb://mongo:27017/beerdb";
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) { console.log(err); } 
  else {    
    console.log("[beer_server.js]Database created!");
  
    var dbo = db.db("beerdb");
    dbo.createCollection("beers", function (err, res) {
      if (err) { console.log(err); }
      else {
        console.log("[beer_server.js]Collection created!");
      }
      db.close();
    });
  }
});

//Server
http.createServer(function (req, res) {

  //After file has been uploaded
  if (req.url === '/fileupload') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (err) { console.log(err); }
      
      else{
        var raw = fs.readFileSync(files.filetoupload.path);
        var list = JSON.parse(raw);
        console.log("[beer_server.js]Data uploaded:", list);
        
        var parsed_data = beerlib.beerparser(list);
        
        console.log("[beer_server.js]Data parsed:", parsed_data);
        
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
          if (err) { console.log(err); } 
          else { 
            var dbo = db.db("beerdb");
            dbo.collection("beers").insertMany(parsed_data, function(err, res) {
              if (err) { console.log(err); }
              
              console.log("[beer_server.js]Number of documents inserted: " + res.insertedCount);
              db.close();
            });
          }
        });
        
        res.write("Data loaded.");
        
        //Upload form
        res.write('<form action="seedb" method="post" enctype="multipart/form-data">');
        res.write('<input type="submit" value="See result">');
        res.write('</form>');
      }
      res.end();
    });
      
  } else if (req.url === '/seedb') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h2>DB display page.</h2>');
    
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
    if (err) { console.log(err); }
    var dbo = db.db("beerdb");
    dbo.collection("beers").find({}).toArray(function(err, result) {
      if (err) { console.log(err); }
      console.log("[beer_server.js]Result:", result);
      res.write(beerlib.dbtohtml(result));
      res.end();
      db.close();
      });
    }); 
  
  //File upload
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    //Welcoming words
    res.write(beerlib.awesome(3));
    
    //Upload form
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);