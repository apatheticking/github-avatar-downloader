var request = require('request');
var fs = require('fs');
var secret = require('./secrets.js');

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

getRepoContributors("jquery", "jquery", function(err, results) {
  for (result in results){
    //console.log(results[result]);
    //console.log(result);
    downloadImageByURL(results[result], "./avatar" + result + ".jpg");
  }

});

//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./avatars/kvirani.jpg");