import{sr}from"./site-enc8r1rf.js";import{o}from"./site-whc0p6f0.js";class ym extends sr{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function Tm(){if(i)return;i=!0,o("FlowGraphSequenceBlock",ym)}Tm();
export{ym,Tm};

//# debugId=C2BE78C744C9FEE864756E2164756E21
//# sourceMappingURL=site-1za0fkt1.js.map
