import{Le}from"./site-0215gf70.js";import{w,Di}from"./site-afz29jnp.js";import{o}from"./site-ky7rmxkt.js";class rp extends Le{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",Di),this.object=this.registerDataInput("object",w),this.context=this.registerDataInput("context",w,null),this.output=this.registerDataOutput("output",w)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),s=this.context.getValue(t);if(i&&r){let e=i[r];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function sp(){if(n)return;n=!0,o("FlowGraphFunctionReference",rp)}sp();
export{rp,sp};

//# debugId=D2349A7B6347481464756E2164756E21
//# sourceMappingURL=site-vkdhg9na.js.map
