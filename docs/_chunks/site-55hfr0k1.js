import{ir}from"./site-228z8wgn.js";import{Ye}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class _m extends ir{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",Ye)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function xm(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",_m)}xm();
export{_m,xm};

//# debugId=A7D6CB56A913160A64756E2164756E21
//# sourceMappingURL=site-55hfr0k1.js.map
