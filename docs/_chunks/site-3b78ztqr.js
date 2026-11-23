import{be}from"./site-bs4qmp9a.js";import{R,ai}from"./site-f6qdnbcs.js";import{_e}from"./site-hh88thkx.js";import{o}from"./site-3cxcjhqf.js";class jm extends be{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",R),this.array=this.registerDataInput("array",R),this.index=this.registerDataOutput("index",ai,new _e(-1))}_updateOutputs(e){let i=this.object.getValue(e),t=this.array.getValue(e);if(t)this.index.setValue(new _e(t.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var r=!1;function Qm(){if(r)return;r=!0,o("FlowGraphIndexOfBlock",jm)}
export{jm,Qm};

//# debugId=81B348DAB215154264756E2164756E21
//# sourceMappingURL=site-3b78ztqr.js.map
