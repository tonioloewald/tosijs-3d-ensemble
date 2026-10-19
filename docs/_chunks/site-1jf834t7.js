import{Le}from"./site-403rb1zc.js";import{w,Di}from"./site-1yfx1bcx.js";import{o}from"./site-wmfzbjvy.js";class rp extends Le{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",Di),this.object=this.registerDataInput("object",w),this.context=this.registerDataInput("context",w,null),this.output=this.registerDataOutput("output",w)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),s=this.context.getValue(t);if(i&&r){let e=i[r];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function sp(){if(n)return;n=!0,o("FlowGraphFunctionReference",rp)}sp();
export{rp,sp};

//# debugId=D2349A7B6347481464756E2164756E21
//# sourceMappingURL=site-1jf834t7.js.map
