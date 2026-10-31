import{vc,Le,jt}from"./site-td3n9zy5.js";import{R}from"./site-zgpxnm1e.js";import{ye}from"./site-qjmja4h8.js";import{o}from"./site-8ek23vdm.js";class am extends Le{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",R,e.type),this.value=this.registerDataOutput("value",R),this.index=this.registerDataInput("index",R,new ye(jt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=vc(e.assetsContext,s,jt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function lm(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",am)}lm();
export{am,lm};

//# debugId=F49EEFB3DC98C73464756E2164756E21
//# sourceMappingURL=site-yvngwkj4.js.map
