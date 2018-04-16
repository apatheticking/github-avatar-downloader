var request = require('request');
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

console.log('Welcome to the GitHub Avatar Downloader!');

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log(result);
});