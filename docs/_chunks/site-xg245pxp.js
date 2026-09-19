import{xu as i}from"./site-gx4ww0cp.js";import{Pu as r}from"./site-p0rrvqfa.js";import{jF as u}from"./site-6873nq4n.js";class n extends i{constructor(e){super(e);this.count=this.registerDataInput("count",r),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",r)}_execute(e,c){if(c===this.reset){e._setExecutionVariable(this,"debounceCount",0);return}let a=this.count.getValue(e),t=e._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(t,e),e._setExecutionVariable(this,"debounceCount",t),t>=a)this.out._activateSignal(e),e._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var o=!1;function s(){if(o)return;o=!0,u("FlowGraphDebounceBlock",n)}s();
export{n as mp,s as np};

//# debugId=38F1C6DD840C40BF64756E2164756E21
//# sourceMappingURL=site-xg245pxp.js.map
