const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let destination = path.join(exports.dataDir, id + '.txt');
    console.log(destination);
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(destination, text, (err) => {
        if (err) {
          console.log(err);
        }
        callback(null, {id, text});
      });
    }
  });

  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  let source = exports.dataDir;
  //read directory
  //get todo files
  //
  fs.readdir(source, (err, data) => {
    if (err) {
      console.log(err);
    }
    //console.log('data ---->', data);
    let responseData = data.map((item) => {
      //get rid of extension in each id// get the file name without the extensions
      let id = path.parse(item).name;
      let text = id;
      console.log(id, text);
      return {id, text};
    });
    callback(null, responseData);
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });

};

exports.readOne = (id, callback) => {
  //find dir by id
  //get message from file
  //send message/ content of the file to server
  let source = exports.dataDir;
  fs.readdir(source, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('data-------->', data);
      let idExist = false;
      for (let i = 0; i < data.length; i++) {
        if (path.parse(data[i]).name === id) {
          console.log('id is, ', id, 'the found file is', data[i]);
          idExist = true;
          fs.readFile(path.join(exports.dataDir, data[i]), (err, fileData)=> {
            if (err) {
              console.log(err);
            } else {
              callback(null, fileData);

            }
          });
          return;
        }
        if (!idExist) {
          callback(err, id);
        }
      }
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
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
