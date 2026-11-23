import{be}from"./site-bs4qmp9a.js";import{R}from"./site-f6qdnbcs.js";class ST extends be{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",R),this.value=this.registerDataInput("value",R),this.result=this.registerDataOutput("result",R)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{ST};

//# debugId=D253AE5046BA289664756E2164756E21
//# sourceMappingURL=site-qjm25wm4.js.map
