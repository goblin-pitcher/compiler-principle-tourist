const ParserBase = require("./parser-base");
const { createDefToken } = require("./types");
/**
 * 注意：：暂未处理自闭合标签
 */
class Parser extends ParserBase {
  constructor(str) {
    super(str);
    this.root = createDefToken();
    this.parse();
  }
  get activeWord() {
    return this.str[this.index];
  }
  get nextWord() {
    return this.str[this.index + 1];
  }
  get nextNonBlankWord() {
    const index = this.getNextNonBlankIndex();
    return this.str[index];
  }
  parse() {
    this.parseElement(this.root);
  }
  getTokens() {
    return this.root.children;
  }
  parseValue(testFunc) {
    const startIdx = this.index;
    let name = "";
    while (testFunc(this.activeWord)) {
      name += this.activeWord;
      this.index++;
    }
    return name;
  }
  getEleName() {
    const testFunc = (c) => !/\s|>|\//.test(c);
    return this.parseValue(testFunc);
  }
  getAttrName() {
    const testFunc = (c) => !/\s|=/.test(c);
    return this.parseValue(testFunc);
  }
  getAttrValue() {
    const checkSign = this.activeWord;
    if (['"', "'"].includes(checkSign)) {
      this.index++;
      const testFunc = (c) => c !== checkSign;
      const value = this.parseValue(testFunc);
      this.index++;
      return value;
    }
    const testFunc = (c) => /\S/.test(c);
    return this.parseValue(testFunc);
  }
  getText() {
    const testFunc = (c) => c !== "<";
    return this.parseValue(testFunc);
  }
  checkEndElement(name) {
    if (this.activeWord !== "<" || this.nextWord !== "/") {
      throw new Error("元素终结符格式错误");
    }
    this.index += 2;
    const endName = this.getEleName();
    if (name !== endName) {
      throw new Error("元素终结符名字错误");
    }
    this.gotoNonBlankIndex();
    if (this.activeWord !== ">") {
      throw new Error("终结元素没有反括号>");
    }
    this.index++;
  }
  parseElement(parentEle) {
    this.gotoNonBlankIndex();
    if (this.activeWord !== "<" || this.nextNonBlankWord === "/") {
      throw new Error("元素名错误");
    }
    this.index++;
    const eleName = this.getEleName();
    const defToken = createDefToken();
    defToken.value = eleName;
    this.parseAttr(defToken);
    if (this.activeWord === "/") {
      this.index++;
      if (this.activeWord !== ">") {
        throw new Error("/>不能有间隔");
      }
      this.index++;
    } else {
      this.index++;
      this.parseChildren(defToken);
      this.checkEndElement(eleName);
    }
    parentEle.children.push(defToken);
  }
  parseChildren(parentEle) {
    if (this.activeWord === "<") {
      if (this.nextWord === "/") return;
      this.parseElement(parentEle);
    } else {
      const value = this.getText();
      parentEle.children.push(value);
    }
    this.parseChildren(parentEle);
  }
  parseAttr(parentEle) {
    this.gotoNonBlankIndex();
    if (["/", ">"].includes(this.activeWord)) return;
    const name = this.getAttrName();
    this.gotoNonBlankIndex();
    if (this.activeWord !== "=") {
      throw new Error(`请检查${name}属性格式`);
    }
    this.index++;
    this.gotoNonBlankIndex();
    if (name === "style") {
      this.parseStyle(parentEle);
    } else {
      const value = this.getAttrValue();
      parentEle.attrObj.value[name] = value;
    }
    this.parseAttr(parentEle);
  }
  parseStyle(parentEle) {
    this.gotoNonBlankIndex();
    const styleStr = this.getAttrValue();
    const keyValuePair = styleStr
      .split(";")
      .map((str) => str.split(":").map((item) => item.trim()));
    const styleObjVal = keyValuePair.reduce((obj, pair) => {
      if (pair[0]) {
        obj[pair[0]] = pair[1];
      }
      return obj;
    }, {});
    parentEle.styleObj.value = styleObjVal;
  }
}
module.exports = Parser;
