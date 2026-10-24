import{He}from"./site-7z4hmt54.js";import{k}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class Hm extends He{constructor(t){super(t);this.count=this.registerDataOutput("count",k),this.reset=this._registerSignalInput("reset")}_execute(t,i){if(i===this.reset){t._setExecutionVariable(this,"count",0),this.count.setValue(0,t);return}let e=t._getExecutionVariable(this,"count",0)+1;t._setExecutionVariable(this,"count",e),this.count.setValue(e,t),this.out._activateSignal(t)}getClassName(){return"FlowGraphCallCounterBlock"}}var r=!1;function Xm(){if(r)return;r=!0,o("FlowGraphCallCounterBlock",Hm)}Xm();
export{Hm,Xm};

//# debugId=61B7594C58246CD664756E2164756E21
//# sourceMappingURL=site-d1pxe7xz.js.map
