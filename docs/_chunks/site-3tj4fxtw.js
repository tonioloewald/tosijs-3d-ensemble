import{Pu,be,si}from"./site-bs4qmp9a.js";import{R}from"./site-f6qdnbcs.js";import{_e}from"./site-hh88thkx.js";import{o}from"./site-3cxcjhqf.js";class rg extends be{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",R,e.type),this.value=this.registerDataOutput("value",R),this.index=this.registerDataInput("index",R,new _e(si(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=Pu(e.assetsContext,s,si(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function sg(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",rg)}
export{rg,sg};

//# debugId=D861F7CBDA09C37264756E2164756E21
//# sourceMappingURL=site-3tj4fxtw.js.map
