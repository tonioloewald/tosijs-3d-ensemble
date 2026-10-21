import{xc,Le,jt}from"./site-g4m6yns1.js";import{w}from"./site-4xj1x7pw.js";import{ye}from"./site-k84zwqbg.js";import{o}from"./site-w5qxkse6.js";class am extends Le{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",w,e.type),this.value=this.registerDataOutput("value",w),this.index=this.registerDataInput("index",w,new ye(jt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=xc(e.assetsContext,s,jt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function lm(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",am)}lm();
export{am,lm};

//# debugId=F3F73C7253F8CB5C64756E2164756E21
//# sourceMappingURL=site-90vc2455.js.map
