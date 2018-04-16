var request = require('request'); //importing the modules to makes this program work
var fs = require('fs');
var secret = require('./secrets.js');

var input = process.argv.slice(2); //get the users input

function getRepoContributors(repoOwner, repoName, cb) {
  //where the user's(my) credentials are stated
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authoriztion': secret.GITHUB_TOKEN
    }
  }
  //get all the github users
  request(options, function(err, res, body) {
    var users = JSON.parse(body);
    var avatars = {};

    for(user of users){
      avatars[user.login] = user.avatar_url;
    }
    cb(err, avatars);
  });
}

//downloads the avatar images and stores them into the avatars folder
function downloadImageByURL(url, filePath) {
  request.get(url,).on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream(filePath));
}

//start of the program
console.log('Welcome to the GitHub Avatar Downloader!');

//checks if the user input has the right amount of parameters, if it does then run the rest of the program
if(input.length < 2 || input.length > 2){
  console.log("invalid input");
} else {
  //gets the github users and tells the program which ones and where to download the avatars
  getRepoContributors(input[0], input[1], function(err, results) {
    for (result in results){
      downloadImageByURL(results[result], "./avatars/" + result + ".jpg");
    }
  });
}
