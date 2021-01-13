const path = require('path');

console.log(__dirname);
console.log(path.join(__dirname,'..','ex03','var.js'));
console.log(path.resolve(__dirname, '..', '/var.js'));

const string = __filename;

console.log(path.sep);
console.log(path.delimiter);
console.log('-------------------------');
console.log(path.dirname(string));
console.log(path.extname(string));
console.log(path.basename(string));
console.log(path.basename(string, path.extname(string)));
console.log('-------------------------');
console.log(path.parse(string));