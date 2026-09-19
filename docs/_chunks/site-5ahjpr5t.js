import{Au as a}from"./site-ngcb07t9.js";import{Qu as o}from"./site-p0rrvqfa.js";import{jF as l}from"./site-6873nq4n.js";class r extends a{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",o)}_execute(e,p){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function s(){if(i)return;i=!0,l("FlowGraphFlipFlopBlock",r)}s();
export{r as sp,s as tp};

//# debugId=B5DB076D8B1F4EA664756E2164756E21
//# sourceMappingURL=site-5ahjpr5t.js.map
