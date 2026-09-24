import{Ku as c}from"./site-18c2qzzn.js";import{Pu as e,Qu as u}from"./site-y0mephjk.js";import{lF as s}from"./site-54y5gp1n.js";class a extends c{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",u),this.object=this.registerDataInput("object",e),this.context=this.registerDataInput("context",e,null),this.output=this.registerDataOutput("output",e)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),f=this.context.getValue(t);if(i&&r){let o=i[r];if(o&&typeof o==="function")this.output.setValue(o.bind(f),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function p(){if(n)return;n=!0,s("FlowGraphFunctionReference",a)}p();
export{a as Mn,p as Nn};

//# debugId=7098B518E8007BC464756E2164756E21
//# sourceMappingURL=site-sq80zt4h.js.map
