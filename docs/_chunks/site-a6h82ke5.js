import{Fe}from"./site-gh92gf7j.js";import{R,Di}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Kd extends Fe{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",Di),this.object=this.registerDataInput("object",R),this.context=this.registerDataInput("context",R,null),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),s=this.context.getValue(t);if(i&&r){let e=i[r];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function Jd(){if(n)return;n=!0,o("FlowGraphFunctionReference",Kd)}Jd();
export{Kd,Jd};

//# debugId=1CA3E8560E78237C64756E2164756E21
//# sourceMappingURL=site-a6h82ke5.js.map
