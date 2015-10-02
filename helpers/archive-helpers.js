var fs = require('fs'); //file system
var path = require('path');
var _ = require('underscore');
var request = require('request');
//require http

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  //Access list of URLs in archive
  fs.readFile(exports.paths["list"], 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    } else {
      callback(data.toString().split('\n'));
    }
  })
};

exports.isUrlInList = function(url, callback){
  fs.readFile(exports.paths["list"], 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    var array = data.toString().split('\n');
    var foundStatus = false
    if(array.indexOf(url) > -1) {
      foundStatus = true
    }
    callback(foundStatus)

  })
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths["list"], JSON.stringify(url), function (err) {
    if (err){
      return console.log(err);
    }
    else {
      callback(url)
    }

  })
};

exports.isUrlArchived = function(url, callback){
  //checks to see if the html page associated with url exists in archive folder
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    //files is an array of sites
    var foundStatus = false
    if (files.indexOf(url) > -1) {
      foundStatus = true
    }
    callback(foundStatus)
  })
};

exports.downloadUrls = function(array){
  array.forEach(function(item){
    request("http://" + item, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        fs.writeFile(exports.paths.archivedSites + "/" + item, JSON.stringify(body));
      }
    })

  })
};
