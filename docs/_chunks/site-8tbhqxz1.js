import{Iu as c}from"./site-rab9t16m.js";import{Nu as e,Ou as u}from"./site-p0rrvqfa.js";import{jF as s}from"./site-6873nq4n.js";class a extends c{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",u),this.object=this.registerDataInput("object",e),this.context=this.registerDataInput("context",e,null),this.output=this.registerDataOutput("output",e)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),f=this.context.getValue(t);if(i&&r){let o=i[r];if(o&&typeof o==="function")this.output.setValue(o.bind(f),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function p(){if(n)return;n=!0,s("FlowGraphFunctionReference",a)}p();
export{a as Kn,p as Ln};

//# debugId=12E8F909DF0CF38564756E2164756E21
//# sourceMappingURL=site-8tbhqxz1.js.map
