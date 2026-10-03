import{tr}from"./site-x7zr027n.js";import{Ye}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class _m extends tr{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",Ye)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function xm(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",_m)}xm();
export{_m,xm};

//# debugId=53FCD27679EE4F1264756E2164756E21
//# sourceMappingURL=site-76e23ktt.js.map
