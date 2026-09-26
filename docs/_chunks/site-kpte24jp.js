import{er}from"./site-e2p70xxb.js";import{Ye}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Um extends er{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",Ye)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function Wm(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",Um)}Wm();
export{Um,Wm};

//# debugId=28BEA4A09084466964756E2164756E21
//# sourceMappingURL=site-kpte24jp.js.map
