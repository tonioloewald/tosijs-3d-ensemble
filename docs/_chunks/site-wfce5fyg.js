import{bc,Ne,jt}from"./site-4mctpt5x.js";import{R}from"./site-pddhyj91.js";import{Te}from"./site-vr8xgfg5.js";import{o}from"./site-8nsc0rx2.js";class um extends Ne{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",R,e.type),this.value=this.registerDataOutput("value",R),this.index=this.registerDataInput("index",R,new Te(jt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=bc(e.assetsContext,s,jt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function fm(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",um)}fm();
export{um,fm};

//# debugId=FFC3B937B628741C64756E2164756E21
//# sourceMappingURL=site-wfce5fyg.js.map
