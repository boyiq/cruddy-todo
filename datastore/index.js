
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
// eslint-disable-next-line one-var
const fs = require('fs'),
  readFile = Promise.promisify(fs.readFile),
  readDir = Promise.promisify(fs.readdir),
  writeFile = Promise.promisify(fs.writeFile),
  fileExists = Promise.promisify(fs.exists);

//promisify format: from http://bluebirdjs.com/docs/working-with-callbacks.html#working-with-callback-apis-using-the-node-convention
// callback: fs.readfile("name", "utf-8"), function(err, data) {
//stuff
//}
//
//promisified:
//fs.readFileAsync("name", "utf-8")
//.then(function(data))
//.then(function(data))
//...





var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId();
  console.log('new id created: ', id);
  //here is where we write new todos
  // items[id] = text; // this writes to items obj;
  //here is where we send res back to express
  //create a new .txt file
  const filePath = './datastore/';
  const fileName = `${filePath}${id}.txt`;
  fs.writeFile(fileName, text, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(`File ${fileName} has been created with ${text} as the data`);
    //where express responds to client
    callback(null, { id, text });
  });
};

exports.readAll = (callback) => {
  //get the data from individual
  //.txt files, use fs.readdir to get filenames
  // --> inside a loop, use fs.readfile to extract
  //file data into an array of objects
  //
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
