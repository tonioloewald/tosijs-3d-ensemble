import{be}from"./site-bs4qmp9a.js";import{R,oi}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class qm extends be{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",oi),this.object=this.registerDataInput("object",R),this.context=this.registerDataInput("context",R,null),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let i=this.functionName.getValue(t),n=this.object.getValue(t),s=this.context.getValue(t);if(n&&i){let e=n[i];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var r=!1;function Zm(){if(r)return;r=!0,o("FlowGraphFunctionReference",qm)}
export{qm,Zm};

//# debugId=B610CE453183CD9D64756E2164756E21
//# sourceMappingURL=site-b9nvet3b.js.map
