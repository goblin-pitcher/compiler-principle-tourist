const typeEnum = {
  element: "ELEMENT",
  attr: "ATTR",
  style: "STYLE",
};

const createDefToken = (type = typeEnum.element) => {
  const defToken = {
    type,
    value: "",
  };
  if (type === typeEnum.element) {
    defToken.attrObj = createDefToken(typeEnum.attr);
    defToken.styleObj = createDefToken(typeEnum.style);
    defToken.children = [];
  } else {
    defToken.value = {};
  }
  return defToken;
};

exports.typeEnum = typeEnum;
exports.createDefToken = createDefToken;
