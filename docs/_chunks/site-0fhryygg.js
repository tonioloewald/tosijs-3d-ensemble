import{xs as p}from"./site-kfkpy7ah.js";import{Fs as s}from"./site-efy4jtqr.js";import{Ku as a}from"./site-18c2qzzn.js";import{Pu as t}from"./site-y0mephjk.js";import{gv as o}from"./site-e7a247s4.js";import{lF as i}from"./site-54y5gp1n.js";class l extends a{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",t,e.type),this.value=this.registerDataOutput("value",t),this.index=this.registerDataInput("index",t,new o(s(e.index??-1)))}_updateOutputs(e){let h=this.type.getValue(e),n=this.index.getValue(e),m=p(e.assetsContext,h,s(n),this.config.useIndexAsUniqueId);this.value.setValue(m,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var r=!1;function u(){if(r)return;r=!0,i("FlowGraphGetAssetBlock",l)}u();
export{l as kp,u as lp};

//# debugId=B408D0FB10892C5F64756E2164756E21
//# sourceMappingURL=site-0fhryygg.js.map
