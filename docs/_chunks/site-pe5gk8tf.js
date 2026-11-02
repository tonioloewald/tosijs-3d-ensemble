import{Ne}from"./site-4mctpt5x.js";import{R}from"./site-pddhyj91.js";class Ev extends Ne{constructor(t){super(t);this.config=t,this.executionFunction=this.registerDataInput("function",R),this.value=this.registerDataInput("value",R),this.result=this.registerDataOutput("result",R)}_updateOutputs(t){let e=this.executionFunction.getValue(t),u=this.value.getValue(t);if(e)this.result.setValue(e(u,t),t)}getClassName(){return"FlowGraphCodeExecutionBlock"}}
export{Ev};

//# debugId=A91D1ECE90F9AA9164756E2164756E21
//# sourceMappingURL=site-pe5gk8tf.js.map
