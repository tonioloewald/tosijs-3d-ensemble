import{He}from"./site-gh92gf7j.js";import{N}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Fm extends He{constructor(e){super(e);this.count=this.registerDataInput("count",N),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",N)}_execute(e,u){if(u===this.reset){e._setExecutionVariable(this,"debounceCount",0);return}let i=this.count.getValue(e),t=e._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(t,e),e._setExecutionVariable(this,"debounceCount",t),t>=i)this.out._activateSignal(e),e._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var r=!1;function km(){if(r)return;r=!0,o("FlowGraphDebounceBlock",Fm)}km();
export{Fm,km};

//# debugId=B92F80A0C1E7777764756E2164756E21
//# sourceMappingURL=site-c4zse9m5.js.map
