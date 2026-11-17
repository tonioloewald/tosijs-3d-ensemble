import{be}from"./site-3s1j98fr.js";import{A}from"./site-2m9hnh4q.js";class ST extends be{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",A),this.value=this.registerDataInput("value",A),this.result=this.registerDataOutput("result",A)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{ST};

//# debugId=86D9A054EE1E4FA264756E2164756E21
//# sourceMappingURL=site-rhrmsxbv.js.map
