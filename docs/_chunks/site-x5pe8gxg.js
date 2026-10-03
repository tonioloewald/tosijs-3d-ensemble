import{xc,Fe,qt}from"./site-x7zr027n.js";import{R}from"./site-0860aw80.js";import{Ee}from"./site-0fa9tw7q.js";import{o}from"./site-j9pt9hg9.js";class am extends Fe{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",R,e.type),this.value=this.registerDataOutput("value",R),this.index=this.registerDataInput("index",R,new Ee(qt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=xc(e.assetsContext,s,qt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function lm(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",am)}lm();
export{am,lm};

//# debugId=8BE86DF50E7FD33B64756E2164756E21
//# sourceMappingURL=site-x5pe8gxg.js.map
