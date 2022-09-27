
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
    //
    //   console.log('data-------->', data);
      let idExist = false;
      for (let i = 0; i < data.length; i++) {
        if (path.parse(data[i]).name === id) {
          console.log('id is, ', id, 'the found file is', data[i]);
          idExist = true;
          console.log('path=====>', path.join(exports.dataDir, data[i]))
          fs.readFile(path.join(exports.dataDir, data[i]), "utf8", (err, fileData)=> {
            if (err) {
              console.log(err);
            } else {
              let id = path.parse(data[i]).name;
              let text = fileData;
              callback(null, {id, text});
            }
          });
          return;
        }
      }
      if (!idExist) {
        console.log('------error handler');
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });
};

exports.update = (id, text, callback) => {
  //look for file based on id
  let currDir = exports.dataDir;
  fs.readdir(currDir, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let idExist = false;
      data.forEach((file) => {
        const currFileName = path.parse(file).name;
        if (currFileName === id) {
          idExist = true;
          let destination = path.join(currDir, file);
          fs.writeFile(destination, text, (err) => {
            if (err) {
              console.log(err);
            } else {
              let id = path.parse(file).name;
              let newText = text;
              callback(null, {id, newText});
            }
          })
        }
      });
      if (!idExist) {
        console.log('------error handler');
        callback(new Error(`No item with id: ${id}`));
      }
    }
  })
};

exports.delete = (id, callback) => {
  //get to the id files directory, look for the file with id
  let source= exports.dataDir;
  fs.readdir(source, (err,data)=> {
    if (err) {
      console.log(err);
    } else {
      let idExist = false;
      console.log(`initial file directory list ----->`, data);
      data.forEach((file) => {
        let fileName = path.parse(file).name;
        if (fileName === id) {
          idExist = true;
          let filePath = path.join(source, file);
          fs.rm(filePath, (err) => {
            if (err) {
              console.log(err);
            } else {
              callback(null);
              console.log('Successfully deleted')
            }
          })
        }
      });
      if (!idExist) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  })
  //if found, fs.rm()
  //if not found, send error saying it's not found



//fs.rm(path[, options], callback)
  //var item = items[id];
  //delete items[id];
  //if (!item) {
  //  // report an error if item not found
  //  callback(new Error(`No item with id: ${id}`));
  //} else {
  //  callback();
  //}
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
