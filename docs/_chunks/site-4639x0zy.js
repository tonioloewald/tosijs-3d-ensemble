import{xc,Le,jt}from"./site-228z8wgn.js";import{R}from"./site-qrpgd9aj.js";import{ye}from"./site-x5hpt1ja.js";import{o}from"./site-nky97gw9.js";class am extends Le{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",R,e.type),this.value=this.registerDataOutput("value",R),this.index=this.registerDataInput("index",R,new ye(jt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=xc(e.assetsContext,s,jt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function lm(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",am)}lm();
export{am,lm};

//# debugId=D81F6E62866E91AC64756E2164756E21
//# sourceMappingURL=site-4639x0zy.js.map
