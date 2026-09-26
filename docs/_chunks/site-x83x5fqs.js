import{Fe}from"./site-e2p70xxb.js";import{A,Di}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Kd extends Fe{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",Di),this.object=this.registerDataInput("object",A),this.context=this.registerDataInput("context",A,null),this.output=this.registerDataOutput("output",A)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),s=this.context.getValue(t);if(i&&r){let e=i[r];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function Jd(){if(n)return;n=!0,o("FlowGraphFunctionReference",Kd)}Jd();
export{Kd,Jd};

//# debugId=BBEE615C967A856964756E2164756E21
//# sourceMappingURL=site-x83x5fqs.js.map
