import{He}from"./site-x7zr027n.js";import{N}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class $m extends He{constructor(e){super(e);this.count=this.registerDataInput("count",N),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",N)}_execute(e,u){if(u===this.reset){e._setExecutionVariable(this,"debounceCount",0);return}let i=this.count.getValue(e),t=e._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(t,e),e._setExecutionVariable(this,"debounceCount",t),t>=i)this.out._activateSignal(e),e._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var r=!1;function Ym(){if(r)return;r=!0,o("FlowGraphDebounceBlock",$m)}Ym();
export{$m,Ym};

//# debugId=8CA5722288B685B364756E2164756E21
//# sourceMappingURL=site-mszyjhhf.js.map
