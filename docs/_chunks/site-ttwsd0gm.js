import{Yt}from"./site-3s1j98fr.js";import{He}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class d_ extends Yt{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",He)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function p_(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",d_)}
export{d_,p_};

//# debugId=D5995BEB49BBCC5964756E2164756E21
//# sourceMappingURL=site-ttwsd0gm.js.map
