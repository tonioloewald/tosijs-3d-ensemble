import{Xe}from"./site-4mctpt5x.js";import{B}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class qm extends Xe{constructor(e){super(e);this.count=this.registerDataInput("count",B),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",B)}_execute(e,u){if(u===this.reset){e._setExecutionVariable(this,"debounceCount",0);return}let i=this.count.getValue(e),t=e._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(t,e),e._setExecutionVariable(this,"debounceCount",t),t>=i)this.out._activateSignal(e),e._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var r=!1;function Zm(){if(r)return;r=!0,o("FlowGraphDebounceBlock",qm)}Zm();
export{qm,Zm};

//# debugId=3347CA86221DA33364756E2164756E21
//# sourceMappingURL=site-jdm5sqkp.js.map
