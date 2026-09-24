import{zu as s}from"./site-s1smryc8.js";import{Ru as i}from"./site-y0mephjk.js";import{lF as o}from"./site-54y5gp1n.js";class u extends s{constructor(t){super(t);this.count=this.registerDataOutput("count",i),this.reset=this._registerSignalInput("reset")}_execute(t,l){if(l===this.reset){t._setExecutionVariable(this,"count",0),this.count.setValue(0,t);return}let e=t._getExecutionVariable(this,"count",0)+1;t._setExecutionVariable(this,"count",e),this.count.setValue(e,t),this.out._activateSignal(t)}getClassName(){return"FlowGraphCallCounterBlock"}}var r=!1;function a(){if(r)return;r=!0,o("FlowGraphCallCounterBlock",u)}a();
export{u as Wr,a as Xr};

//# debugId=ECE65D093E8EF2B064756E2164756E21
//# sourceMappingURL=site-q3xsk6h4.js.map
