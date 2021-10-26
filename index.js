#!/usr/bin/env node

// console.log("clearing " + process.cwd());

// const fs = require("fs");
// const path = require("path");

// const directory = process.cwd();

// fs.readdir(directory, (err, files) => {
//   if (err) throw err;

//   for (const file of files) {
//     fs.unlink(path.join(directory, file), (err) => {
//       if (err) throw err;
//     });
//   }
// });

// console.log("oops! :) cleared");

// const path = require("path");
// const fs = require("fs");
// const chalk = require("chalk");
// const log = console.log;

// //joining path of directory
// const directoryPath = process.cwd();
// //passsing directoryPath and callback function
// fs.readdir(directoryPath, function (err, files) {
//   console.log(JSON.stringify(files));
//   //handling error
//   if (err) {
//     return console.log("Unable to scan directory: " + err);
//   }
//   //listing all files using forEach
//   files.forEach(function (file) {
//     // Do whatever you want to do with the file
//     log(file + " " + chalk.green("modified"));
//     console.log(JSON.stringify(file));
//   });
// });

const chalk = require("chalk");
const log = console.log;
const fs = require("fs");
function readWriteSync(dir) {
  var data = fs.readFileSync(dir, "utf-8");

  var newValue = data.replace("STYLES", "amirStyles");

  fs.writeFileSync(dir, newValue, "utf-8");

  log(dir + " " + chalk.green("modified"));
}

var glob = require("glob");

var ignoreFile = "";

try {
  ignoreFile = fs.readFileSync(process.cwd() + "/.housecleanIgnore", "utf-8");
} catch (e) {}

const fixStyles = (dir) => {
  let data = fs.readFileSync(dir, "utf-8").replace(/(\r\n|\n|\r)/g, "");
  const matchs = data.match(/style={{.*?(?=}})/g);
  matchs.forEach((match, index) => {
    const pattern = match.replace("style=", "") + "}}";
    data = data.replace(pattern, "{styles.amirStyle" + index + "}");
  });

  const finalStyle = `const styles = StyleSheet.create({${matchs.map(
    (match, index) => {
      return `amirStyle${index}:{${match.replace("style={{", "")}}`;
    }
  )}})`;
  fs.writeFileSync(dir, data + finalStyle, "utf-8");
  log(dir + " " + chalk.green("modified"));
};

console.log("hello");
glob(process.cwd() + "/**/*.js", function (err, files) {
  files.forEach((file) => {
    if (ignoreFile) {
      if (!file.includes(ignoreFile)) {
        fixStyles(file);
      }
    } else {
      fixStyles(file);
    }
  });
});
