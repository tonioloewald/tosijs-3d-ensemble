import{Ye}from"./site-bs4qmp9a.js";import{B}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class Ug extends Ye{constructor(t){super(t);this.count=this.registerDataInput("count",B),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",B)}_execute(t,u){if(u===this.reset){t._setExecutionVariable(this,"debounceCount",0);return}let i=this.count.getValue(t),e=t._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(e,t),t._setExecutionVariable(this,"debounceCount",e),e>=i)this.out._activateSignal(t),t._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var r=!1;function Wg(){if(r)return;r=!0,o("FlowGraphDebounceBlock",Ug)}
export{Ug,Wg};

//# debugId=61841EC49041BDD864756E2164756E21
//# sourceMappingURL=site-x29tt85n.js.map
