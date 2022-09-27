
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
// eslint-disable-next-line one-var
const fs = require('fs'),
  readFile = Promise.promisify(fs.readFile),
  readDir = Promise.promisify(fs.readdir),
  writeFile = Promise.promisify(fs.writeFile),
  fileExists = Promise.promisify(fs.exists);


var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {

  //read the curr number in counter.txt
  readCounter(function(err, counter) {
    if (err) {
      console.log(err);
    } else {
      var newCount = counter + 1;
      writeCounter(newCount, function(err) {
        if (err) {
          console.log(err);
        } else {
          callback(null, zeroPaddedNumber(counter + 1));
        }
      });
    }
  });

  //increment the number


  //write number to new file




  // writeCounter(readCounter((input)=>(input + 1)), console.log);

  // return readCounter((currentCount)=>(currentCount));

};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
