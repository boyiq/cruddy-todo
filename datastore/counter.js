
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
// with bluebird
exports.getNextUniqueId = () => {

  //look and see if counter.txt exists
  readDir('./datastore')
    .then(function(data) {
      if (data.includes('counter.txt')) {
        data.forEach((file, index) => {
          if (file === 'counter.txt') {
            readFile(`./datastore/${file}`)
              .then(function(data) {
                const newId = Number(data) + 1;
                writeFile(`./datastore/${file}`, newId.toString())
                  .then(function(data) {
                    console.log('count file updated');
                  });
              });
          }
        });
      } else {
        writeFile('./datastore/counter.txt', (1).toString())
          .then(function(data) {
            console.log('new counter.txt file written');
          });
      }
    });
  //if not make one
  //if yes, increment one
  //readFile
  //increment num
  //writefile with new num

  // exports.getNextUniqueId = () => {
  //   //check to see if counter.txt exists
  //   const dirPath = './datastore';
  //   fs.readdir(dirPath, (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     data.forEach((file, index) => {
  //       if (file === 'counter.txt') {
  //         fs.readFile(`${dirPath}/counter.txt`, (err, data) => {
  //           if (err) {
  //             console.log(err);
  //           }
  //           const newId = Number(data) + 1;
  //           fs.writeFile(`${dirPath}/counter.txt`, newId.toString(), (err) => {
  //             if (err) {
  //               console.log(err);
  //             }
  //             console.log('File saved');
  //           });
  //         });
  //       } else {
  //         fs.writeFile(`${dirPath}/counter.txt`, (1).toString(), (err) =>{
  //           if (err) {
  //             console.log(err);
  //           }
  //         });
  //       }
  //     });
  //   });


  counter = counter + 1;
  return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
