import{ir}from"./site-3q4gqkf5.js";import{o}from"./site-16qs5rck.js";class ym extends ir{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function Tm(){if(i)return;i=!0,o("FlowGraphSequenceBlock",ym)}Tm();
export{ym,Tm};

//# debugId=3C17F168151BBEBF64756E2164756E21
//# sourceMappingURL=site-3eprc2dj.js.map
