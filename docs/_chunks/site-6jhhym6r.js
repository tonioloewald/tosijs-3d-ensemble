import{be}from"./site-3s1j98fr.js";import{A,oi}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class qm extends be{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",oi),this.object=this.registerDataInput("object",A),this.context=this.registerDataInput("context",A,null),this.output=this.registerDataOutput("output",A)}_updateOutputs(t){let i=this.functionName.getValue(t),n=this.object.getValue(t),s=this.context.getValue(t);if(n&&i){let e=n[i];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var r=!1;function Km(){if(r)return;r=!0,o("FlowGraphFunctionReference",qm)}
export{qm,Km};

//# debugId=2CEDAFBDAAD1FE3C64756E2164756E21
//# sourceMappingURL=site-6jhhym6r.js.map
