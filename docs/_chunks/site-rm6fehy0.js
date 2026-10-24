import{Le}from"./site-7z4hmt54.js";import{w}from"./site-169k801a.js";class bv extends Le{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",w),this.value=this.registerDataInput("value",w),this.result=this.registerDataOutput("result",w)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{bv};

//# debugId=9AD38008629C711664756E2164756E21
//# sourceMappingURL=site-rm6fehy0.js.map
