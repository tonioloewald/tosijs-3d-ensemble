import{ir}from"./site-228z8wgn.js";import{o}from"./site-nky97gw9.js";class ym extends ir{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function Tm(){if(i)return;i=!0,o("FlowGraphSequenceBlock",ym)}Tm();
export{ym,Tm};

//# debugId=3C17F168151BBEBF64756E2164756E21
//# sourceMappingURL=site-b4k9zqgp.js.map
