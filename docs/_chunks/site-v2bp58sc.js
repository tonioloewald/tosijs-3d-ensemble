import{xc,Le,jt}from"./site-vc4knhgc.js";import{w}from"./site-1fkjz1t9.js";import{ye}from"./site-yx734esp.js";import{o}from"./site-bg3xbkq8.js";class am extends Le{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",w,e.type),this.value=this.registerDataOutput("value",w),this.index=this.registerDataInput("index",w,new ye(jt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=xc(e.assetsContext,s,jt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function lm(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",am)}lm();
export{am,lm};

//# debugId=F3F73C7253F8CB5C64756E2164756E21
//# sourceMappingURL=site-v2bp58sc.js.map
