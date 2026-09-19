import{vs as p}from"./site-36an606f.js";import{Ds as s}from"./site-3fcadxwq.js";import{Iu as a}from"./site-rab9t16m.js";import{Nu as t}from"./site-p0rrvqfa.js";import{ev as o}from"./site-8hb0g46e.js";import{jF as i}from"./site-6873nq4n.js";class l extends a{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",t,e.type),this.value=this.registerDataOutput("value",t),this.index=this.registerDataInput("index",t,new o(s(e.index??-1)))}_updateOutputs(e){let h=this.type.getValue(e),n=this.index.getValue(e),m=p(e.assetsContext,h,s(n),this.config.useIndexAsUniqueId);this.value.setValue(m,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var r=!1;function u(){if(r)return;r=!0,i("FlowGraphGetAssetBlock",l)}u();
export{l as ip,u as jp};

//# debugId=B59C5BBD30D0934D64756E2164756E21
//# sourceMappingURL=site-tcyvnr98.js.map
