const types = require("../types");
const { watcher, undoFunc } = require("../utils");

class StateMachine {
  constructor(visitor = () => null) {
    this.visitor = visitor;
    this.value = "";
    this.funcMap = new WeakMap([
      [
        this.numberHandler,
        {
          name: types.NUMBER.value,
          handler(val) {
            return +val;
          },
        },
      ],
      [this.punctuatorHandler, types.PUNCTUATOR.value],
    ]);
    this.handlerUpdate = watcher(this.state, (newVal) => {
      if (newVal !== this.state) {
        this.stop();
      } else {
        this.stop(true);
      }
    });
  }

  state = (c) => {
    if (!c || /\s/.test(c)) return this.state;
    if (types.NUMBER.reg.test(c)) {
      return this.numberHandler(c);
    }
    if (types.PUNCTUATOR.reg.test(c)) {
      return this.punctuatorHandler(c);
    }
    return this.state;
  };

  stop(hard) {
    const args = this.analysisValPicker();
    if (!hard && args && args.length) {
      this.visitor(...args);
    }
    this.value = "";
  }

  analysisValPicker() {
    const funcVal = this.handlerUpdate.getVal();
    if (this.funcMap.has(funcVal)) {
      let info = this.funcMap.get(funcVal);
      if (typeof info === "string") {
        info = { name: info };
      }
      const handler = info.handler || undoFunc;
      return [info.name, handler(this.value)];
    }
    return [];
  }
  numberHandler(c) {
    this.handlerUpdate(this.numberHandler);
    this.value += c;
    return this.state;
  }
  punctuatorHandler(c) {
    this.handlerUpdate(this.punctuatorHandler);
    this.value += c;
    return this.state;
  }
}

module.exports = StateMachine;
