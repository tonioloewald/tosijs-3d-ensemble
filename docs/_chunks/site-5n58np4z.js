import{He}from"./site-gh92gf7j.js";import{N}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Lm extends He{constructor(t){super(t);this.count=this.registerDataOutput("count",N),this.reset=this._registerSignalInput("reset")}_execute(t,i){if(i===this.reset){t._setExecutionVariable(this,"count",0),this.count.setValue(0,t);return}let e=t._getExecutionVariable(this,"count",0)+1;t._setExecutionVariable(this,"count",e),this.count.setValue(e,t),this.out._activateSignal(t)}getClassName(){return"FlowGraphCallCounterBlock"}}var r=!1;function Nm(){if(r)return;r=!0,o("FlowGraphCallCounterBlock",Lm)}Nm();
export{Lm,Nm};

//# debugId=9D2D55A221CA8AC164756E2164756E21
//# sourceMappingURL=site-5n58np4z.js.map
