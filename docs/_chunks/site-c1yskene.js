import{vc,Fe,qt}from"./site-gh92gf7j.js";import{R}from"./site-j8hq6r34.js";import{Ee}from"./site-n6f5fqea.js";import{o}from"./site-jx9g7gwh.js";class tm extends Fe{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",R,e.type),this.value=this.registerDataOutput("value",R),this.index=this.registerDataInput("index",R,new Ee(qt(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=vc(e.assetsContext,s,qt(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function im(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",tm)}im();
export{tm,im};

//# debugId=BE3AAA1EDDA064BC64756E2164756E21
//# sourceMappingURL=site-c1yskene.js.map
