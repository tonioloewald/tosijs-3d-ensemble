import{Le}from"./site-vc4knhgc.js";import{w}from"./site-1fkjz1t9.js";class b0 extends Le{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",w),this.value=this.registerDataInput("value",w),this.result=this.registerDataOutput("result",w)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{b0};

//# debugId=FBEA7689102592DF64756E2164756E21
//# sourceMappingURL=site-yycathb4.js.map
