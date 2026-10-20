import{Le}from"./site-3hrxh888.js";import{w,Ye}from"./site-phrx5rwy.js";import{o}from"./site-300ftf42.js";class tm extends Le{constructor(t){super(t);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this.registerDataInput("onTrue",w),this.onFalse=this.registerDataInput("onFalse",w),this.output=this.registerDataOutput("output",w)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function im(){if(e)return;e=!0,o("FlowGraphConditionalBlock",tm)}im();
export{tm,im};

//# debugId=BE083B63CF4CD19064756E2164756E21
//# sourceMappingURL=site-mzny50kp.js.map
