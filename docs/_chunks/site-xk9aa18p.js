import{He}from"./site-e2p70xxb.js";import{N}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Fm extends He{constructor(e){super(e);this.count=this.registerDataInput("count",N),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",N)}_execute(e,u){if(u===this.reset){e._setExecutionVariable(this,"debounceCount",0);return}let i=this.count.getValue(e),t=e._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(t,e),e._setExecutionVariable(this,"debounceCount",t),t>=i)this.out._activateSignal(e),e._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var r=!1;function Bm(){if(r)return;r=!0,o("FlowGraphDebounceBlock",Fm)}Bm();
export{Fm,Bm};

//# debugId=B8FAA4D295FDF80464756E2164756E21
//# sourceMappingURL=site-xk9aa18p.js.map
