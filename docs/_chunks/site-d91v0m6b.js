import{sr}from"./site-dkd9tveg.js";import{Ye}from"./site-jw81twe3.js";import{o}from"./site-mkftt73g.js";class _m extends sr{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",Ye)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function xm(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",_m)}xm();
export{_m,xm};

//# debugId=37B859C6ED7F0AF264756E2164756E21
//# sourceMappingURL=site-d91v0m6b.js.map
