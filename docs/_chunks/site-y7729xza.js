import{nr}from"./site-4mctpt5x.js";import{o}from"./site-8nsc0rx2.js";class Em extends nr{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function wm(){if(i)return;i=!0,o("FlowGraphSequenceBlock",Em)}wm();
export{Em,wm};

//# debugId=BBFF4E2010725B6364756E2164756E21
//# sourceMappingURL=site-y7729xza.js.map
