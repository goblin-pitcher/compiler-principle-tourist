### 编译原理--整数运算的解析器

练习项目

````javascript
const Tokenizer = require('./lib/Tokenizer');
const tokenizer = new Tokenizer();
/*
* [
*  { type: 'Number', value: '10' },
*  { type: 'Punctuator', value: '%' },
*  { type: 'Number', value: '20' }
* ] 
*/
console.log(tokenizer.analysis('10 % 20'))
````

