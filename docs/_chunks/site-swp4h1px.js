import{Iu as s}from"./site-rab9t16m.js";import{Nu as e}from"./site-p0rrvqfa.js";class r extends s{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",e),this.value=this.registerDataInput("value",e),this.result=this.registerDataOutput("result",e)}_updateOutputs(t){let u=this.executionFunction.getValue(t),i=this.value.getValue(t);if(u)this.result.setValue(u(i,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{r as Hn};

//# debugId=FBC28FC86F0D9E0B64756E2164756E21
//# sourceMappingURL=site-swp4h1px.js.map
