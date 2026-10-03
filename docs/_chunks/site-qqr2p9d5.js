import{tr}from"./site-x7zr027n.js";import{o}from"./site-j9pt9hg9.js";class ym extends tr{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function Tm(){if(i)return;i=!0,o("FlowGraphSequenceBlock",ym)}Tm();
export{ym,Tm};

//# debugId=84FCB6831C216E5264756E2164756E21
//# sourceMappingURL=site-qqr2p9d5.js.map
