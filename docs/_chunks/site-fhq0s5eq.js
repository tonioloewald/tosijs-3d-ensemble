import{tr}from"./site-gh92gf7j.js";import{Ye}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Um extends tr{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",Ye)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function Wm(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",Um)}Wm();
export{Um,Wm};

//# debugId=096F9F6A0F78D31464756E2164756E21
//# sourceMappingURL=site-fhq0s5eq.js.map
