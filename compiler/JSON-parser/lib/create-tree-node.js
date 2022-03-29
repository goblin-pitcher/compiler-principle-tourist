const types = require('./types');

const createTreeNode = (type, value, notCheck) => {
  if(!notCheck && !(type in types)) {
    throw TypeError('type类型错误')
  }
  return {
    type,
    value,
    children: []
  }
}

module.exports = createTreeNode;

