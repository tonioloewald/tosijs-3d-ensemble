import{ir}from"./site-3q4gqkf5.js";import{Ye}from"./site-9g37ftzw.js";import{o}from"./site-16qs5rck.js";class _m extends ir{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",Ye)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function xm(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",_m)}xm();
export{_m,xm};

//# debugId=A7D6CB56A913160A64756E2164756E21
//# sourceMappingURL=site-zjvmvts1.js.map
