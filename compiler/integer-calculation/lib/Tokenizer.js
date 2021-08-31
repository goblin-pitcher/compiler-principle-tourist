const StateMachine = require('./StateMachine');

class Tokenizer {
  constructor(lifeCycle={}) {
    this.tokens = []
    this.tokenTemp = Object.freeze({type: '', value: null});
    this.lifeCycle = lifeCycle;
    this.stateMachine = new StateMachine(this.visitor);
  }
  visitor = (name, value) => {
    const token = {...this.tokenTemp, type: name, value};
    this.tokens.push(token);
    if(this.lifeCycle[name]) {
      this.lifeCycle[name](token)
    }
  }
  analysis(ipt) {
    let currentState = this.stateMachine.state()
    for(let c of ipt) {
      currentState = currentState(c)
    }
    this.stateMachine.stop();
    return this.tokens
  }
  clear() {
    this.tokens = []
  }
}

module.exports = Tokenizer;