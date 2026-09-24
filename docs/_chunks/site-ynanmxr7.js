import{Cu as a}from"./site-4sneyxhq.js";import{Su as o}from"./site-y0mephjk.js";import{lF as l}from"./site-54y5gp1n.js";class r extends a{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",o)}_execute(e,p){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function s(){if(i)return;i=!0,l("FlowGraphFlipFlopBlock",r)}s();
export{r as up,s as vp};

//# debugId=3509E959E477B76B64756E2164756E21
//# sourceMappingURL=site-ynanmxr7.js.map
