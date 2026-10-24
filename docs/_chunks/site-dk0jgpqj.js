import{He}from"./site-7z4hmt54.js";import{k}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class $m extends He{constructor(e){super(e);this.count=this.registerDataInput("count",k),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",k)}_execute(e,u){if(u===this.reset){e._setExecutionVariable(this,"debounceCount",0);return}let i=this.count.getValue(e),t=e._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(t,e),e._setExecutionVariable(this,"debounceCount",t),t>=i)this.out._activateSignal(e),e._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var r=!1;function Ym(){if(r)return;r=!0,o("FlowGraphDebounceBlock",$m)}Ym();
export{$m,Ym};

//# debugId=A33389B466425BC364756E2164756E21
//# sourceMappingURL=site-dk0jgpqj.js.map
