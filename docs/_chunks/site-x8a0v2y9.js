import{tr}from"./site-gh92gf7j.js";import{o}from"./site-jx9g7gwh.js";class _m extends tr{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function xm(){if(i)return;i=!0,o("FlowGraphSequenceBlock",_m)}xm();
export{_m,xm};

//# debugId=C8918C172B209C0564756E2164756E21
//# sourceMappingURL=site-x8a0v2y9.js.map
