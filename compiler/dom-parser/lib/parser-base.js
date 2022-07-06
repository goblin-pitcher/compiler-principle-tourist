class ParserBase {
  constructor(str) {
    this.str = str;
    this.index = 0;
    this._init();
  }
  _init() {
    this.gotoNonBlankIndex();
  }
  getNextIndex(rule) {
    const checkRule =
      typeof rule === "string" ? (s) => s === rule : (s) => rule.test(s);
    let index = this.index;
    while (this.str[index]) {
      if (checkRule(this.str[index])) {
        return index;
      }
      index++;
    }
    this.index = -1;
  }
  getNextNonBlankIndex() {
    const index = this.getNextIndex(/\S/);
    if (index < 0) {
      throw new Error("字符串为空");
    }
    return index;
  }
  gotoNonBlankIndex() {
    this.index = this.getNextNonBlankIndex();
  }
}
module.exports = ParserBase;
