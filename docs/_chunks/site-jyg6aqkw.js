import{Yt}from"./site-bs4qmp9a.js";import{He}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class dg extends Yt{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",He)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function pg(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",dg)}
export{dg,pg};

//# debugId=0767DA39D38EF7B364756E2164756E21
//# sourceMappingURL=site-jyg6aqkw.js.map
