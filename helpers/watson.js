var request = require('request');
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');


var personality_insights = new PersonalityInsightsV3({
    url: "https://gateway.watsonplatform.net/personality-insights/api",
    username: "5892aed9-72dd-4486-a9b8-df63328aa301",
    password: "icxHgpcCiVia",
    version_date: '2017-10-13'
  });
  
let watsonHelper = (result, id) =>{
    return new Promise((resolve, reject) => {
    var newLyrics = JSON.parse(result.lyrics);
    for(var i = 0; i < newLyrics.length; i++){
        var lyrics = newLyrics[i].content.replace(/[\[\]']+/g,'');
        lyrics = lyrics.replace(/\n/g, " ");
        lyrics = lyrics.replace(/[^\w\s]/gi, '')
        newLyrics[i].content = lyrics.trim();
        newLyrics[i].contenttype = 'text/plain';
    }
    var items = newLyrics;
    var params = {
        // Get the content items from the JSON file.
        content_items: items,
        consumption_preferences: true,
        raw_scores: true,
        headers: {
          'accept-language': 'en',
          'accept': 'application/json',
          "Content-Type": "application/json",
        }
      };
      personality_insights.profile(params, (error, response) => {
        if (error){
          console.log('Error:', error);
         } else{
        var body = {};
        body.result = JSON.stringify(response, null, 2);
        body.result = JSON.parse(body.result);
        body.id = id;
        body = JSON.stringify(body);
        resolve(body);
        }
      });
  }).then((result) => {
    return result;
  });
}




module.exports.watsonHelper = watsonHelper;