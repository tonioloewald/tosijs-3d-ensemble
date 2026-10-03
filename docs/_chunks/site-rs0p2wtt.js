import{Fe}from"./site-x7zr027n.js";import{R}from"./site-0860aw80.js";class bb extends Fe{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",R),this.value=this.registerDataInput("value",R),this.result=this.registerDataOutput("result",R)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{bb};

//# debugId=C2B05C7F0ACD26F564756E2164756E21
//# sourceMappingURL=site-rs0p2wtt.js.map
