import{Le}from"./site-228z8wgn.js";import{R,Pi}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class rp extends Le{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",Pi),this.object=this.registerDataInput("object",R),this.context=this.registerDataInput("context",R,null),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),s=this.context.getValue(t);if(i&&r){let e=i[r];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function sp(){if(n)return;n=!0,o("FlowGraphFunctionReference",rp)}sp();
export{rp,sp};

//# debugId=80422AD65E26CD8764756E2164756E21
//# sourceMappingURL=site-2pv3qww2.js.map
