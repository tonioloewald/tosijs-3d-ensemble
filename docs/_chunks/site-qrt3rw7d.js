import{Fe}from"./site-x7zr027n.js";import{R,Di}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class rp extends Fe{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",Di),this.object=this.registerDataInput("object",R),this.context=this.registerDataInput("context",R,null),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let r=this.functionName.getValue(t),i=this.object.getValue(t),s=this.context.getValue(t);if(i&&r){let e=i[r];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var n=!1;function sp(){if(n)return;n=!0,o("FlowGraphFunctionReference",rp)}sp();
export{rp,sp};

//# debugId=ADFE6E496DAC216664756E2164756E21
//# sourceMappingURL=site-qrt3rw7d.js.map
