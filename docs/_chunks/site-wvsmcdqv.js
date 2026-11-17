import{Ye}from"./site-3s1j98fr.js";import{k}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class U_ extends Ye{constructor(t){super(t);this.count=this.registerDataInput("count",k),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",k)}_execute(t,u){if(u===this.reset){t._setExecutionVariable(this,"debounceCount",0);return}let i=this.count.getValue(t),e=t._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(e,t),t._setExecutionVariable(this,"debounceCount",e),e>=i)this.out._activateSignal(t),t._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var r=!1;function W_(){if(r)return;r=!0,o("FlowGraphDebounceBlock",U_)}
export{U_,W_};

//# debugId=F79423DACBD10FCD64756E2164756E21
//# sourceMappingURL=site-wvsmcdqv.js.map
