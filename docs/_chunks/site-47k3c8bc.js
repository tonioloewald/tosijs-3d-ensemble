import{Xe}from"./site-4mctpt5x.js";import{B}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class jm extends Xe{constructor(t){super(t);this.count=this.registerDataOutput("count",B),this.reset=this._registerSignalInput("reset")}_execute(t,i){if(i===this.reset){t._setExecutionVariable(this,"count",0),this.count.setValue(0,t);return}let e=t._getExecutionVariable(this,"count",0)+1;t._setExecutionVariable(this,"count",e),this.count.setValue(e,t),this.out._activateSignal(t)}getClassName(){return"FlowGraphCallCounterBlock"}}var r=!1;function Qm(){if(r)return;r=!0,o("FlowGraphCallCounterBlock",jm)}Qm();
export{jm,Qm};

//# debugId=032C9F6CD5DF7F2364756E2164756E21
//# sourceMappingURL=site-47k3c8bc.js.map
