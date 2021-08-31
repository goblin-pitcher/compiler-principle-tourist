const watcher = (val, cb) => {
  let oldVal = val;
  const update = (newVal) => {
    if (newVal !== oldVal) {
      cb(newVal, oldVal);
    }
    oldVal = newVal;
  };
  update.getVal = ()=>oldVal;
  return update;
};

exports.watcher = watcher;
