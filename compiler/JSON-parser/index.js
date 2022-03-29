const fs = require('fs');
const Parser = require('./lib/parser')

const str = fs.readFileSync('./test.json', 'utf8');
const p = new Parser(str)
console.log(p.getTree())