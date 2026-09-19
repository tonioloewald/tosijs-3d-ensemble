import{xu as s}from"./site-gx4ww0cp.js";import{Pu as i}from"./site-p0rrvqfa.js";import{jF as o}from"./site-6873nq4n.js";class u extends s{constructor(t){super(t);this.count=this.registerDataOutput("count",i),this.reset=this._registerSignalInput("reset")}_execute(t,l){if(l===this.reset){t._setExecutionVariable(this,"count",0),this.count.setValue(0,t);return}let e=t._getExecutionVariable(this,"count",0)+1;t._setExecutionVariable(this,"count",e),this.count.setValue(e,t),this.out._activateSignal(t)}getClassName(){return"FlowGraphCallCounterBlock"}}var r=!1;function a(){if(r)return;r=!0,o("FlowGraphCallCounterBlock",u)}a();
export{u as Ur,a as Vr};

//# debugId=32B28986C99E3D4964756E2164756E21
//# sourceMappingURL=site-qngcrtfa.js.map
