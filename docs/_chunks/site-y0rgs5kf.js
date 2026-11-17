import{Yt}from"./site-3s1j98fr.js";import{o}from"./site-ny31phz1.js";class x_ extends Yt{constructor(e){super(e);this.config=e,this.executionSignals=[],this.setNumberOfOutputSignals(this.config.outputSignalCount)}_execute(e){for(let t=0;t<this.executionSignals.length;t++)this.executionSignals[t]._activateSignal(e)}setNumberOfOutputSignals(e=1){while(this.executionSignals.length>e){let t=this.executionSignals.pop();if(t)t.disconnectFromAll(),this._unregisterSignalOutput(t.name)}while(this.executionSignals.length<e)this.executionSignals.push(this._registerSignalOutput(`out_${this.executionSignals.length}`))}getClassName(){return"FlowGraphSequenceBlock"}}var i=!1;function v_(){if(i)return;i=!0,o("FlowGraphSequenceBlock",x_)}
export{x_,v_};

//# debugId=6EA63A38CC7247FE64756E2164756E21
//# sourceMappingURL=site-y0rgs5kf.js.map
