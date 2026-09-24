import{zu as i}from"./site-s1smryc8.js";import{Ru as r}from"./site-y0mephjk.js";import{lF as u}from"./site-54y5gp1n.js";class n extends i{constructor(e){super(e);this.count=this.registerDataInput("count",r),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",r)}_execute(e,c){if(c===this.reset){e._setExecutionVariable(this,"debounceCount",0);return}let a=this.count.getValue(e),t=e._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(t,e),e._setExecutionVariable(this,"debounceCount",t),t>=a)this.out._activateSignal(e),e._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var o=!1;function s(){if(o)return;o=!0,u("FlowGraphDebounceBlock",n)}s();
export{n as op,s as pp};

//# debugId=AF5B7DC64A2496F064756E2164756E21
//# sourceMappingURL=site-fnmxag18.js.map
