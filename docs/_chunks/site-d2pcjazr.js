import{vc,Le,jt}from"./site-7z4hmt54.js";import{w}from"./site-169k801a.js";import{ye}from"./site-ytqq3d95.js";import{o}from"./site-g2k0zkaa.js";class am extends Le{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",w,e.type),this.value=this.registerDataOutput("value",w),this.index=this.registerDataInput("index",w,new ye(jt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=vc(e.assetsContext,s,jt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function lm(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",am)}lm();
export{am,lm};

//# debugId=546E217CA625445664756E2164756E21
//# sourceMappingURL=site-d2pcjazr.js.map
