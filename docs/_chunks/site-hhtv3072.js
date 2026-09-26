import{er}from"./site-e2p70xxb.js";import{o}from"./site-jv0cbgr5.js";class gm extends er{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function xm(){if(i)return;i=!0,o("FlowGraphSequenceBlock",gm)}xm();
export{gm,xm};

//# debugId=5663A0A21E04201D64756E2164756E21
//# sourceMappingURL=site-hhtv3072.js.map
