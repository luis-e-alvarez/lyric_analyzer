const express = require('express');
const genius = require('../helpers/genius-helper.js');
const db = require('../database/index.js')
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public/dist'));
app.set('port', process.env.PORT || 3000);

app.post('/artist', function(req, res) {
let body = [];
   req.on('data', (chunk) => {
       body.push(chunk);
   }).on('end', () => {
       body = Buffer.concat(body).toString();
       body = JSON.parse(body);
       var term = body.search;
       (genius.geniusRequest(term)).then(result => {
            return(result);
       }).then(result =>{
           if(Array.isArray(result)){
               return result;
           } else {
           var body = JSON.parse(result);
           return db.savePersonality(body);
           }
       }).then((result) =>{
         res.status(201);
         res.body = JSON.stringify(result);
         res.end(res.body);
       });
  });
});

app.post('/personality/', (req, res) => {
    let body = [];
        req.on('data', (chunk) => {
           body.push(chunk);
        }).on('end', () => {
           body = Buffer.concat(body).toString();
           body = JSON.parse(body);
           return db.savePersonality(body);
        });
});

app.get('/artist/', (req, res) =>{
    db.startFind().then(result => {
        res.body = JSON.stringify(result);
        res.end(res.body);
    });
});



app.listen(app.get('port'), function() {
    console.log(`listening on port ${app.get('port')}`)
});