const fs = require("fs");
const path = require("path");
const Parser = require("./lib/parser");

const filePath = path.resolve(__dirname, './assets/test.html');
const content = fs.readFileSync(filePath, 'utf8');

const parser = new Parser(content);
console.log(JSON.stringify(parser.getTokens(), (key, val)=>val, 2))
