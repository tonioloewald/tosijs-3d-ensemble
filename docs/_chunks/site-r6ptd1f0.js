import{vc,Fe,qt}from"./site-e2p70xxb.js";import{A}from"./site-pb29jqm8.js";import{Ce}from"./site-9zkrtmwf.js";import{o}from"./site-jv0cbgr5.js";class tm extends Fe{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",A,e.type),this.value=this.registerDataOutput("value",A),this.index=this.registerDataInput("index",A,new Ce(qt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=vc(e.assetsContext,s,qt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function im(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",tm)}im();
export{tm,im};

//# debugId=0EDEB99B6F37A7BA64756E2164756E21
//# sourceMappingURL=site-r6ptd1f0.js.map
