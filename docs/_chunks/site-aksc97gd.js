import{Fe}from"./site-gh92gf7j.js";import{R}from"./site-j8hq6r34.js";class xb extends Fe{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",R),this.value=this.registerDataInput("value",R),this.result=this.registerDataOutput("result",R)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{xb};

//# debugId=9B2F72FD67263A6364756E2164756E21
//# sourceMappingURL=site-aksc97gd.js.map
