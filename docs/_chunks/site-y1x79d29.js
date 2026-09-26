import{He}from"./site-e2p70xxb.js";import{N}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Lm extends He{constructor(t){super(t);this.count=this.registerDataOutput("count",N),this.reset=this._registerSignalInput("reset")}_execute(t,i){if(i===this.reset){t._setExecutionVariable(this,"count",0),this.count.setValue(0,t);return}let e=t._getExecutionVariable(this,"count",0)+1;t._setExecutionVariable(this,"count",e),this.count.setValue(e,t),this.out._activateSignal(t)}getClassName(){return"FlowGraphCallCounterBlock"}}var r=!1;function Nm(){if(r)return;r=!0,o("FlowGraphCallCounterBlock",Lm)}Nm();
export{Lm,Nm};

//# debugId=9D2D55A221CA8AC164756E2164756E21
//# sourceMappingURL=site-y1x79d29.js.map
