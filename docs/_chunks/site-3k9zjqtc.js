import{Le}from"./site-228z8wgn.js";import{R}from"./site-qrpgd9aj.js";class bb extends Le{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",R),this.value=this.registerDataInput("value",R),this.result=this.registerDataOutput("result",R)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{bb};

//# debugId=5D7B0F7DF22140CE64756E2164756E21
//# sourceMappingURL=site-3k9zjqtc.js.map
