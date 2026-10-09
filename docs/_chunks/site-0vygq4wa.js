import{He}from"./site-228z8wgn.js";import{N}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class Hm extends He{constructor(t){super(t);this.count=this.registerDataOutput("count",N),this.reset=this._registerSignalInput("reset")}_execute(t,i){if(i===this.reset){t._setExecutionVariable(this,"count",0),this.count.setValue(0,t);return}let e=t._getExecutionVariable(this,"count",0)+1;t._setExecutionVariable(this,"count",e),this.count.setValue(e,t),this.out._activateSignal(t)}getClassName(){return"FlowGraphCallCounterBlock"}}var r=!1;function Xm(){if(r)return;r=!0,o("FlowGraphCallCounterBlock",Hm)}Xm();
export{Hm,Xm};

//# debugId=D020E7F7C1872DE264756E2164756E21
//# sourceMappingURL=site-0vygq4wa.js.map
