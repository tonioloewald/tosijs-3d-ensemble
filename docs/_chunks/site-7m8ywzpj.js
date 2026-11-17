import{Mh,be,si}from"./site-3s1j98fr.js";import{A}from"./site-2m9hnh4q.js";import{ge}from"./site-2t7svfbg.js";import{o}from"./site-ny31phz1.js";class r_ extends be{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",A,e.type),this.value=this.registerDataOutput("value",A),this.index=this.registerDataInput("index",A,new ge(si(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=Mh(e.assetsContext,s,si(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function s_(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",r_)}
export{r_,s_};

//# debugId=AD234E98765AAB0F64756E2164756E21
//# sourceMappingURL=site-7m8ywzpj.js.map
