var request = require('request');
var fs = require('fs');
var secret = require('./secrets.js');

var input = process.argv.slice(2);

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authoriztion': secret.GITHUB_TOKEN
    }
  }

  request(options, function(err, res, body) {
    var users = JSON.parse(body);
    var avatars = {};

    for(user of users){
      avatars[user.login] = user.avatar_url;
    }
    cb(err, avatars);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url,).on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream(filePath));
}

console.log('Welcome to the GitHub Avatar Downloader!');

if(input.length < 2 || input.length > 2){
  console.log("invalid input");
} else {
  getRepoContributors(input[0], input[1], function(err, results) {
    for (result in results){
      downloadImageByURL(results[result], "./avatars/" + result + ".jpg");
    }
  });
}
