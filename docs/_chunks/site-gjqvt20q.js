import{Cu as n}from"./site-4sneyxhq.js";import{lF as s}from"./site-54y5gp1n.js";class o extends n{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function l(){if(i)return;i=!0,s("FlowGraphSequenceBlock",o)}l();
export{o as Ap,l as Bp};

//# debugId=B906112873638E7264756E2164756E21
//# sourceMappingURL=site-gjqvt20q.js.map
