const types = require('./types');
const createTreeNode = require('./create-tree-node');
const { gotoUntil } = require('./utils')

class Parser {
  constructor(str) {
    this.str = str;
    this.root = createTreeNode('root', undefined, true);
    this._parseValue(0, this.root);
  }
  getTree() {
    return this.root.children[0];
  }
  _gotoValidate(fromIdx) {
    const end = this.str.length;
    const checkContinue = (fromIdx)=>{
      return fromIdx<end && /\s/.test(this.str[fromIdx])
    }
    while(checkContinue(fromIdx)) {
      fromIdx++
    }
    if(fromIdx>=end) {
      throw TypeError('解析类型错误')
    }
    return fromIdx
  }
  _tapNextValidate(fromIdx) {
    const idx = this._gotoValidate(fromIdx)
    return {
      index: idx,
      value: this.str[idx]
    }
  }
  _checkValue(index, val) {
    const idx = gotoUntil(this.str, val, index, index+1)
    if(idx<0) {
      throw TypeError('解析类型错误');
    }
    return true
  }
  _parseObject(index, parentNode) {
    index = this._gotoValidate(index);
    this._checkValue(index, "{")
    const objNode = createTreeNode(types.OBJECT)
    index++
    index = this._parsePair(index, objNode)
    index = this._gotoValidate(index);
    this._checkValue(index, "}")
    parentNode.children.push(objNode)
    return ++index
  }
  _parseArray(index, parentNode) {
    index = this._gotoValidate(index);
    this._checkValue(index, "[")
    const arrNode = createTreeNode(types.ARRAY)
    index++
    const newIdx = this._parseValue(index, arrNode)
    if(newIdx<0) {
      this._checkValue(index, ']')
      return ++index
    }
    const {value: nextVal, index: nextIdx} = this._tapNextValidate(newIdx);
    if(nextVal === ',') {
      index = this._parseValue(nextVal, arrNode)
    } else if(nextVal === ']') {
      return nextVal + 1
    }
    throw TypeError('解析类型错误');
  }
  _parsePair(index, parentNode) {
    index = this._gotoValidate(index);
    const pairNode = createTreeNode(types.PAIR);
    index = this._parseString(index, pairNode)
    index = this._gotoValidate(index);
    this._checkValue(index, ":")
    index++
    index = this._parseValue(index, pairNode);
    parentNode.children.push(pairNode);
    const {value: nextVal, index: nextIdx} = this._tapNextValidate(index);
    if(nextVal === ',') {
      index = this._parsePair(nextIdx+1, parentNode)
    } else {
      index = nextIdx
    }
    return index
  }
  _parseString(index, parentNode) {
    index = this._gotoValidate(index);
    this._checkValue(index, '"')
    const fromIdx = index;
    index++
    let endIdx = gotoUntil(this.str, '"', index);
    while(this.str[endIdx-1] === "\\") {
      endIdx = gotoUntil(this.str, '"', endIdx+1);
    }
    if(endIdx<0) throw TypeError('解析类型错误');
    index = endIdx+1
    const strNode = createTreeNode(types.STRINGLITY, this.str.substring(fromIdx, index))
    parentNode.children.push(strNode);
    return index
  }
  _parseNumber(index, parentNode) {
    index = this._gotoValidate(index);
    this._checkValue(index, /\d/)
    const idx = gotoUntil(this.str, /[^\d.]/,index)
    if(endIdx<0) throw TypeError('解析类型错误');
    const value = this.str.substring(index, idx);
    const numNode = createTreeNode(types.NUMBER, +value)
    parentNode.children.push(numNode)
    return idx
  }

  _parseValue(index, parentNode) {
    const {index: nextIdx,value: nextVal} = this._tapNextValidate(index);
    if(nextVal === '[') {
      return this._parseArray(nextIdx, parentNode)
    } else if (nextVal === '{') {
      return this._parseObject(nextIdx, parentNode)
    } else if (nextVal === '"') {
      return this._parseString(nextIdx, parentNode)
    } else if (/\d/.test(nextVal)) {
      return this._parseNumber(nextIdx, parentNode)
    }
    return -1
  }
}
module.exports = Parser