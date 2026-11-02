import{Ne}from"./site-4mctpt5x.js";import{R,Li}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class ap extends Ne{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",Li),this.object=this.registerDataInput("object",R),this.context=this.registerDataInput("context",R,null),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),s=this.context.getValue(t);if(i&&r){let e=i[r];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function lp(){if(n)return;n=!0,o("FlowGraphFunctionReference",ap)}lp();
export{ap,lp};

//# debugId=510BB288CAF467C864756E2164756E21
//# sourceMappingURL=site-g3zyzmj2.js.map
