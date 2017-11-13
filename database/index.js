var mongoose = require('mongoose');
var Promise = require('bluebird');
var Watson = require('../helpers/watson.js');
require('mongoose').Promise = global.Promise;
mongoose.connect('mongodb://localhost:artists');

var db = mongoose.createConnection('mongodb://localhost:artists', function(err){
  if(err){
    console.log(err);
  } else {
    console.log('connected!');
  }
});

let artistSchema = mongoose.Schema({
  artistName: {type: String, unique: true},
  artistID: {type: Number, unique: true},
  lyrics: String,
  personality: String,
})

let Artist = mongoose.model('Artist', artistSchema);

var saveArtist = (id, name) =>{
    return new Promise((resolve, reject) => {
    var lower = name.toLowerCase();
    var newArtist = new Artist({artistName:lower, artistID: id, lyrics: ''});
    newArtist.save((err, result) =>{
        if(err){
            console.log(err);
            return;
        } else {
            resolve(result);
        }
      });
    }).then((result) =>{
      return result;
    });
}

let saveLyrics = (lyrics, id) => {
    return new Promise((resolve, reject) => {
    Artist.findOneAndUpdate({artistID: id}, {lyrics: lyrics},{new:true}, (err, result) => {
        if(err){
        console.log(err);
        return;
        } else {
         resolve(result);
        }
    });
  }).then((result) =>{
      return Watson.watsonHelper(result,id)
  }).then((result) =>{
      return result;
  });
}

let savePersonality = (results) => {
   return new Promise((resolve, reject) =>{
   var id = results.id;
   var personality = JSON.stringify(results.result);
   Artist.findOneAndUpdate({artistID: id}, {personality: personality},{new:true}, (err, result) => {
    if(err){
      console.log(err);
    } else {
      resolve(result);
    }
   });
   }).then(result =>{
       return result;
   });
}

let find = (name) => {
  return new Promise((resolve, reject) =>{
    Artist.find({artistName: name}, (err, result) => {
        if(err){
            console.log(err);
            throw err;
        } else {
          resolve(result);
        }
      });
  }).then((result) =>{
     return result;
  }).catch((err)=>{
    return;
  });
}

let startFind = () => {
  return new Promise((resolve, reject) =>{
    Artist.find({}, (err, result) => {
      if(err){
          console.log(err);
          throw err;
      } else {
        resolve(result);
      }
    });
  }).then((result) =>{
   return result;
 }).catch((err)=>{
  return;
 });
}

module.exports.startFind = startFind;
module.exports.find = find;
module.exports.savePersonality = savePersonality;
module.exports.saveArtist = saveArtist;
module.exports.saveLyrics = saveLyrics;