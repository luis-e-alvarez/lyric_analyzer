var request = require('request');
let rp = require('request-promise');
var fetch = require('node-fetch');
const cheerio = require('cheerio');
let Promise = require('bluebird');
let db = require('../database/index.js');
var watson = require('./watson.js');

var geniusRequest = (term) => {
    return new Promise((resolve, reject) => {
    term = term.toLowerCase();
    var res = encodeURI(`http://api.genius.com/search?q=${term}`);
    let options = {
        uri: `http://api.genius.com/search?q=${term}`,
        headers: {
            'Authorization' : 'Bearer vBn9UC9QImmcayy-RYH3NSao1aloRAykZxlxZlwvpJDU-w5TSZOTVKptrbGmzAeu',
        },
    }
    db.find(term).then((result) =>{
        if(result[0] !== undefined){
           resolve(result);
        } else {
            resolve(rp(options).then((response) => {
                var name = '';
                var id = '';
                let body = JSON.parse(response);
                body = body.response.hits;
                for(var i = 0; i < body.length; i++){
                    let hit = body[i];
                    if(hit.result.primary_artist.name.toLowerCase() === term){
                        id = hit.result.primary_artist.id;
                        name = hit.result.primary_artist.name;
                    }
                }
                return db.saveArtist(id, name)
                .then((result) =>{
                    if(result.lyrics === ''){
                        return (getSongs(result.artistID));
                    } else {
                        console.log('duplicate')
                        throw result;
                    }
                }).then((result) =>{
                    return (result);
                });
            }));
        };
    });
  });
}

function getSongs(id){
  return new Promise((resolve, reject) => {
    let options = {
        uri: `http://api.genius.com/artists/${id}/songs?sort=popularity`,
        headers: {
            'Authorization' : 'Bearer vBn9UC9QImmcayy-RYH3NSao1aloRAykZxlxZlwvpJDU-w5TSZOTVKptrbGmzAeu',
        },
    }
  resolve(rp(options).then((result) => {
     return JSON.parse(result);
  })
  .then(result =>{
    let body = result.response.songs;
    var promises = [];
    for(var i = 0; i < 5; i++){
        promises.push((getLyrics(body[i].url)));
    }
    return Promise.all(promises);
  })
  .then((result) =>{
      var contentItems = [];
      result.forEach(item =>{
        var obj = {};
        var newText = item.trim();
        obj.content = newText;
        contentItems.push(obj);
      });
      return contentItems;
  })
  .then(result =>{
      lyrics = JSON.stringify(result);
      return (db.saveLyrics(lyrics, id));
  }).then(result =>{
        return result;
  }));
 });
}

function getLyrics(url){
  return fetch(url, {method: 'GET'}).then((result) => {
    return result.text();
  }).then(parseSongHTML);
}

function parseSongHTML(htmlText) {
  const $ = cheerio.load(htmlText)
  const lyrics = $('.lyrics').text()
  return lyrics;
}

module.exports.geniusRequest = geniusRequest;