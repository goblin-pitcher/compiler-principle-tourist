const isDef = (val)=>!!(val||val===0)
const gotoUntil = (str, val, fromIdx, endIndex) => {
  let checkValidate = (c)=>c===val
  if(val instanceof RegExp) {
    checkValidate = (c)=>val.test(c)
  }else if(Array.isArray(val)) {
    checkValidate = (c)=>val.includes(c)
  }
  const end = isDef(endIndex) ? endIndex : str.length;
  while(fromIdx<end) {
    if(checkValidate(str[fromIdx])) return fromIdx
    fromIdx++
  }
  return -1
}

exports.gotoUntil = gotoUntil