import{Fe}from"./site-e2p70xxb.js";import{A}from"./site-pb29jqm8.js";class xb extends Fe{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",A),this.value=this.registerDataInput("value",A),this.result=this.registerDataOutput("result",A)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{xb};

//# debugId=6D4502D1C10148CB64756E2164756E21
//# sourceMappingURL=site-w4bdjde3.js.map
